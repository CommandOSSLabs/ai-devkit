# kimi-webbridge on this machine

Load this file **only from Step 6**, before the prove commands. It prepares the
browser drive the UI skills use. It writes under the user's home, not the repo.

## Already installed

The binary is `~/.kimi-webbridge/bin/kimi-webbridge` (Windows:
`%USERPROFILE%\.kimi-webbridge\bin\kimi-webbridge.exe`). When that file exists,
do not download again. Run `<binary> start` — it is a no-op when the daemon is
already up. Do not run `stop`, `restart`, `upgrade`, or `uninstall`.

Then `<binary> status`. When `skills` does not list this agent, run
`<binary> install-skill -y`.

## Not installed

Run the official bootstrap once. It downloads the daemon, starts it, and
installs the skill into detected agent runtimes
(`https://cdn.kimi.com/webbridge/install.sh` header).

- macOS or Linux: `curl -fsSL https://cdn.kimi.com/webbridge/install.sh | bash`
- Windows: `irm https://cdn.kimi.com/webbridge/install.ps1 | iex`

Do not use `install_skill.sh`. That script only copies the skill for a Kimi
Desktop install and does not download the daemon.

If the command fails, retry once. Still failing: one row in the prove table,
`kimi-webbridge` / not wired, plus
`https://www.kimi.com/en/products/kimi-webbridge`. Continue the other proves.

## Extension

`<binary> status` → `extension_connected`.

- `true`: say so once.
- `false`: the extension is the user's install. Name the stores once and
  continue. Do not load an unpacked extension yourself.
  - Chrome: `https://chromewebstore.google.com/detail/kimi-webbridge/fldmhceldgbpfpkbgopacenieobmligc`
  - Edge: `https://microsoftedge.microsoft.com/addons/detail/kimi-webbridge/bnlffdbcfnanfbknnlaflhlhkocccckg`

A disconnected extension does not block the rest of setup.

**Done when:** the binary is present and `start` has been run, or the failed
install is a row in the prove table; and the extension is either connected or
the store links were named once.
