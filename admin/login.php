<?php
require_once 'config.php';

$error = '';
$notConfigured = !ADMIN_USERNAME || !ADMIN_PASSWORD;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$notConfigured) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        header('Location: index.php');
        exit;
    } else {
        $error = 'Invalid username or password';
    }
}

// Redirect if already logged in
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - STEMfy.gr</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="../assets/logo.png">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: linear-gradient(135deg, #0a0812 0%, #1a1025 50%, #0a0812 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f8f4ff;
        }

        .login-container {
            background: rgba(18, 12, 28, 0.9);
            border: 1px solid rgba(176, 138, 240, 0.3);
            border-radius: 24px;
            padding: 2.5rem;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }

        .logo h1 {
            font-size: 1.8rem;
            font-weight: 700;
        }

        .logo h1 span {
            color: #b08af0;
        }

        .logo p {
            color: rgba(248, 244, 255, 0.6);
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }

        .error {
            background: rgba(255, 100, 100, 0.15);
            border: 1px solid rgba(255, 100, 100, 0.4);
            color: #ff8080;
            padding: 0.75rem 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
        }

        .form-group {
            margin-bottom: 1.25rem;
        }

        label {
            display: block;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: rgba(248, 244, 255, 0.9);
        }

        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 0.85rem 1rem;
            background: rgba(176, 138, 240, 0.08);
            border: 1px solid rgba(176, 138, 240, 0.25);
            border-radius: 10px;
            color: #f8f4ff;
            font-family: inherit;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: rgba(176, 138, 240, 0.5);
            background: rgba(176, 138, 240, 0.12);
        }

        button {
            width: 100%;
            padding: 0.9rem;
            background: linear-gradient(135deg, #b08af0 0%, #9060d0 100%);
            border: none;
            border-radius: 10px;
            color: white;
            font-family: inherit;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(176, 138, 240, 0.4);
        }

        .back-link {
            display: block;
            text-align: center;
            margin-top: 1.5rem;
            color: rgba(248, 244, 255, 0.6);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s ease;
        }

        .back-link:hover {
            color: #b08af0;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>STEM<span>fy.gr</span></h1>
            <p>Admin Panel</p>
        </div>

        <?php if ($notConfigured): ?>
            <div class="error" style="background: rgba(255, 200, 100, 0.15); border-color: rgba(255, 200, 100, 0.4); color: #ffcc80;">
                <strong>Setup required:</strong> Create credentials file.<br><br>
                Using Plesk File Manager, create:<br>
                <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">admin/credentials.php</code><br><br>
                With this content:<br>
                <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; display: block; margin-top: 4px; white-space: pre; font-size: 0.8rem;">
&lt;?php
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'your_password');</code>
            </div>
        <?php elseif ($error): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="POST" <?php echo $notConfigured ? 'style="opacity: 0.5; pointer-events: none;"' : ''; ?>>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autocomplete="username">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>

            <button type="submit">Sign In</button>
        </form>

        <a href="../index.html" class="back-link">&larr; Back to website</a>
    </div>
</body>
</html>
