---
title: Publishing to Netlify from a private, organization-owned repository
date: 2022-08-19
tags: ["automation"]
---

Netlify [recently announced](https://www.netlify.com/pricing/private-org-repo-faq/) that they're limiting the building of private, organization-owned GitHub repositories to their Pro plan. Repositories for the free plan must now be either public or under a personal GitHub account.

I have a few private repositories that are hosted in a team on GitHub for collaboration purposes, but which don't produce any income. Luckily there is a rather easy workaround: building using GitHub Actions, and then publishing to Netlify afterwards.

## Cleaning up on Netlify

First thing we'll need to do is disconnect the project from the GitHub repository on Netlify. This will leave Netlify happy, as they no longer have to spend build minutes on the project, and let us stay on the free plan.

Navigate to the project you want to change on netlify and go to `Site settings > Build & deploy > Continuous Deployment`. Here you'll find a "Manage repository" dropdown, from which you can unlink the project:

![Dropdown for unlinking the project on Netlify](https://user-images.githubusercontent.com/4542461/185647331-7cf24ff4-5a13-447a-970f-a8b3d2a61d65.png)

This should be enough for Netlify to be happy. While you're here, you might as well find the information we'll need for publishing later: the site ID, and an access token.

Still within the project, head to `Site settings > General > Site details` and copy down the site ID. Then head to [`User settings > Applications`](https://app.netlify.com/user/applications) and create a new personal access token. Make sure to copy down the token value as well. We'll be using both of these values when we set up the GitHub Action.

## Setting up the GitHub Action

The rest of the work will happen in your GitHub repo. Head over to `Settings > Secrets > Actions`, and create a new secret containing the access token you've just copied from Netlify. We'll be using this secret for sending the data to Netlify once we've built the site.

![The GitHub interface after adding the secret](https://user-images.githubusercontent.com/4542461/185649260-ccaefdef-fbd1-4ce6-9a19-81312403bee2.png)

Finally all we have left to do is add the actual GitHub Action! Create a new file in `.github/workflows` in your repository (e.g. `.github/workflows/release.yml`), and paste an action configuration like the following:

```yml
name: Release to Netlify
on:
  # I chose to publish on every commit to the primary branch for this project
  # See https://docs.github.com/en/actions/using-workflows/triggering-a-workflow for how to configure this
  push:
    branches:
      - master

jobs:
  Release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      # setup
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: npm
      - run: npm ci
      - run: npm run build # replace with the way you build your project
      # publish to netlify
      - name: Publish to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with: # change these settings as needed; for a full list, see the actions-netlify documentation
          publish-dir: ./build
          production-branch: master
          production-deploy: true
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "${{github.event.head_commit.message}}"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_ACCESS_TOKEN }} # rename to whatever you called your secret on GitHub
          NETLIFY_SITE_ID: "19c5eafb-aaaa-bbbb-cccc-dddddddddddd" # replace with your site ID
```

And that's it! You should now have GitHub Actions set up to build your site and publish the result to Netlify - even if your repository wouldn't normally be supported by your Netlify plan.
