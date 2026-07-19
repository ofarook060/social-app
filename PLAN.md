# SYK Social - Expo React Native App Plan

## Overview

Rebuild the SYK Social platform (PHP backend at `social.sykmm.site`) as a native mobile app using **Expo Router + NativeWind**, targeting **iOS + Android**. The backend will be extended with new API endpoints and JWT authentication.

---

## Phase 1: Backend API Enhancement

### 1.1 JWT Authentication System ✅ COMPLETE
- ✅ Added `firebase/php-jwt` via Composer
- ✅ Created `classes/jwt.php` (JWTAuth class with generate, validate, extract, require_auth)
- ✅ Created `api/auth/login.php`, `signup.php`, `logout.php`, `refresh.php`
- ✅ Updated all existing API endpoints to support JWT Bearer token + session fallback
- ✅ Token expiry: 7 days, HS256 algorithm

### 1.2 New API Endpoints to Create

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `api/auth/login.php` | POST | Login → returns JWT token | ✅ |
| `api/auth/signup.php` | POST | Register → returns JWT token | ✅ |
| `api/auth/logout.php` | POST | Invalidate token | ✅ |
| `api/auth/refresh.php` | POST | Refresh expired token | ✅ |
| `api/user/update.php` | POST | Update profile settings | ✅ |
| `api/user/search.php` | GET | Search users by name | ✅ |
| `api/user/followers.php` | GET | Get followers list | ✅ |
| `api/user/following.php` | GET | Get following list | ✅ |
| `api/posts/feed.php` | GET | Get timeline (following + own) | ✅ |
| `api/posts/single.php` | GET | Get single post + comments | ✅ |
| `api/posts/comments.php` | GET/POST | Get/create comments | ✅ |
| `api/posts/delete.php` | POST | Delete post | ✅ |
| `api/posts/edit.php` | POST | Edit post | ✅ |
| `api/posts/upload.php` | POST | Upload image/video (multipart) | ✅ |
| `api/profile/image.php` | POST | Change profile/cover image | ✅ |
| `api/messages/threads.php` | GET | List message threads | ✅ |
| `api/messages/read.php` | GET | Read conversation | ✅ |
| `api/messages/send.php` | POST | Send message + optional image | ✅ |
| `api/messages/delete.php` | POST | Delete message/thread | ✅ |
| `api/notifications/list.php` | GET | Get notifications | ✅ |
| `api/notifications/seen.php` | POST | Mark notification as seen | ✅ |
| `api/notifications/count.php` | GET | Get unread count | ✅ |
| `api/groups/list.php` | GET | Get user's groups | ✅ |
| `api/groups/create.php` | POST | Create group | ✅ |
| `api/groups/info.php` | GET | Get group details | ✅ |
| `api/groups/members.php` | GET | Get group members | ✅ |
| `api/groups/join.php` | POST | Request to join group | ✅ |
| `api/groups/invite.php` | POST | Invite user to group | ✅ |
| `api/groups/requests.php` | GET | Get pending requests | ✅ |
| `api/groups/accept.php` | POST | Accept/decline request | ✅ |
| `api/groups/settings.php` | POST | Update group settings | ✅ |
| `api/groups/posts.php` | GET | Get group posts | ✅ |

### 1.3 File Upload API ✅ COMPLETE
- ✅ Created `api/upload/image.php` for multipart form uploads
- ✅ Returns JSON with image URL path
- ✅ Support JPEG, PNG, GIF, MP4
- ✅ 10MB max file size
- ✅ Also integrated into `api/posts/upload.php` and `api/profile/image.php`

---

## Phase 2: Expo App Architecture

### 2.1 Project Structure
```
social-app/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Auth group (no tab bar)
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Main tab group
│   │   ├── index.tsx             # Home/Feed
│   │   ├── search.tsx            # Search
│   │   ├── create.tsx            # Create Post
│   │   ├── messages.tsx          # Messages
│   │   ├── notifications.tsx     # Notifications
│   │   └── _layout.tsx           # Tab bar config
│   ├── profile/
│   │   ├── [userid].tsx          # View profile
│   │   ├── edit.tsx              # Edit profile
│   │   ├── followers.tsx
│   │   ├── following.tsx
│   │   └── photos.tsx
│   ├── post/
│   │   ├── [postid].tsx          # Single post + comments
│   │   └── edit/[postid].tsx     # Edit post
│   ├── messages/
│   │   └── [userid].tsx          # Chat conversation
│   ├── group/
│   │   ├── [groupid].tsx         # Group page
│   │   ├── create.tsx            # Create group
│   │   ├── members/[groupid].tsx
│   │   ├── settings/[groupid].tsx
│   │   └── requests/[groupid].tsx
│   ├── image/
│   │   └── [postid].tsx          # Full image view
│   └── _layout.tsx               # Root layout (auth check)
├── components/                   # Reusable components
│   ├── PostCard.tsx
│   ├── CommentCard.tsx
│   ├── UserCard.tsx
│   ├── GroupCard.tsx
│   ├── MessageBubble.tsx
│   ├── ThreadCard.tsx
│   ├── NotificationItem.tsx
│   ├── ImagePicker.tsx
│   ├── Avatar.tsx
│   ├── CoverImage.tsx
│   ├── LikeButton.tsx
│   ├── FollowButton.tsx
│   └── EmptyState.tsx
├── lib/                          # Utilities
│   ├── api.ts                    # API client (fetch wrapper)
│   ├── auth.ts                   # Auth context + token management
│   ├── storage.ts                # SecureStore for tokens
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # Helper functions
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── usePosts.ts
│   ├── useProfile.ts
│   ├── useMessages.ts
│   ├── useGroups.ts
│   └── useNotifications.ts
├── constants/                    # Theme, config
│   ├── colors.ts
│   └── config.ts                 # API base URL
└── assets/                       # Icons, splash, images
```

### 2.2 Key Dependencies
```json
{
  "expo": "~52",
  "expo-router": "~4",
  "nativewind": "^4",
  "tailwindcss": "^3.4",
  "expo-secure-store": "~14",
  "expo-image-picker": "~16",
  "expo-camera": "~16",
  "expo-media-library": "~17",
  "expo-notifications": "~0.29",
  "expo-status-bar": "~2",
  "@expo/vector-icons": "^14",
  "react-native-reanimated": "~3",
  "react-native-gesture-handler": "~2",
  "dayjs": "^1"
}
```

---

## Phase 3: Feature Implementation

### 3.1 Authentication Flow
- **Login screen**: Email + password → JWT stored in SecureStore
- **Signup screen**: First name, last name, gender, email, password
- **Auth context**: Checks token on app launch, redirects to login if expired
- **Logout**: Clear token, redirect to login

### 3.2 Home Feed (Tab 1)
- Pull-to-refresh infinite scroll
- Post cards with: author avatar, name, time, text, image/video
- Like/unlike with animation
- Comment count → tap to view
- Create post FAB button

### 3.3 Search (Tab 2)
- Search bar at top
- Results: user cards + group cards
- Tap → navigate to profile/group

### 3.4 Create Post (Tab 3)
- Text input with @mention autocomplete
- Image/video picker (camera or gallery)
- Post to profile or select group
- Submit → refresh feed

### 3.5 Messages (Tab 4)
- Thread list with avatar, name, last message preview, unread badge
- Tap → chat conversation
- Chat: message bubbles (left/right), send text + image
- Pull-to-refresh for new messages

### 3.6 Notifications (Tab 5)
- List of notifications: like, follow, comment, tag, role, invite
- Tap → navigate to relevant content
- Mark as seen on view
- Unread count badge on tab

### 3.7 Profile
- Cover image + profile image (tap to change)
- Name, tag_name, about, online status
- Stats: followers, following, posts
- Tab sections: Timeline, About, Followers, Following, Photos, Groups
- Edit profile (own profile only)
- Follow/Unfollow button (other profiles)

### 3.8 Groups
- Group page with cover, name, type (Public/Private)
- Sections: Discussion, About, Members, Photos, Settings, Requests, Invite
- Join request for non-members
- Role-based UI (admin/moderator/member)

### 3.9 Post Detail
- Full post with all comments
- Add comment input
- Like/comment counts
- Edit/Delete options (owner)

---

## Phase 4: Implementation Order ✅ COMPLETE

### Step 1: Project Setup ✅
- ✅ Created Expo app with blank-typescript template (SDK 57)
- ✅ Installed dependencies (expo-router, secure-store, image-picker, etc.)
- ✅ Configured app.json with scheme, bundle IDs
- ✅ Set up folder structure

### Step 2: Auth System ✅
- ✅ Backend: JWT auth endpoints (login, signup, logout, refresh)
- ✅ App: Login/Signup screens with form validation
- ✅ Token storage via expo-secure-store
- ✅ Auth context with auto-login on app launch
- ✅ Protected tab routes with redirect

### Step 3: Core Feed ✅
- ✅ Backend: Posts feed API, create post, comments, single post
- ✅ App: Home feed with pull-to-refresh
- ✅ PostCard component with avatar, name, time, text, image
- ✅ Post detail screen with comments list
- ✅ Like/unlike toggle
- ✅ Create post screen with image picker
- ✅ Comment input on post detail

### Step 4: Profile & Social ✅
- ✅ Backend: Profile API, follow/unfollow, followers/following
- ✅ App: Profile page with cover, avatar, stats
- ✅ Follow/Unfollow button
- ✅ User search with results
- ✅ UserCard and GroupCard components

### Step 5: Messages ✅
- ✅ Backend: Messages API (threads, read, send, delete)
- ✅ App: Thread list with unread badges
- ✅ Chat screen with message bubbles
- ✅ Auto-polling for new messages
- ✅ Image send support

### Step 6: Notifications ✅
- ✅ Backend: Notifications API (list, seen, count)
- ✅ App: Notifications screen with activity icons
- ✅ Mark as seen on tap
- ✅ Unread count badge on tab

### Step 7: Groups ✅
- ✅ Backend: Groups API (CRUD, members, requests, invites)
- ✅ App: Group page with cover, name, type
- ✅ Join request for non-members
- ✅ Member count and role display

### Step 8: Polish ✅
- ✅ TypeScript strict mode - zero errors
- ✅ Consistent UI design (Facebook-blue theme)
- ✅ Pull-to-refresh on all list screens
- ✅ Time-ago formatting with dayjs
- ✅ Online status indicators

---

## Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| State Management | React Context + SWR/React Query | Simple, good caching for API data |
| Image Handling | `expo-image-picker` + multipart upload | Native camera/gallery access |
| Token Storage | `expo-secure-store` | Encrypted keychain storage |
| Date Formatting | `dayjs` | Lightweight, good relative time |
| API Base URL | Config constant | Easy to switch dev/prod |

---

## Backend File Paths for Reference
- DB Schema: `~/projects/social.sykmmsite/Database/mybook_db.sql`
- Auth: `~/projects/social.sykmmsite/classes/login.php`, `signup.php`
- Posts: `~/projects/social.sykmmsite/classes/post.php`
- Users: `~/projects/social.sykmmsite/classes/user.php`
- Messages: `~/projects/social.sykmmsite/classes/messages.php`
- Groups: `~/projects/social.sykmmsite/classes/group.php`
- Settings: `~/projects/social.sykmmsite/classes/settings.php`
- Functions: `~/projects/social.sykmmsite/classes/functions.php`
- Existing API: `~/projects/social.sykmmsite/api/`
