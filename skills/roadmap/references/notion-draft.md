# Notion draft

Read this when `docs/agents/issue-tracker.md` reads **Draft surface** `notion`. The
roadmap file still holds every MILE and ROAD ID. The Notion page is where the sign-off role
reads the milestone and signs it off.

1. **Place the page.** Create one page per new or changed milestone in that file's
   **Drafts data source**, following its **Server at setup** and **Sign-off** lines.
   *Done when: the page sits in the bound data source.*
2. **Fill the page.** Its content is the milestone's block from `docs/roadmap/INDEX.md`,
   followed by this REQUIRED section:

   ```markdown
   ## Tickets on sign-off

   Signing off this page approves exactly these <tracker> tickets, team <team>:

   1. <ticket title> — <ROAD-N>, <requirement IDs, or "not specified yet">
   ```

   List one line for every ticket that publishing the milestone would create. With
   **Publish unit** `feature`, that means one line per ROAD member. A milestone that would
   create no ticket says so in this section.
   *Done when: the section lists every ticket, and nothing publishes that it does not name.*

Why the list is REQUIRED: in seven baseline drafts, none named a ticket. The working
agreement had Quang approve every new ticket. Then he signed off MILE-2 in Notion, and
three of five publishing runs still refused to create its tickets, because "The sign-off
is on the milestone. It doesn't cover the individual tickets." Minh's team had nothing to
start on Monday. When the signed page listed its tickets, five of five runs created
exactly that list.
