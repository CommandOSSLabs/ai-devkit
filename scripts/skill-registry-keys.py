"""Print the keys of one Record<string, string> literal in lib/skill-types.ts.

skill-lint reads CATEGORY_MAP and SKILL_PURPOSE from it to check that every
skill directory is registered for the site. Keys are written both quoted
("delivery-ship") and bare (sync), so a grep for either form alone misses half
of them.
"""

import re
import sys

name = sys.argv[1]
src = open("lib/skill-types.ts").read()
block = re.search(
    r"export const %s: Record<string, string> = \{(.*?)\n\};" % re.escape(name),
    src,
    re.S,
)
if not block:
    sys.exit("skill-registry-keys: cannot find %s in lib/skill-types.ts" % name)
for key in re.findall(r'^\s*"?([A-Za-z0-9_-]+)"?\s*:', block.group(1), re.M):
    print(key)
