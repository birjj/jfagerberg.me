# Copilot Instructions for jfagerberg.me

## Repository Overview

This is Johan Fagerberg's personal portfolio and blog website, built with Astro v4.4.15 and Preact. The site is a static site generator (SSG) project that compiles to static HTML/CSS/JS files for deployment. The repository contains approximately 99 source files with a total size of ~245MB (including node_modules).

**Primary Technologies:**
- **Framework**: Astro v4.4.15 (static site generator)
- **UI Library**: Preact v10.19.6 (for interactive components)
- **Language**: TypeScript with JSX (Preact)
- **Content**: MDX (Markdown with JSX components) for blog posts
- **Styling**: CSS (custom CSS in component files and layouts)
- **Runtime**: Node.js v20.19.5, npm v10.8.2

**Key Features:**
- Personal portfolio/homepage with animated WebGL background
- Blog with articles and tutorials
- Interactive components (dark mode toggle, form components in blog posts)
- Math rendering with KaTeX
- Code syntax highlighting with Expressive Code
- SEO optimization with sitemap and robots.txt generation

## Project Structure

### Root Files
- `package.json` - Dependencies and npm scripts
- `astro.config.mjs` - Astro configuration with integrations
- `tsconfig.json` - TypeScript compiler options (extends astro/tsconfigs/strict)
- `.prettierrc` - Prettier configuration for code formatting
- `.gitignore` - Git ignore patterns
- `README.md` - Basic project documentation

### Key Directories
- `src/` - All source code
  - `pages/` - Route pages (index.astro, blog.astro, blog/[...slug].astro)
  - `layouts/` - Page layouts (BaseLayout, PageLayout, BlogPostLayout) and global CSS
  - `components/` - Reusable components
    - `frontpage/` - Homepage components including Hero with WebGL shader
    - `navbar/` - Navigation components including DarkModeToggle (Preact)
    - `blog/` - Blog-specific components (Figure, Quote, Aside, Article, Title)
  - `content/` - Content collections (managed by Astro Content Collections API)
    - `config.ts` - Content collection schema definitions
    - `blog/` - Blog post MDX files organized in date-prefixed folders
  - `hooks/` - Preact hooks (use-darkmode, use-localstorage, use-mediaquery, etc.)
  - `icons/` - SVG icons
- `remark-plugins/` - Custom Remark plugins (remark-hyphenate.mjs for text hyphenation)
- `public/` - Static assets served at root (favicon.svg)
- `dist/` - Build output directory (generated, not in git)

### Configuration Files
- **Astro**: `astro.config.mjs` - Defines site URL, markdown plugins, integrations
- **TypeScript**: `tsconfig.json` - Configures JSX for Preact
- **Prettier**: `.prettierrc` - Uses prettier-plugin-astro for .astro file formatting
- **Content Collections**: `src/content/config.ts` - Defines blog schema with Zod validation

## Build and Development Commands

**IMPORTANT: Always run commands from the repository root directory.**

### Installation
```bash
npm install
```
**Time**: ~30-35 seconds  
**Prerequisites**: Node.js v20.x, npm v10.x  
**Always run this first** in a fresh environment or after pulling changes to package.json.

### Development Server
```bash
npm run dev
# or
npm start
```
**Time**: Starts in ~400-500ms  
**Result**: Runs local development server at `http://localhost:4321/` (or 4322+ if port is in use)  
**Notes**: 
- Hot module reloading enabled
- Watches for file changes automatically
- No build errors expected in dev mode
- This is the recommended way to test changes during development

### Build (Production)
```bash
npm run build
```
**Time**: ~4-6 seconds for successful build  
**Output**: Generates static site in `./dist/` directory  
**Known Issue**: Build may fail when attempting to fetch remote images from Unsplash (particularly in the kitchensink draft page). This happens when there's no network access or if the remote URL is unavailable. The kitchensink page is marked as `draft: true` and is not included in the production site navigation, but Astro still tries to build it during static site generation.

**Workaround**: If build fails on remote image fetch:
- This is expected behavior in isolated/offline environments
- The draft page (kitchensink) is for testing and not meant for production
- In a normal deployment environment with network access, the build should succeed
- The actual published blog posts do not have this issue

### Preview Build
```bash
npm run preview
```
**Prerequisites**: Must run `npm run build` first (requires dist/ folder to exist)  
**Time**: Starts in ~10ms  
**Result**: Serves the built site at `http://localhost:4321/`  
**Purpose**: Preview the production build locally before deployment

### Type Checking
```bash
npm run astro check
```
**Time**: ~2-3 seconds  
**Result**: Runs TypeScript type checking on Astro files  
**Expected Output**: 0 errors, 0 warnings, ~99 hints (hints are non-critical)

### Code Formatting
```bash
npx prettier --check .
```
**Purpose**: Check code formatting compliance  
**Expected Issues**: 
- Some files show warnings (acceptable for existing code)
- `.frag` and `.vert` shader files will show syntax errors (they are GLSL, not JavaScript)
- To auto-fix formatting issues: `npx prettier --write .`

**Note**: There is no test script defined (`npm test` will fail with "Missing script" error).

## Validation Workflow

When making code changes, follow this workflow:

1. **Make changes** to source files
2. **Run dev server** (`npm run dev`) and manually verify changes at http://localhost:4321/
3. **Check formatting** (optional): `npx prettier --check .`
4. **Build** (if not using remote images): `npm run build`
5. **Type check** (optional): `npm run astro check`

**Trust these instructions.** Only search for additional information if something doesn't work as documented or if you need details not covered here.

## Common Patterns and Conventions

### Adding a Blog Post
1. Create a new folder in `src/content/blog/` with format `YYYY-MM-DD-title-slug/`
2. Add `index.mdx` (or `index.md`) with frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   date: 2024-01-01
   tags: ["article"] # or ["tutorial"]
   draft: false # set to true to hide from production
   ---
   ```
3. Posts MUST be tagged as either "article" or "tutorial" (enforced at build time)
4. Draft posts (`draft: true`) are filtered from the blog listing but still generated as static pages

### Component Structure
- **Astro components** (.astro): Server-rendered, can contain any framework components
- **Preact components** (.tsx): Client-side interactive components, require `client:*` directive
- **Layouts**: Wrap pages with common structure (navbar, footer, meta tags)
- **Hooks**: Custom Preact hooks for common patterns (dark mode, local storage, media queries)

### Styling
- CSS is scoped by default in .astro files
- Global styles in `src/layouts/global.css` and `src/layouts/typography.css`
- CSS variables for theming (light/dark mode via `data-theme` attribute)
- No CSS preprocessor (uses vanilla CSS)

### Content Collections
- Blog posts use Astro Content Collections API
- Schema defined in `src/content/config.ts`
- Validated with Zod at build time
- Access via `getCollection('blog')` in Astro components

## Important Notes for Agents

1. **No GitHub Workflows**: This repository does not have `.github/workflows/` directory. There are no CI/CD pipelines defined in the repository itself. Deployment may be handled externally (e.g., Netlify, as mentioned in blog posts).

2. **Draft Pages**: The kitchensink page is intentionally a draft and may cause build failures in offline environments. This is not a bug that needs fixing.

3. **Shader Files**: The `.frag` and `.vert` files in `src/components/frontpage/Hero/background/` are GLSL shader code, not JavaScript. They will cause Prettier syntax errors, which is expected and acceptable.

4. **Dependencies**: The project has 11 known npm vulnerabilities (1 low, 6 moderate, 4 high) as of the last install. These are in development dependencies and don't require immediate action.

5. **Port Conflicts**: If dev server port 4321 is in use, Astro automatically tries the next available port.

6. **Custom Remark Plugin**: The project includes a custom hyphenation plugin (`remark-plugins/remark-hyphenate.mjs`) that uses the Hyphenopoly library to add soft hyphens to text content.

7. **Build Output Size**: The production build generates ~40+ HTML pages (main pages + blog posts) with optimized JS/CSS bundles typically under 50KB total.

## File Editing Guidelines

- **DO**: Make surgical, minimal changes to accomplish your goal
- **DO**: Follow the existing code style and patterns
- **DO**: Test changes with `npm run dev` before committing
- **DO NOT**: Modify shader files (.frag, .vert) unless specifically working on the WebGL background
- **DO NOT**: Remove or modify working code unnecessarily
- **DO NOT**: Change the content collections schema without understanding the impact on all blog posts
- **DO NOT**: Add new npm packages without strong justification (prefer using existing libraries)

## Quick Reference: Most Common Files

**For homepage changes**: `src/pages/index.astro`, `src/components/frontpage/`  
**For blog changes**: `src/pages/blog.astro`, `src/pages/blog/[...slug].astro`  
**For layout changes**: `src/layouts/BaseLayout.astro`, `src/layouts/PageLayout.astro`  
**For styling**: `src/layouts/global.css`, `src/layouts/typography.css`  
**For config**: `astro.config.mjs`, `src/content/config.ts`  
**For adding blog posts**: `src/content/blog/YYYY-MM-DD-slug/index.mdx`
