<?php
require_once 'config.php';
requireLogin();

$message = '';
$error = '';
$action = $_GET['action'] ?? 'list';
$editId = $_GET['id'] ?? null;

$data = getJsonData(NEWS_FILE);
if (!isset($data['announcements'])) {
    $data['announcements'] = [];
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postAction = $_POST['post_action'] ?? '';

    if ($postAction === 'create' || $postAction === 'update') {
        $announcement = [
            'id' => $postAction === 'update' ? $_POST['id'] : generateId(),
            'title_en' => sanitizeInput($_POST['title_en']),
            'title_el' => sanitizeInput($_POST['title_el']),
            'content_en' => sanitizeInput($_POST['content_en']),
            'content_el' => sanitizeInput($_POST['content_el']),
            'link_url' => sanitizeInput($_POST['link_url']),
            'category' => sanitizeInput($_POST['category']),
            'pinned' => isset($_POST['pinned']),
            'created_at' => $postAction === 'update' ? $_POST['created_at'] : date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        if ($postAction === 'update') {
            $index = array_search($_POST['id'], array_column($data['announcements'], 'id'));
            if ($index !== false) {
                $data['announcements'][$index] = $announcement;
                $message = 'Announcement updated successfully!';
            }
        } else {
            array_unshift($data['announcements'], $announcement);
            $message = 'Announcement created successfully!';
        }

        saveJsonData(NEWS_FILE, $data);
        $action = 'list';

    } elseif ($postAction === 'delete' && isset($_POST['id'])) {
        $data['announcements'] = array_filter($data['announcements'], fn($a) => $a['id'] !== $_POST['id']);
        $data['announcements'] = array_values($data['announcements']);
        saveJsonData(NEWS_FILE, $data);
        $message = 'Announcement deleted successfully!';
    }
}

// Get announcement for editing
$editAnnouncement = null;
if ($action === 'edit' && $editId) {
    foreach ($data['announcements'] as $announcement) {
        if ($announcement['id'] === $editId) {
            $editAnnouncement = $announcement;
            break;
        }
    }
}

include 'templates/header.php';
?>

<main class="main-content">
    <header class="content-header">
        <h2><?php echo $action === 'list' ? 'News & Announcements' : ($action === 'edit' ? 'Edit Announcement' : 'New Announcement'); ?></h2>
        <p>Manage news items for the News page</p>
    </header>

    <?php if ($message): ?>
        <div class="alert alert-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <?php echo $message; ?>
        </div>
    <?php endif; ?>

    <?php if ($action === 'list'): ?>
        <div class="content-panel">
            <div class="panel-header">
                <h3>All Announcements (<?php echo count($data['announcements']); ?>)</h3>
                <a href="?action=new" class="btn btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Announcement
                </a>
            </div>

            <?php if (empty($data['announcements'])): ?>
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h4>No announcements yet</h4>
                    <p>Create your first news announcement</p>
                </div>
            <?php else: ?>
                <div class="items-list">
                    <?php foreach ($data['announcements'] as $announcement): ?>
                        <div class="item-card">
                            <div class="item-preview" style="<?php echo $announcement['pinned'] ? 'border-color: #ff7aec;' : ''; ?>">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <div class="item-content">
                                <h4>
                                    <?php if ($announcement['pinned']): ?>
                                        <span style="color: #ff7aec;">&#x1F4CC;</span>
                                    <?php endif; ?>
                                    <?php echo htmlspecialchars($announcement['title_en']); ?>
                                </h4>
                                <p><?php echo htmlspecialchars($announcement['content_en']); ?></p>
                                <div class="item-meta">
                                    <span>Category: <?php echo htmlspecialchars($announcement['category']); ?></span>
                                    <span>Created: <?php echo date('M j, Y', strtotime($announcement['created_at'])); ?></span>
                                </div>
                            </div>
                            <div class="item-actions">
                                <a href="?action=edit&id=<?php echo $announcement['id']; ?>" class="btn btn-secondary btn-sm">Edit</a>
                                <form method="POST" style="display:inline" onsubmit="return confirm('Are you sure you want to delete this announcement?')">
                                    <input type="hidden" name="post_action" value="delete">
                                    <input type="hidden" name="id" value="<?php echo $announcement['id']; ?>">
                                    <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

    <?php else: ?>
        <div class="content-panel">
            <form method="POST">
                <input type="hidden" name="post_action" value="<?php echo $editAnnouncement ? 'update' : 'create'; ?>">
                <?php if ($editAnnouncement): ?>
                    <input type="hidden" name="id" value="<?php echo $editAnnouncement['id']; ?>">
                    <input type="hidden" name="created_at" value="<?php echo $editAnnouncement['created_at']; ?>">
                <?php endif; ?>

                <div class="form-row">
                    <div class="form-group">
                        <label for="title_en">Title (English)</label>
                        <input type="text" id="title_en" name="title_en" required
                               value="<?php echo $editAnnouncement ? htmlspecialchars($editAnnouncement['title_en']) : ''; ?>">
                    </div>
                    <div class="form-group">
                        <label for="title_el">Title (Greek)</label>
                        <input type="text" id="title_el" name="title_el" required
                               value="<?php echo $editAnnouncement ? htmlspecialchars($editAnnouncement['title_el']) : ''; ?>">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="content_en">Content (English)</label>
                        <textarea id="content_en" name="content_en" required><?php echo $editAnnouncement ? htmlspecialchars($editAnnouncement['content_en']) : ''; ?></textarea>
                    </div>
                    <div class="form-group">
                        <label for="content_el">Content (Greek)</label>
                        <textarea id="content_el" name="content_el" required><?php echo $editAnnouncement ? htmlspecialchars($editAnnouncement['content_el']) : ''; ?></textarea>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="link_url">Link URL (optional)</label>
                        <input type="url" id="link_url" name="link_url"
                               value="<?php echo $editAnnouncement ? htmlspecialchars($editAnnouncement['link_url']) : ''; ?>"
                               placeholder="https://example.com/more-info">
                        <p class="form-hint">Link for "Read more" or related content</p>
                    </div>
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" name="category" required>
                            <option value="general" <?php echo ($editAnnouncement && $editAnnouncement['category'] === 'general') ? 'selected' : ''; ?>>General</option>
                            <option value="competition" <?php echo ($editAnnouncement && $editAnnouncement['category'] === 'competition') ? 'selected' : ''; ?>>Competition</option>
                            <option value="event" <?php echo ($editAnnouncement && $editAnnouncement['category'] === 'event') ? 'selected' : ''; ?>>Event</option>
                            <option value="update" <?php echo ($editAnnouncement && $editAnnouncement['category'] === 'update') ? 'selected' : ''; ?>>Site Update</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" name="pinned" <?php echo ($editAnnouncement && $editAnnouncement['pinned']) ? 'checked' : ''; ?>
                               style="width: 18px; height: 18px;">
                        Pin this announcement (shows at top)
                    </label>
                </div>

                <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="submit" class="btn btn-primary">
                        <?php echo $editAnnouncement ? 'Update Announcement' : 'Create Announcement'; ?>
                    </button>
                    <a href="news.php" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    <?php endif; ?>
</main>

<?php include 'templates/footer.php'; ?>
