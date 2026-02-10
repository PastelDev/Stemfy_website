<?php
/**
 * GitHub Sync
 *
 * Syncs the Plesk document root to GitHub by committing all changes,
 * pushing to a timestamped branch, and creating a pull request.
 *
 * Required constants in credentials.php:
 *   GITHUB_TOKEN  – Fine-grained Personal Access Token (contents:write, pull_requests:write)
 *   GITHUB_REPO   – "owner/repo" (e.g. "PastelDev/Stemfy_website")
 *
 * Optional:
 *   GITHUB_BASE_BRANCH – target branch for the PR (default: "master")
 */

require_once 'config.php';
requireLogin();

$message = '';
$error   = '';
$prUrl   = '';

$repoRoot   = dirname(__DIR__);
$baseBranch = defined('GITHUB_BASE_BRANCH') ? GITHUB_BASE_BRANCH : 'master';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Run a git command inside the repository root.
 * Returns ['output' => string, 'code' => int].
 */
function runGit($cmd) {
    $full = sprintf('cd %s && %s 2>&1', escapeshellarg($GLOBALS['repoRoot']), $cmd);
    $output     = [];
    $returnCode = -1;
    exec($full, $output, $returnCode);
    return ['output' => implode("\n", $output), 'code' => $returnCode];
}

/** Replace any occurrence of the GitHub token in text so it is never leaked. */
function maskToken($text) {
    if (defined('GITHUB_TOKEN') && GITHUB_TOKEN) {
        return str_replace(GITHUB_TOKEN, '****', $text);
    }
    return $text;
}

/** Parse a single git-status porcelain line into [code, file]. */
function parseStatusLine($line) {
    if (strlen($line) < 4) {
        return null;
    }
    $code = substr($line, 0, 2);
    $file = substr($line, 3);
    return ['code' => $code, 'file' => $file];
}

/** Map a two-char porcelain code to a human-readable label. */
function statusLabel($code) {
    $c = trim($code);
    $map = [
        'M'  => 'Modified',
        'A'  => 'Added',
        'D'  => 'Deleted',
        'R'  => 'Renamed',
        'C'  => 'Copied',
        '??' => 'New',
        '!!' => 'Ignored',
        'MM' => 'Modified',
        'AM' => 'Added',
        'UU' => 'Conflict',
    ];
    return $map[$c] ?? 'Changed';
}

/** Map a status label to a CSS modifier class. */
function statusClass($code) {
    $c = trim($code);
    if ($c === 'D')  return 'deleted';
    if ($c === '??' || $c === 'A' || $c === 'AM') return 'added';
    return 'modified';
}

/**
 * Create a pull request on GitHub via the REST API.
 * Returns ['ok' => bool, 'url' => string, 'error' => string].
 */
function createPullRequest($head, $base, $title, $body) {
    $apiUrl = 'https://api.github.com/repos/' . GITHUB_REPO . '/pulls';

    $payload = json_encode([
        'title' => $title,
        'body'  => $body,
        'head'  => $head,
        'base'  => $base,
    ]);

    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . GITHUB_TOKEN,
            'Accept: application/vnd.github+json',
            'Content-Type: application/json',
            'User-Agent: STEMfy-Plesk-Sync/1.0',
            'X-GitHub-Api-Version: 2022-11-28',
        ],
        CURLOPT_TIMEOUT => 30,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        return ['ok' => false, 'url' => '', 'error' => 'Connection error: ' . $curlErr];
    }

    $data = json_decode($response, true);

    if ($httpCode === 201 && !empty($data['html_url'])) {
        return ['ok' => true, 'url' => $data['html_url'], 'error' => ''];
    }

    $msg = $data['message'] ?? 'Unknown error';
    if (!empty($data['errors'])) {
        foreach ($data['errors'] as $e) {
            $msg .= ' — ' . ($e['message'] ?? json_encode($e));
        }
    }

    return ['ok' => false, 'url' => '', 'error' => "HTTP {$httpCode}: {$msg}"];
}

/* ------------------------------------------------------------------ */
/*  Prerequisite checks                                                */
/* ------------------------------------------------------------------ */

$execDisabled = in_array('exec', array_map('trim', explode(',', ini_get('disable_functions'))), true);

$checks = [
    'exec'   => function_exists('exec') && !$execDisabled,
    'curl'   => function_exists('curl_init'),
    'git'    => false,
    'repo'   => is_dir($repoRoot . '/.git'),
    'config' => defined('GITHUB_TOKEN') && GITHUB_TOKEN && defined('GITHUB_REPO') && GITHUB_REPO,
];

if ($checks['exec']) {
    $gitVer = runGit('git --version');
    $checks['git'] = ($gitVer['code'] === 0);
}

$allOk = !in_array(false, $checks, true);

/* ------------------------------------------------------------------ */
/*  Current git status                                                 */
/* ------------------------------------------------------------------ */

$statusLines    = [];
$lastCommitInfo = '';

if ($checks['git'] && $checks['repo']) {
    $raw = runGit('git status --porcelain');
    $statusLines = array_values(array_filter(
        array_map('trim', explode("\n", $raw['output']))
    ));

    $log = runGit('git log -1 --format="%h — %s (%ar)"');
    if ($log['code'] === 0) {
        $lastCommitInfo = trim($log['output']);
    }
}

/* ------------------------------------------------------------------ */
/*  Handle POST — perform sync                                        */
/* ------------------------------------------------------------------ */

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['sync_action'] ?? '') === 'sync') {
    if (!isValidCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security check failed. Please refresh and try again.';
    } elseif (!$allOk) {
        $error = 'Prerequisites not met. See the checklist above.';
    } elseif (empty($statusLines)) {
        $error = 'There are no uncommitted changes to sync.';
    } else {
        $timestamp  = date('Ymd-His');
        $branchName = 'sync/' . $timestamp;
        $commitMsg  = trim($_POST['commit_message'] ?? '');
        if ($commitMsg === '') {
            $commitMsg = 'Sync from Plesk: ' . date('Y-m-d H:i:s');
        }

        /* Ensure git identity is configured (needed for commits) */
        $nameChk  = runGit('git config user.name');
        $emailChk = runGit('git config user.email');
        if ($nameChk['code'] !== 0 || trim($nameChk['output']) === '') {
            runGit('git config user.name ' . escapeshellarg('STEMfy Admin'));
        }
        if ($emailChk['code'] !== 0 || trim($emailChk['output']) === '') {
            runGit('git config user.email ' . escapeshellarg('admin@stemfy.gr'));
        }

        /* 1. Stage all changes (respects .gitignore) */
        $add = runGit('git add -A');
        if ($add['code'] !== 0) {
            $error = 'Staging failed: ' . maskToken($add['output']);
        }

        /* 2. Commit */
        if (!$error) {
            $commit = runGit('git commit -m ' . escapeshellarg($commitMsg));
            if (strpos($commit['output'], 'nothing to commit') !== false) {
                $error = 'Nothing to commit after staging (files may be gitignored).';
            } elseif ($commit['code'] !== 0) {
                $error = 'Commit failed: ' . maskToken($commit['output']);
            }
        }

        /* 3. Push HEAD to a new remote branch (token used only at runtime) */
        if (!$error) {
            $pushUrl = sprintf(
                'https://%s@github.com/%s.git',
                GITHUB_TOKEN,
                GITHUB_REPO
            );
            $refspec = 'HEAD:refs/heads/' . $branchName;
            $pushCmd = sprintf('git push %s %s', escapeshellarg($pushUrl), $refspec);
            $push    = runGit($pushCmd);

            if ($push['code'] !== 0) {
                $error = 'Push failed: ' . maskToken($push['output']);
            }
        }

        /* 4. Create pull request via GitHub API */
        if (!$error) {
            $prTitle = 'Plesk Sync — ' . date('Y-m-d H:i');
            $prBody  = "## Automated Sync from Plesk\n\n";
            $prBody .= '**Commit message:** ' . $commitMsg . "\n";
            $prBody .= '**Date:** ' . date('Y-m-d H:i:s T') . "\n";
            $prBody .= '**Admin:** ' . ($_SESSION['admin_username'] ?? 'admin') . "\n\n";
            $prBody .= "### Changed files\n";
            foreach ($statusLines as $line) {
                $prBody .= '- `' . $line . "`\n";
            }

            $pr = createPullRequest($branchName, $baseBranch, $prTitle, $prBody);

            if ($pr['ok']) {
                $prUrl   = $pr['url'];
                $message = 'Sync complete — pull request created.';

                /* Refresh local status */
                $raw = runGit('git status --porcelain');
                $statusLines = array_values(array_filter(
                    array_map('trim', explode("\n", $raw['output']))
                ));
                $log = runGit('git log -1 --format="%h — %s (%ar)"');
                if ($log['code'] === 0) {
                    $lastCommitInfo = trim($log['output']);
                }
            } else {
                $error = 'Branch &ldquo;' . htmlspecialchars($branchName)
                       . '&rdquo; was pushed, but PR creation failed: '
                       . htmlspecialchars($pr['error']);
            }
        }
    }
}

include 'templates/header.php';
?>

<main class="main-content">
    <header class="content-header">
        <h2>GitHub Sync</h2>
        <p>Push Plesk changes to GitHub as a pull request</p>
    </header>

    <?php if ($message): ?>
        <div class="alert alert-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div>
                <?php echo $message; ?>
                <?php if ($prUrl): ?>
                    <br><a href="<?php echo htmlspecialchars($prUrl); ?>" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">View Pull Request</a>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <!-- Prerequisites -->
    <div class="content-panel">
        <div class="panel-header">
            <h3>Prerequisites</h3>
        </div>
        <div class="sync-checks">
            <?php
            $labels = [
                'exec'   => 'PHP exec() enabled',
                'curl'   => 'PHP cURL extension',
                'git'    => 'Git installed on server',
                'repo'   => 'Git repository initialized',
                'config' => 'GITHUB_TOKEN &amp; GITHUB_REPO configured',
            ];
            foreach ($checks as $key => $ok): ?>
                <div class="sync-check <?php echo $ok ? 'check-ok' : 'check-fail'; ?>">
                    <?php if ($ok): ?>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <?php else: ?>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    <?php endif; ?>
                    <span><?php echo $labels[$key]; ?></span>
                </div>
            <?php endforeach; ?>
        </div>

        <?php if (!$checks['config']): ?>
            <div class="sync-setup-hint">
                <p>Add these lines to <code>admin/credentials.php</code> (this file is gitignored):</p>
                <pre>define('GITHUB_TOKEN', 'ghp_YourTokenHere');
define('GITHUB_REPO',  'PastelDev/Stemfy_website');</pre>
                <p>Create a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">fine-grained token</a> with <strong>Contents: Read &amp; Write</strong> and <strong>Pull requests: Read &amp; Write</strong> permissions scoped to your repository.</p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Changed files -->
    <div class="content-panel">
        <div class="panel-header">
            <h3>Pending Changes (<?php echo count($statusLines); ?>)</h3>
            <?php if ($lastCommitInfo): ?>
                <span class="sync-last-commit">Last commit: <?php echo htmlspecialchars($lastCommitInfo); ?></span>
            <?php endif; ?>
        </div>

        <?php if (empty($statusLines)): ?>
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <h4>Everything is up to date</h4>
                <p>No uncommitted changes detected in the working tree.</p>
            </div>
        <?php else: ?>
            <div class="sync-file-list">
                <?php foreach ($statusLines as $line):
                    $parsed = parseStatusLine($line);
                    if (!$parsed) continue;
                    $cls   = statusClass($parsed['code']);
                    $label = statusLabel($parsed['code']);
                ?>
                    <div class="sync-file <?php echo 'sync-file--' . $cls; ?>">
                        <span class="sync-file-badge"><?php echo htmlspecialchars($label); ?></span>
                        <code class="sync-file-path"><?php echo htmlspecialchars($parsed['file']); ?></code>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Sync form -->
    <?php if ($allOk && !empty($statusLines)): ?>
        <div class="content-panel">
            <div class="panel-header">
                <h3>Create Sync Pull Request</h3>
            </div>
            <form method="POST">
                <input type="hidden" name="sync_action" value="sync">
                <?php echo csrfInputField(); ?>

                <div class="form-group">
                    <label for="commit_message">Commit Message (optional)</label>
                    <input type="text" id="commit_message" name="commit_message"
                           placeholder="Sync from Plesk: <?php echo date('Y-m-d H:i:s'); ?>">
                    <p class="form-hint">Leave blank for an automatic timestamp message. Changes will be pushed to a <code>sync/</code> branch and a pull request will be opened against <code><?php echo htmlspecialchars($baseBranch); ?></code>.</p>
                </div>

                <div class="form-actions" style="display:flex;gap:1rem;margin-top:1.5rem;">
                    <button type="submit" class="btn btn-primary" onclick="return confirm('Push all pending changes to GitHub as a pull request?')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                        Sync to GitHub
                    </button>
                </div>
            </form>
        </div>
    <?php endif; ?>

    <!-- Security note -->
    <div class="content-panel">
        <div class="panel-header">
            <h3>How It Works</h3>
        </div>
        <div class="sync-info">
            <ol>
                <li><strong>Stage &amp; Commit</strong> — All changed files are staged (<code>git add -A</code>). The <code>.gitignore</code> ensures <code>credentials.php</code> and other sensitive files are never included.</li>
                <li><strong>Push Branch</strong> — The commit is pushed to a timestamped branch (<code>sync/YYYYMMDD-HHMMSS</code>) on GitHub. Your live branch is not modified on the remote.</li>
                <li><strong>Pull Request</strong> — A PR is automatically created from the sync branch into <code><?php echo htmlspecialchars($baseBranch); ?></code> so you can review before merging.</li>
            </ol>
        </div>
    </div>
</main>

<?php include 'templates/footer.php'; ?>
