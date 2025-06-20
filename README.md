# Crazy Keyboard Games Portal

A modern, beautiful HTML5 game portal built with Next.js 15+, Tailwind CSS, and TypeScript. Features a glassmorphism design, instant play, and seamless user experience. Games are sourced from a local JSON feed (games.json) and require no backend.

**v2 Portal is now live and deployed to Vercel!**

## Features

- 🎮 **Instant Play**: 100+ keyboard and mouse games, playable instantly in your browser
- ✨ **Glassmorphism Design**: Modern, frosted glass UI with gradients and depth
- 📱 **Fully Responsive**: Optimized for desktop and mobile
- 🔍 **Live Search & Tag Filtering**: Quickly find games by name or category
- 🕹️ **Recently Played**: Personalized section using localStorage (homepage only)
- ⭐ **Favorites**: Mark and revisit your favorite games (localStorage)
- 🔄 **Popular Games**: 8 random games shown on each visit
- 🗂️ **Browse by Category**: Explore games by category (no game count shown)
- 📝 **About & Contact**: Info and contact at the bottom of the homepage
- ⚡ **Performance Optimized**: SSG, lazy loading, and image optimization
- 🔒 **Privacy & Cookies**: Compliant privacy policy and cookie notice
- 🗂️ **All Games Page**: Search, filter, favorite, and play all games in one place
- ♿ **Accessibility**: Improved keyboard navigation and ARIA labels

## Homepage Layout

- **Header**: Logo, navigation (Home, Recent, Popular Games, Categories), search bar
- **Hero Banner**: Headline, subheadline, "100+ Games Available", Play Now button
- **Recently Played**: Up to 4 games, friendly empty state, View All button (homepage only)
- **Popular Games**: 8 random games (2 rows of 4), View All button
- **Browse by Category**: Category cards (no game count)
- **Favorites**: Up to 8 favorite games, persistent in localStorage
- **About & Contact**: At the bottom of the homepage
- **Footer**: © 2025 Crazy Keyboard Games. All rights reserved.
- **Privacy Policy**: Footer link (modal or page)
- **Cookie Notice**: Dismissible banner

## Data Handling

- All game data is managed in a local file (`games.json`) in the `/public` directory
- Game data is loaded at runtime using `fetch('/games.json')` (not imported)
- Recently played and favorites are stored in browser localStorage
- No backend or user login required

## Images

- Game images currently use `<img>` for simplicity and compatibility
- [TODO] Migrate to Next.js `<Image />` for best performance and LCP

## All Games Page

- Search, filter, favorite, and play all games in one place
- Does **not** show Recently Played (that is homepage only)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm (latest stable)

### Installation

1. Clone this repository
2. Navigate to the project directory:
   ```bash
   cd crazy-keyboard-games-v2
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
5. Open your browser and go to `http://localhost:3000`

## Configuration

- Place your `games.json` file in the `/public` directory.
- Update About/Contact info in the homepage section as needed.
- Privacy Policy and Cookie Notice are included by default.

## Deployment

- Deploy to Vercel for best performance and zero-config Next.js hosting.
- Environment variables are not required for basic operation.
- **Codebase is clean and Vercel build passes.**

## Legal

- Privacy Policy and Cookie Notice are included to comply with Google Ads and analytics requirements.
- All user data (favorites, recently played) is stored locally in the browser.

## License

Open source. Modify and use for your own game portal.

## SEO Meta Tags

- The project includes optimized `<title>` and `<meta name="description">` tags for the homepage and all main pages.
- Keywords are chosen based on relevance and SEO best practices, including terms like: crazy keyboard games, free games online, play games online for free, play free games online without downloading, best free online games, online games for pc, 1000 free games to play.
- Each page will have a unique, descriptive title and meta description to maximize search visibility and click-through rates.

---

Built with ❤️ for gamers who love instant, distraction-free play.
