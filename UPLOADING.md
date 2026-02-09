# Uploading Content (No WordPress Needed)

This project is set up so you can publish directly from the built-in admin panel.
You do not need to use WordPress for normal updates.

## 1. Open the Admin Panel

1. Go to `https://your-domain/admin/login.php` (or local: `http://localhost:8000/admin/login.php`).
2. Sign in with the credentials from `admin/credentials.php`.

## 2. Upload Posts (Social Feed)

1. Open `Posts`.
2. Click `Add New Post`.
3. Fill in:
   - English and Greek title
   - English and Greek description
4. Optionally set `Upload Folder` (example: `2026/instagram`).
5. Choose one or more media files (images/videos).
6. Click `Create Post`.

Notes:
- Supported media: JPG, PNG, GIF, WebP, MP4, WebM, MOV.
- Max file size is controlled by `UPLOAD_MAX_SIZE` in `admin/config.php` (default 50 MB).

## 3. Upload Resources (PDFs)

1. Open `Resources`.
2. Click `Add Resource`.
3. Fill in bilingual title/description.
4. Upload a PDF.
5. Select type (`pdf`, `infographic`, `guide`, `video`, `other`).
6. Click `Create Resource`.

## 4. Upload News / Announcements

1. Open `News`.
2. Click `Add Announcement`.
3. Fill in bilingual title/content.
4. Pick category and optionally pin it.
5. Optionally attach a PDF.
6. Click `Create Announcement`.

## 5. Verify Frontend

After publishing, check:

- `posts.html` for posts/resources
- `news.html` for announcements

The frontend reads from local API first (`/admin/api.php`) and only falls back to WordPress if local API is unavailable.

## 6. Create Backups

Run backups before large edits or deployments:

- Windows PowerShell:
  - `powershell -ExecutionPolicy Bypass -File scripts/backup-content.ps1`
- Linux/macOS:
  - `bash scripts/backup-content.sh`

Backups include available content directories:

- `posts`
- `admin/data`
- `admin/uploads`
