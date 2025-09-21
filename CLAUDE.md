# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint checks

## Project Architecture

This is a Next.js 14.2.4 social media application (SNS) with the following key technologies:

### Authentication & Database
- **Authentication**: Clerk (@clerk/nextjs) for user authentication and management
- **Database**: PostgreSQL with Prisma ORM
- **Prisma Client**: Custom generated client at `lib/generated/prisma/`

### Core Architecture Patterns

#### Database Schema (Prisma)
The application has a social media data model with:
- `User`: User profiles with bio, image, follower/following relationships
- `Post`: User posts with content
- `Like`: Post likes (unique constraint on userId + postId)
- `Reply`: Post replies/comments
- `Follow`: User follow relationships (composite primary key)

#### Server Actions Pattern
All database mutations use Next.js server actions in `lib/action.ts`:
- `addPostAction`: Creates posts with Zod validation (140 char limit)
- `likeAction`: Toggles post likes
- `followAction`: Toggles user follow relationships

#### Data Fetching
- `lib/postDataFetcher.ts`: Centralized post fetching logic
- Supports both home timeline (posts from followed users) and user profile timelines
- Includes likes count and reply count aggregations

### Component Structure

#### UI Components (`components/ui/`)
- Uses shadcn/ui components with Radix UI primitives
- Components: avatar, button, input

#### Feature Components (`components/component/`)
- `Header`: Main navigation
- `PostForm`: Post creation with server actions
- `PostList`/`Post`: Post display and interactions
- `PostInteraction`: Like/reply buttons
- `FollowButton`: Follow/unfollow functionality
- `LeftSidebar`/`RightSidebar`: Layout components

### Page Structure
- App Router with TypeScript
- Dynamic routes: `/profile/[username]`
- Authentication pages: `/sign-in`, `/sign-up`
- Clerk webhook handler: `/api/callback/clerk`

### State Management
- Server-side state with Prisma
- Client-side interactions via server actions with `revalidatePath`
- Form state managed with React's `useFormState` hook

### Styling
- Tailwind CSS with custom configuration
- Japanese language support (`lang="ja"`)
- Responsive design patterns

### Key Implementation Notes
- Clerk middleware protects routes automatically
- User identification via Clerk's `auth()` in server actions
- Error handling with Zod schema validation
- Database relationships use composite keys for follows
- Posts are ordered by creation date (newest first)