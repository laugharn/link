# [Links](https://links.laugharn.dev)

A simple social bookmarking site built from scratch in a weekend.

## Prerequisites

* Yarn
* Node
* Postgresql 13.x

## Up and Running

* Run `yarn` to install dependencies
* Copy .env.local.example to .env.local and update the value for `DATABASE_URL`
* Run `yarn db:init` to get the Prisma environment configured (it doesn't recognize the Next/CRA named environment files yet) and reset the database to the current schema.
* Run `yarn dev` to run the application at localhost:3000

## Deploying

* All commits in the repo get a [Vercel](https://vercel.com) deployment. You can see the latest deployments on the [Deployments](https://github.com/laugharn/link/deployments) page.
* The deployment URLs follow a `links-git-${COMMIT_REF}-laugharn.vercel.app` naming convention.
* Each branch deployment gets a unique database at DigitalOcean. If you fork this repo, you will need to provide your own database hosting solution.

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
- [x] Documentation

## Next Steps

### Product

* **Better Users** - People on platforms expect more to their email and user ID. We should add usernames, meta, roles, permissions, and any requisite UI.
* **Content** - What is Links? How can people know more about it if they don't know about this GitHub repo?
* **Following** - We should add the ability to follow other users, and create a feed of links in addition to the current firehose-style home page.
* **Discussion** - While I generally believe that engaging with content should happen at the content, there's a case for enabling discussion on the Links page. How do we handle things like moderation, permissions, notifications, etc.?
* **Analytics** - We should implement a minimal analytics layer so we know what's up.
* **Discovery** - I'm generally opposed to algorithmic content, but there is a lot of opportunity for curation.

### Front End

* **User UI** - The only way you know you have an account is that the nav says "Logout" instead of "Start" but there is no indication of what account this is.
* **Processing UI** - It's unclear when a form is being submitted, we should add a visual indicator and app state to hook in to.
* **Leverage Post Data** - We should enable more advanced filtering that takes advantage of Prisma's JSON filtering, and consider embeds in posts for videos, music, Twitter/Instagram/etc.
* **Open Graph** - The purpose of Links is to get you to click the link, so the individual Links page is less of the focus, but we should still freshen them up with well structured graph data.
* **Custom 404 Page** - Our error page sticks out like a sore thumb, we should roll our own.

### Back End

* **Posts API Call** - For the MVP, the home page is using `getServerSideProps` and fetching our data with a blocking server-side call. This is good for lower complexity but the blocking call leads to some sub-par load times, especially on a cold start lambda. We should eventually use our API and implement a cache pattern.
* **Better Scraping** - Right now we are doing a simple GET request and parsing the result. This works for a majority of websites, but not sites that aren't fully server rendered or block bots. Even third party scraping services still hit these dead ends, so this eventually becomes a biz dev problem. We could also think about a browser extension/bookmarklet.
* **PubSub** - Scraping a page can take a few seconds, which is a bad user experience and shouldn't be blocking. We should create the URL and then offload the scraping to a queue, using a formal setup on Google Cloud or something really simple like [Quirrel](https://quirrel.dev)
* **TypeScript** - _sigh_ I think loose type is a strength, not a weakness, and TS leads to a lot of meta problems in my experience, but it's probably better if this project is going to be collaborative.
* **Middleware** - Our server code for authentication is repetitive. We could easily make this a handler middleware.

### DevOps

* **Project Management** - Enable as many PMish features in the GitHub repository, come up with a pattern to leverage issues, PRs, discussions, and projects, make sure our permissions on main are correct, etc.
* **Testing** - We should take advantage of our atomic deployments and run something like [Cypress](https://cypress.io) to confirm our happy path.
* **Migrations** - The initial launch was just using Prisma's `db push` command. The second we need to change the data or god forbid roll back, this won't hold up. We need to start using proper migrations.
* **Monitoring** - A simple health check URL should be sufficient for now, but if we see user adoption we'll want a proper service, log drains, etc.
* **Cleanup** - We should implement a GitHub Action to delete databases when branches are deleted, and purge unclaimed authentication passes.