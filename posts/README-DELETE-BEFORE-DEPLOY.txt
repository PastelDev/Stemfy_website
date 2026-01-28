IMPORTANT: DELETE THIS FOLDER BEFORE DEPLOYING TO GITHUB

This folder (posts/) contains:
- credentials.php: Admin login credentials
- posts.json: Posts and educational resources data
- news.json: News/announcements data

DEPLOYMENT PROCESS:
==================

1. BEFORE pushing to GitHub:
   - Delete this entire 'posts/' folder from the repository
   - This prevents credentials and data from being exposed publicly

2. AFTER deploying to Plesk hosting:
   - Manually upload this 'posts/' folder to the root of your website
   - Make sure the folder structure is:
     /posts/
       ├── credentials.php
       ├── posts.json
       └── news.json

3. Update credentials:
   - Edit credentials.php on the server
   - Change ADMIN_USERNAME and ADMIN_PASSWORD to secure values

4. Set folder permissions:
   - Ensure the posts/ folder is writable by the web server (755 or 775)
   - JSON files should be writable (644 or 664)

BACKUP:
=======
You can download a backup of this folder from:
https://stemfy.gr/admin/download-backup.php

This creates a ZIP file of the posts/ folder that you can save locally.
