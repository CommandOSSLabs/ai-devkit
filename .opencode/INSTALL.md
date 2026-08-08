# Installing AI DevKit for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add ai-devkit to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["ai-devkit@git+https://github.com/CommandOSSLabs/ai-devkit.git"]
}
```

Restart OpenCode. The plugin auto-installs and registers all skills.

## Usage

Use OpenCode's native `skill` tool:

```
use skill tool to list skills
use skill tool to load ai-devkit/requirements
```

## Updating

AI DevKit updates automatically when you restart OpenCode.

To pin a specific version:

```json
{
  "plugin": ["ai-devkit@git+https://github.com/CommandOSSLabs/ai-devkit.git#v1.0.0"]
}
```

## Troubleshooting

### Plugin not loading

1. Check logs: `opencode run --print-logs "hello" 2>&1 | grep -i ai-devkit`
2. Verify the plugin line in your `opencode.json`
3. Make sure you're running a recent version of OpenCode

### Skills not found

1. Use `skill` tool to list what's discovered
2. Check that the plugin is loading (see above)
