# AI DevKit

A minimal set of AI agent commands, skills, and workflows built on clear documentation principles, guidelines, and templates to support AI-powered software development.

## Motivation

At CommandOSS, our development culture is shaped by a few core principles:
- We use AI agents across research, planning, implementation, and iteration.

Our existing process has several issues for an AI-first workflow:
- Documentation is not structured for AI navigation, and there is no standard documentation guideline.
- AI loses context between sessions
- Teams repeat context and requirements across sessions.
- There is no single source of truth for agent coordination and engineer collaboration.

In short, AI agents struggle to understand the current product context and development stage.

To support this workflow, we provide a minimal and customizable set of AI commands, skills, and workflows based on practical documentation principles.

## Documentation Principle
At CommandOSS, we call this principle **Development Guideline #3: Project Repository as the Source of Truth for Technical Specifications**

This principle aims to:
- Establish the project repository as the single source of truth for progressive feature planning and technical solutions.
- Provide structured context that both engineers and AI agents can rely on to make better decisions.
- Minimize unnecessary resource usage (e.g., external MCP/HTTP/API calls) by keeping essential specifications directly within the repository.
- Promote best practices in documentation structure and clarity.

> **Note:** This is a guideline, not a rigid rulebook. The goal is not to create more files, but to create better structure so engineers and AI agents can work with higher confidence. Teams can use tools like Notion or Google Docs for drafting and collaboration. However, finalized, development-critical documentation should be consolidated in the repository.

### Documentation Structure
Refer to [`docs/README.md`](./docs/README.md) for documentation structure details.