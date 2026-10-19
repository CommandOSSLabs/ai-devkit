# UI design — fill recipe

Interfaces and data flow do not design a surface: a module can satisfy every
requirement and still ship browser-default buttons, an undesigned empty state,
and invisible focus. This section makes those decisions here, where the user
reviews them, instead of leaving them to whichever implementer touches the CSS.

WHEN a locked `ui-brief.md` exists for this feature (beside requirements.md,
or in `docs/design/` for the surface) → lift its per-surface slots (Layout /
Components / States / Type & color / A11y) into `## UI design` 1:1 and cite
the brief on the `Grounding:` line; its Decision, Signature, and Amendments
stay in the brief — re-decide nothing it locked. Otherwise fill the section
yourself:

Fill it against the repo's real visual system: an Approved
`docs/rules/common/design-tokens.md` is the palette of record when present;
otherwise read the token / theme / component-style files the Step-1 scan found.
Cite tokens by name — the `Grounding:` line records the precedence (the user's
own words, then the existing system, then your choices) and where the tokens
come from. One `###`
per surface; fill every slot the template names — `Layout:`, `Components:`
(same ladder discipline as `Reuse:`), `States:`, `Type & color:`, `A11y:`.
