# Agent Context

## Project Overview
- **Project**: SYK Social - Mobile App
- **Backend**: PHP (vanilla) + MySQL at `~/projects/social.sykmmsite`
- **Live Server**: `https://social.sykmm.site`
- **Frontend**: Expo React Native app at `~/projects/social-app`
- **UI Framework**: Expo Router + NativeWind (Tailwind CSS)
- **Platforms**: iOS + Android

## Backend Tech Stack
- Language: PHP (vanilla, no framework)
- Database: MySQL/MariaDB via mysqli
- Auth: PHP sessions (being extended to JWT for mobile)
- Hosting: cPanel shared hosting (LiteSpeed)
- Password Hashing: SHA1 (insecure, legacy)

## Key Backend Paths
- `~/projects/social.sykmmsite/api/` - API endpoints
- `~/projects/social.sykmmsite/classes/` - PHP classes
- `~/projects/social.sykmmsite/Database/mybook_db.sql` - DB schema

## API Conventions
- Base URL: `https://social.sykmm.site/api/`
- Auth: JWT Bearer token in `Authorization` header
- Request: JSON body for POST, query params for GET
- Response: `{ "success": true/false, ...data }`
- CORS: `Access-Control-Allow-Origin: *`

## Database Tables
- `users` - Users AND groups (shared table, `type` = "profile" | "group")
- `posts` - Posts and comments (`parent` > 0 = comment)
- `likes` - Likes (JSON array) and following (JSON array)
- `messages` - Private messages (thread-based via `msgid`)
- `notifications` - Activity notifications
- `notification_seen` - Read tracking
- `content_i_follow` - Content follow for notification feed
- `group_members` - Group membership + roles
- `group_requests` - Pending join requests
- `group_invites` - Group invitations

## Running Commands
- Backend is on remote server - no local server needed
- API testing: `curl -X POST https://social.sykmm.site/api/...`
- Expo dev: `npx expo start` in `~/projects/social-app`

## Conventions
- File naming: camelCase for TS files, kebab-case for components
- API files: `snake_case.php` organized in subdirectories
- Use `addslashes()` for DB escaping (legacy pattern)
- Image paths: `uploads/{userid}/{random}.{ext}`
