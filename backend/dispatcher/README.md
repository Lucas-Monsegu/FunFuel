# Service template

Used to dispatch game creations and users to the good microservice instance

## Getting Started

### CLI Prerequisites

- node
- yarn
- pm2

### VSCode Setup

- install ESLint plugin
```json
// VSCode settings.json
{
  // JS
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  // ESLint
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "typescript"
  ]
}
```

### Installation

Install dependencies

```
yarn
```

## Development

Run with hot reload

```
yarn start
```

Debug the project or a specific file

`Ctrl+Shift+D` and ▶️

## Deployment

Only build

```
yarn build
```

Build and run for production

```
yarn prod
```

Run `yarn prod` within pm2

```
pm2 start pm2.json
```
