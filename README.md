# Link

A simple social bookmarking proof of concept built on a rainy Saturday morning.

## Prerequisites

* Yarn
* Node 14.x or higher
* Postgresql 13.x

## Up and Running

* Run `yarn` to install dependencies
* Copy .env.local.example to .env.local and update the value for `DATABASE_URL`
* Run `yarn db:init` to get the Prisma environment configured (it doesn't recognize the Next/CRA named environment files yet) and reset the database to the current schema.
* Run `yarn dev` to run the application at localhost:3000

## TODO

- [x] Initial setup
- [x] Implement Prisma
- [x] Link API
- [x] Link create UI
- [x] Filtering UI
- [x] Wayfinding UI
- [x] Tweaks
- [x] Authentication
- [x] Polish
- [x] Deployment
- [ ] Documentation