# Installing AI DevKit for Claude Code

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed

## Installation

```bash
claude plugin add CommandOSSLabs/ai-devkit
```

## Usage

Skills trigger automatically from natural language, or invoke directly:

```
/cmk:prd
/cmk:system-design
/cmk:feature-spec
/cmk:adr
/cmk:docs
/cmk:codebase-summary
/cmk:learn
/cmk:rule
/cmk:worktree-dev-env
```

## Updating

```bash
claude plugin update ai-devkit
```

## Troubleshooting

### Skills not loading

1. Verify plugin is installed: `claude plugin list`
2. Check that `skills/` directory contains SKILL.md files
3. Restart Claude Code after installation
