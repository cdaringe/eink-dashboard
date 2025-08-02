# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is an e-ink dashboard system that generates and serves display-ready images
for e-ink devices. The system consists of a host server that takes screenshots
of web content and converts them to e-ink friendly grayscale images with
optional overlays.

## Architecture

The project is a monorepo with two main applications:

- **`apps/dashboard-host/`** - Core server that captures web screenshots and
  serves e-ink ready images
- **`apps/web-dashboard/`** - Next.js web application that renders dashboard
  content (recipes, air quality, news)
- **`libs/eink-dashboard-common/`** - Shared TypeScript utilities

### Key Components

1. **Host Server** (`apps/dashboard-host/src/bin/host.ts`): HTTP server with
   routes for serving images and triggering refreshes
2. **Snapshot Process** (`apps/dashboard-host/src/bin/snap.ts`): Separate
   process that captures web screenshots using Puppeteer and converts them with
   ImageMagick
3. **Dashboard Server** (`apps/web-dashboard/`): Next.js app that renders
   content to be screenshotted
4. **Image Overlays** (`apps/dashboard-host/src/lib/overlays/`): System for
   adding battery indicators and text overlays

### Dashboard Types

The system supports multiple dashboard types:

- **airquality** - Air quality monitoring with Grafana charts
- **onion** - The Onion news headlines with QR codes
- **recipes** - Recipe recommendations

### Routing

- `/dashboard` - Serves the most recently generated image (legacy
  `snapshot.png`)
- `/dashboard/:name` - Serves specific dashboard image (e.g.,
  `/dashboard/onion`)
- On-demand generation: Missing images are generated automatically when
  requested
- Scheduled generation: All dashboard images are regenerated hourly

## Development Commands

### Root Level (using rad)

- `rad dev` or `rad d` - Start dashboard-host in development mode
- `rad dockerRun` or `rad dr` - Run via Docker Compose
- `rad dockerBuild` or `rad db` - Build Docker image
- `rad format` or `rad f` - Format code with Deno

### Dashboard Host (`apps/dashboard-host/`)

- `pnpm run dev` - Development mode with tsx
- `pnpm run start` - Production mode (requires build)
- `pnpm run build` - Build all components (webapp copy, TypeScript compilation)
- `pnpm run typecheck` - Type checking only

### Web Dashboard (`apps/web-dashboard/`)

- `pnpm run dev` - Next.js development server
- `pnpm run build` - Production build
- `pnpm run lint` - ESLint

## Configuration

Configuration is handled via environment variables (see
`apps/dashboard-host/src/lib/config.ts`):

- `PORT` - Server port (default: 8000)
- `SNAP_INTERVAL_S` - Snapshot interval in seconds (default: 3600)
- `DISPLAY_WIDTH`/`DISPLAY_HEIGHT` - E-ink display dimensions
- `SNAP_URL_PATHNAME` - Path to screenshot (default: "/")
- Chrome installation is handled automatically via `@puppeteer/browsers`

## Development Workflow

The dashboard-host operates in two modes:

1. **Development**: Runs alongside web-dashboard dev server
2. **Production**: Serves pre-built static Next.js app

The snapshot workflow (per dashboard):

1. Starts a dashboard server (Next.js)
2. Waits for server to be ready
3. Uses Puppeteer to capture screenshot of specific dashboard
4. Converts image to 256-color grayscale with ImageMagick
5. Saves with dashboard-specific filename (e.g., `onion.png`)

The scheduled workflow:

1. Runs hourly by default (`SNAP_INTERVAL_S` environment variable)
2. Generates all dashboard types in sequence
3. Also maintains legacy `snapshot.png` for backward compatibility

## File Structure Notes

- Configuration: `apps/dashboard-host/src/lib/config.ts`
- Routes: `apps/dashboard-host/src/lib/routes/`
- Overlays: `apps/dashboard-host/src/lib/overlays/`
- Dashboard content: `apps/web-dashboard/src/app/dashboard/`

## Dependencies

- **Core**: TypeScript, Node.js, pnpm workspace
- **Screenshots**: Puppeteer, capture-website
- **Image Processing**: ImageMagick (convert command)
- **Web**: Next.js, React
- **Build**: esbuild, wireit for task orchestration
