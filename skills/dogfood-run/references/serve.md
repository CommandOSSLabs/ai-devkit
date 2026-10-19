# Optional live guide

WHEN a person wants to tick cases live while you drive — otherwise skip this file.

`$DF serve $RUN` binds `127.0.0.1:8787` and serves a page that follows the run
and accepts the person's ticks. It is optional by construction: `render` bakes
current verdicts into the HTML, so a guide opened by double-click is correct
with nothing running. Do not drive the guide; it is for the human beside you.

**Stopping it.** If you started `$DF serve`, ask the user whether to stop it.
Do not stop it silently — they may still be reading the guide — and do not
walk away leaving a process holding a port. On yes: `$DF serve $RUN --stop`.
On no: hand them that exact command.
