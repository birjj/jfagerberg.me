This is the code behind [my website](https://jfagerberg.me). It's implemented as a simple [Next.js](https://nextjs.org) app with a custom WebGL background.

## Running locally

Simply run

```bash
yarn install
yarn dev
```

This will start the development server, serving the site on [http://localhost:3000](http://localhost:3000).

## Setting up VSCode

Due to limited support in VSCode for Yarn 2's PnP strategy, it is important to use the workspace's TypeScript version. You should get a popup to allow you to use this when opening the project for the first time in VSCode. Alternatively run <code>yarn dlx @yarnpkg/sdks vscode</code> to setup the VSCode config, then do <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and choose "Select TypeScript Version".
