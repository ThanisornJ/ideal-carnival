# SMP

SMP is an equipment inventory and requisition management application. Authenticated users can view equipment availability and submit requests, while administrators can manage equipment, users, and requisition approvals.

## Stack

- Laravel 13
- Inertia.js 3
- React 19 with TypeScript
- Mantine UI
- SQLite

## Requirements

- PHP 8.5+
- Composer
- Node.js and npm
- npm

## Setup

From the project directory, run:

```bash
composer run setup
```

This installs PHP and JavaScript dependencies, creates `.env`, generates the application key, runs migrations, and builds frontend assets.

## Start the project

Start the Laravel server, queue worker, and Vite together:

```bash
composer run dev
```

Open [http://localhost](http://localhost) in your browser.

The Laravel Pail log viewer is not included in this Windows development command because it requires the `pcntl` PHP extension.

To run only the frontend development server:

```bash
npm run dev
```

## Useful commands

```bash
# Run tests
php artisan test --compact

# Check frontend types
npm run types:check

# Run linting
composer run lint
```

## Main features

- Dashboard with inventory and requisition summaries
- Equipment inventory management
- Equipment requisitions and approval workflow
- User management
- Profile, password, email verification, and two-factor authentication settings
