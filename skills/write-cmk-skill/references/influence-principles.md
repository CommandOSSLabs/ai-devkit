# Influence Principles for Skill Wording

Load this file when choosing how to phrase a rule, a gate, or a convention inside a skill — it maps compliance psychology to skill types.

Language models are trained on human text, and the compliance patterns embedded in that text transfer: phrasing built on recognized persuasion principles measurably raises rule-following, in some published measurements roughly doubling it. That force is a tool for making good process stick under pressure — never for manipulating the agent into something it would refuse with full knowledge.

## Authority — for gates

Absolute, imperative framing: iron laws, "MUST", "NEVER", "no exceptions". An absolute removes the per-instance deliberation where rationalization lives — "is this case an exception?" never opens. Reserve it for rules that genuinely admit no exception (verification gates, test-first, root-cause-first); an absolute attached to a preference teaches the agent that your absolutes are soft.

- Yes: "Wrote implementation before the test? Delete it. No exceptions."
- No: "It's usually best to write the test first when feasible."

## Commitment — for multi-step processes

An agent that states its intent acts consistently with the statement. Devices:

- Require an announcement: "State which skill you are following before acting."
- Force an explicit recorded choice: options A/B/C, one compliant.
- One todo per checklist item — a checklist without per-item tracking loses steps.

## Scarcity and urgency — only where genuinely true

"IMMEDIATELY after the task, before proceeding" works because sequencing pressure defeats "I'll do it later". Use it only when the ordering is genuinely load-bearing (evidence goes stale; a step gets skipped if deferred). Manufactured urgency is self-defeating: the agent learns to discount every urgent marker you write, including the real ones.

## Social proof — for conventions

Norm framing carries conventions that have no single dramatic failure: "every skill in this set tags tests with a requirement ID"; "checklists without todos lose steps — every time." State the norm as universal fact, not as one option some people like.

## Never warmth or liking

Do not phrase rules to be liked — no flattery, no "great work so far, one small thing", no approval offered for compliance. Warmth-based wording breeds sycophancy: the agent optimizes for agreement with you rather than adherence to the process, which is the exact failure the anti-sycophancy skills in this set exist to prevent. Reciprocity framing ("I did X for you, so...") fails the same way and reads as manipulation; leave it out entirely.

## Mapping: skill type → principles

| Skill type | Use | Avoid |
|---|---|---|
| Gate / discipline (tdd, verify, root-cause) | Authority + commitment + social proof | Warmth, reciprocity, softeners ("consider", "prefer") |
| Recipe / technique (plan-tasks, run-spike) | Clear contract + moderate authority on the output shape | Heavy absolutes — they crowd out judgment the recipe needs |
| Convention / reference (tagging formats, file layouts) | Social proof + plain clarity | Any persuasion beyond clarity — reference should read neutral |
| Collaborative (clarify-decisions, vet-feedback) | Commitment + shared-goal framing ("we both need the honest answer") | Authority and liking — both suppress the honest pushback these skills exist to produce |

## The ethical test

Before shipping a phrasing, ask: **would this wording still be fair if the agent could see exactly what you are doing and why?** An iron law on a verification gate passes — a fully informed agent endorses it. Manufactured urgency, guilt framing, or affection traded for compliance fails — full knowledge would dissolve its force. If the technique only works while hidden, it doesn't ship.
