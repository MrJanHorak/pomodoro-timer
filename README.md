# Pomodoro Timer

This project is a Pomodoro Timer built with React and TypeScript. It uses a custom hook for managing the timer state and updates the browser tab title and favicon dynamically to reflect the progress of the timer.

## Features

### Dynamic Document Title

The timer updates the browser tab title dynamically to show the remaining time. This allows the user to keep track of the timer progress even when they are not actively viewing the app.

### Dynamic Favicon

The timer also updates the favicon dynamically to reflect the progress of the timer. This is done by creating an SVG of a circle that represents the progress and setting it as the favicon. The SVG is created and updated using the [`createProgressSVG`](src/App.tsx) function in [`App.tsx`](src/App.tsx).

### Dynamic Background

The background also updates dynamically to reflect the progress of the timer. This is done by animating a two tone linear gradient.

### Custom Timer Hook

The timer logic is encapsulated in a custom hook called [`useTimer`](src/customHooks/useTimer.ts). This hook manages the timer state and provides functions to start, pause, and reset the timer.

### Add Music from Sound cloud

Add an iframe for a soundcloud player in the setting for music playback. The iframe is hidden from view and will autoplay.

## Project Structure

- `src/App.tsx`: The main component of the app. It uses the `useTimer` hook and updates the document title and favicon.
- `src/customHooks/useTimer.ts`: Contains the `useTimer` custom hook which encapsulates the timer logic.
- `src/assets/sounds/`: Contains sound files that are played when the timer starts and ends.
- `public/`: Contains public assets such as the manifest file and service worker.

## Running the Project

To run the project, first install the dependencies with `npm install`, then start the development server with `npm start`.

## Building the Project

To build the project for production, run `npm run build`. The built files will be output to the `dist` directory.

## Testing

Tests are written using Jest and React Testing Library. To run the tests, use the `npm test` command.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

