# Notice

This skill is adapted from [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
at commit `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` (2026-09-14).

What changed in the adaptation:

- The skill body is reshaped to this kit's house style: `cmk:` frontmatter,
  a 150-line `SKILL.md`, and the full-audit setup and planning sections moved
  into `references/full-audit.md`.
- Every other Markdown file is carried into `references/` under a lowercase
  name. Its text is unchanged apart from file-name references, pointers to
  where a moved section now lives, validator paths, and a `## Contents` list
  on the longer files.
- `report-schema.json` and both validators are carried into `assets/`
  unchanged apart from a provenance line in each validator's header. Their
  tests live outside the package, in the kit's own test suite.

The original work is licensed under the MIT License, reproduced below. The
same terms cover this adaptation's copies of that work.

```text
MIT License

Copyright (c) 2025-2026 Cloudflare, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
