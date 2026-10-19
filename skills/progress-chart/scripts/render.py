#!/usr/bin/env python3
"""Render a progress snapshot (from extract.py) into one self-contained HTML page.

The page is a weekly briefing for a person: names before IDs, plain states, human
dates. Deterministic: the same snapshot and notes give the same bytes. The only prose
not derived from the snapshot is the optional notes file the agent writes.

    python3 render.py snapshot.json [--notes notes.json] --out dashboard.html

notes.json: {"summary": "...", "recommendations": ["...", ...]}
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import sys
import zlib
from pathlib import Path

# Plain words for item states. One home: every label on the page comes from here.
STATE = {
    "done": "Done", "building": "In build", "specced": "Spec written", "framing": "Being shaped",
    "unspecced": "Not started", "ready": "Ready", "deferred": "Deferred", "retired": "Dropped",
}
ACRONYMS = {"ai", "api", "ui", "ux", "adr", "ci", "url", "pdf", "sql", "s3", "tts", "id", "os",
            "e2e", "csp", "fsrs", "llm", "otlp", "sso", "oauth", "rpo", "rto", "dns", "cdn"}
FINDING = {"S8": "Roadmap order", "S7": "Milestone status", "S1": "Defined twice", "ADR": "Decision number"}

CSS = """
:root{--paper:#F5F7F4;--panel:#FFFFFF;--ink:#18211E;--muted:#5B6A64;--rule:#D9DFDB;
--accent:#1F5FBF;--accent-soft:#E3ECFA;--done:#2E7D4F;--done-soft:#E1F1E7;--build:#B7791F;
--build-soft:#FBF0DC;--alert:#C2412D;--alert-soft:#F9E3DE;--idle:#8A9792;--idle-soft:#ECEFED;
--display:Charter,"Iowan Old Style","Palatino Linotype",Georgia,serif;
--body:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
--mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
@media (prefers-color-scheme: dark){:root{--paper:#111715;--panel:#18201D;--ink:#E3EAE6;--muted:#95A49E;
--rule:#2A3531;--accent:#7FA8F0;--accent-soft:#1B2A44;--done:#5CC48A;--done-soft:#163225;--build:#E0A84A;
--build-soft:#3A2C12;--alert:#F07B63;--alert-soft:#3F1D16;--idle:#7D8B86;--idle-soft:#212A27}}
:root[data-theme="dark"]{--paper:#111715;--panel:#18201D;--ink:#E3EAE6;--muted:#95A49E;
--rule:#2A3531;--accent:#7FA8F0;--accent-soft:#1B2A44;--done:#5CC48A;--done-soft:#163225;--build:#E0A84A;
--build-soft:#3A2C12;--alert:#F07B63;--alert-soft:#3F1D16;--idle:#7D8B86;--idle-soft:#212A27}
:root[data-theme="light"]{--paper:#F5F7F4;--panel:#FFFFFF;--ink:#18211E;--muted:#5B6A64;--rule:#D9DFDB;
--accent:#1F5FBF;--accent-soft:#E3ECFA;--done:#2E7D4F;--done-soft:#E1F1E7;--build:#B7791F;
--build-soft:#FBF0DC;--alert:#C2412D;--alert-soft:#F9E3DE;--idle:#8A9792;--idle-soft:#ECEFED}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 var(--body)}
.wrap{max-width:1040px;margin:0 auto;padding:0 28px}
header.top{padding:40px 0 18px}
.eyebrow{font:600 12px var(--body);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
header.top h1{font:600 38px/1.15 var(--display);margin:6px 0 6px;text-wrap:balance}
.meta{font-size:13px;color:var(--muted)}
nav.jump{position:sticky;top:0;z-index:2;background:var(--paper);border-bottom:1px solid var(--rule)}
nav.jump .wrap{display:flex;flex-wrap:wrap;gap:4px 18px;padding-top:10px;padding-bottom:10px;font-size:14px}
nav.jump a{color:var(--muted);text-decoration:none}
nav.jump a:hover,nav.jump a:focus-visible{color:var(--accent)}
button.theme{margin-left:auto;font:13px var(--body);color:var(--muted);background:none;border:1px solid var(--rule);
border-radius:4px;padding:1px 10px;cursor:pointer}
main{display:grid;gap:56px;padding:32px 0 80px}
main>*{min-width:0}
section>h2{font:600 27px/1.2 var(--display);margin:0 0 6px;text-wrap:balance}
section>.lede{color:var(--muted);margin:0 0 22px;max-width:68ch}
h3{font:600 18px/1.3 var(--body);margin:28px 0 10px}
h3 small{font-weight:400;color:var(--muted);font-size:14px}
p{max-width:70ch;overflow-wrap:anywhere}
.brief{font:19px/1.6 var(--display);max-width:66ch;margin:0 0 20px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:8px 0 24px}
.stat{background:var(--panel);border:1px solid var(--rule);border-radius:8px;padding:14px 16px}
.stat b{display:block;font:600 34px/1.1 var(--display);font-variant-numeric:tabular-nums}
.stat span{color:var(--muted);font-size:14px}
.stat.good b{color:var(--done)}.stat.build b{color:var(--build)}.stat.next b{color:var(--accent)}
.recs{background:var(--panel);border:1px solid var(--rule);border-left:4px solid var(--accent);border-radius:8px;padding:16px 20px}
.recs h3{margin:0 0 8px;font-size:15px}
.recs ol{margin:0;padding-left:22px;display:grid;gap:6px;max-width:80ch}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
.card{background:var(--panel);border:1px solid var(--rule);border-radius:8px;padding:16px 18px;min-width:0}
.card h4{font:600 17px/1.3 var(--body);margin:0 0 4px}
.card .why{color:var(--muted);font-size:14px;margin:0 0 10px}
.group{background:var(--panel);border:1px solid var(--rule);border-radius:8px;padding:18px 20px;margin-bottom:14px}
.group>header{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:baseline;margin-bottom:4px}
.group>header b{font:600 19px/1.3 var(--display)}
.group>p.outcome,.clamp{color:var(--muted);font-size:14.5px;margin:0 0 12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
ul.items{list-style:none;margin:0;padding:0;display:grid;gap:12px}
ul.items li{display:grid;gap:2px;padding-top:12px;border-top:1px solid var(--rule)}
ul.items li:first-child{border-top:0;padding-top:0}
.name{font-weight:600}
.sub{font-size:14px;color:var(--muted)}
.warn{display:block;font-size:14px;color:var(--alert);margin-top:4px}
.tag{font:12px var(--mono);color:var(--muted);margin-left:6px;white-space:nowrap}
.pill{display:inline-block;font:600 12px/1.7 var(--body);padding:0 9px;border-radius:10px;white-space:nowrap;
background:var(--idle-soft);color:var(--muted)}
.pill.done{background:var(--done-soft);color:var(--done)}
.pill.building{background:var(--build-soft);color:var(--build)}
.pill.ready,.pill.committed{background:var(--accent-soft);color:var(--accent)}
.pill.alert{background:var(--alert-soft);color:var(--alert)}
.bar{height:8px;border-radius:4px;background:var(--idle-soft);overflow:hidden;margin:8px 0 4px}
.bar i{display:block;height:100%;background:var(--done)}
.days{display:grid;gap:14px}
.day h4{font:600 14px var(--body);letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin:0 0 6px}
.day ul{margin:0;padding-left:20px}
.note{font-size:14px;color:var(--muted);background:var(--panel);border:1px dashed var(--rule);border-radius:6px;padding:8px 12px;max-width:80ch}
.trend{display:flex;align-items:flex-end;gap:10px;height:150px;padding:10px 0 0;max-width:640px}
.trend div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px}
.trend i{display:block;width:100%;background:var(--done);border-radius:4px 4px 0 0;min-height:2px}
.trend .now i{background:var(--accent)}
.trend b{font:600 13px var(--body);font-variant-numeric:tabular-nums}
.trend span{font-size:12px;color:var(--muted);white-space:nowrap}
ol.chain{margin:0;padding-left:22px;display:grid;gap:4px}
details{margin-top:12px}
details>summary{cursor:pointer;color:var(--accent);font-size:15px}
details>summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
details[open]>summary{margin-bottom:10px}
.ms{border-top:1px solid var(--rule);padding:10px 0}
.ms>summary{color:var(--ink)}
figure{margin:0}
figcaption{font-size:14px;color:var(--muted);margin-top:8px;max-width:75ch}
.scroll{overflow-x:auto}
svg text{font-family:var(--body)}
.mix{display:flex;height:10px;border-radius:5px;overflow:hidden;background:var(--idle-soft);margin:6px 0 4px}
.mix i{display:block;height:100%}
table{border-collapse:collapse;width:100%;font-size:15px}
td,th{padding:8px 10px;border-bottom:1px solid var(--rule);text-align:left;vertical-align:top}
th{font:600 12px var(--body);letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
td.n{text-align:right;font-variant-numeric:tabular-nums}
.hbar{display:flex;align-items:center;gap:10px}
.hbar i{display:block;height:8px;border-radius:4px;background:var(--accent);opacity:.7}
.empty{color:var(--muted);font-style:italic}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
"""

THEME_JS = """
document.querySelector('button.theme').addEventListener('click',function(){
 var r=document.documentElement,c=r.getAttribute('data-theme');
 var dark=c?c==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
 r.setAttribute('data-theme',dark?'light':'dark');});
"""


# ---------------------------------------------------------------- words


def e(s: object) -> str:
    return html.escape("" if s is None else str(s), quote=True)


def num(i: str) -> int:
    return int(i.split("-")[1])


def day(iso: str | None) -> str:
    if not iso:
        return ""
    d = dt.date.fromisoformat(iso)
    return f"{d:%a} {d.day} {d:%b}"


def week_title(start: str, end: str) -> str:
    a, b = dt.date.fromisoformat(start), dt.date.fromisoformat(end)
    if a.month == b.month:
        return f"Week of {a.day}–{b.day} {b:%b} {b.year}"
    return f"Week of {a.day} {a:%b} – {b.day} {b:%b} {b.year}"


def ago(iso: str | None, today: str) -> str:
    if not iso:
        return ""
    n = (dt.date.fromisoformat(today) - dt.date.fromisoformat(iso)).days
    return "today" if n == 0 else ("1 day ago" if n == 1 else f"{n} days ago")


def humanize(slug: str) -> str:
    words = [w.upper() if w.lower() in ACRONYMS else w for w in slug.replace("_", "-").split("-") if w]
    if not words:
        return slug
    first = words[0] if words[0].isupper() else words[0].capitalize()
    return " ".join([first] + words[1:])


def plural(n: int, one: str, many: str | None = None) -> str:
    return f"{n} {one if n == 1 else (many or one + 's')}"


def tag(i: str) -> str:
    return f'<span class="tag">{e(i)}</span>'


def pill(kind: str, label: str) -> str:
    return f'<span class="pill {e(kind)}">{e(label)}</span>'


def names(codes: list[str], feats: dict, limit: int = 0) -> str:
    shown = codes if not limit else codes[:limit]
    out = ", ".join(f'{e(feats[c]["name"]) if c in feats else e(c)}{tag(c)}' for c in shown)
    if limit and len(codes) > limit:
        out += f" and {len(codes) - limit} more"
    return out


# ---------------------------------------------------------------- svg


def layered(nodes: list[str], edges: list[tuple[str, str]], order: dict[str, int]) -> dict[str, tuple[int, int]]:
    """Column = longest path from a root; row = barycenter of predecessors, then input order."""
    preds: dict[str, list[str]] = {n: [] for n in nodes}
    for a, b in edges:
        if a in preds and b in preds:
            preds[b].append(a)
    col: dict[str, int] = {}

    def depth(n: str, guard: frozenset = frozenset()) -> int:
        if n in col:
            return col[n]
        d = 0
        for p in preds[n]:
            if p not in guard:
                d = max(d, depth(p, guard | {n}) + 1)
        col[n] = d
        return d

    for n in nodes:
        depth(n)
    pos: dict[str, tuple[int, int]] = {}
    for c in range(max(col.values(), default=-1) + 1):
        layer = [n for n in nodes if col[n] == c]

        def key(n: str) -> tuple[float, int]:
            rows = [pos[p][1] for p in preds[n] if p in pos]
            return (sum(rows) / len(rows) if rows else -1.0, order[n])

        for r, n in enumerate(sorted(layer, key=key)):
            pos[n] = (c, r)
    return pos


def svg_graph(title: str, desc: str, nodes: list[dict], edges: list[tuple[str, str]],
              w: int = 250, h: int = 66, gx: int = 56, gy: int = 16) -> str:
    """nodes: {id, head, label, sub, kind, frac?, ghost?}. kind picks the stroke/fill tokens."""
    if not nodes:
        return ""
    order = {n["id"]: i for i, n in enumerate(nodes)}
    pos = layered([n["id"] for n in nodes], edges, order)
    pad = 20
    cols = max(c for c, _ in pos.values()) + 1
    rows = max(r for _, r in pos.values()) + 1
    width = pad * 2 + cols * w + (cols - 1) * gx
    height = pad * 2 + rows * h + (rows - 1) * gy

    def xy(nid: str) -> tuple[int, int]:
        c, r = pos[nid]
        return pad + c * (w + gx), pad + r * (h + gy)

    fill = {"done": "var(--done-soft)", "building": "var(--build-soft)", "ready": "var(--accent-soft)",
            "committed": "var(--accent-soft)"}
    stroke = {"done": "var(--done)", "building": "var(--build)", "ready": "var(--accent)",
              "committed": "var(--accent)"}
    tid = f"t-{zlib.crc32(title.encode()):08x}"
    out = [f'<svg viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-labelledby="{tid}">',
           f'<title id="{tid}">{e(title)}</title><desc>{e(desc)}</desc>',
           '<defs><marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" '
           'orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" fill="var(--muted)"/></marker></defs>']
    for a, b in edges:
        if a not in pos or b not in pos:
            continue
        x1, y1 = xy(a)
        x2, y2 = xy(b)
        x1, y1, y2 = x1 + w, y1 + h // 2, y2 + h // 2
        mx = (x1 + x2) / 2
        out.append(f'<path d="M{x1},{y1} C{mx:.0f},{y1} {mx:.0f},{y2} {x2 - 2},{y2}" fill="none" '
                   f'stroke="var(--muted)" stroke-opacity=".5" stroke-width="1.2" marker-end="url(#arr)"/>')
    for n in nodes:
        x, y = xy(n["id"])
        k = n.get("kind", "")
        dash = ' stroke-dasharray="4 3"' if n.get("ghost") else ""
        label = n["label"] if len(n["label"]) <= 33 else n["label"][:32] + "…"
        sub = n.get("sub", "")
        sub = sub if len(sub) <= 34 else sub[:33] + "…"
        out.append(f'<g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="var(--panel)"/>'
                   f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill.get(k, "var(--panel)")}" '
                   f'stroke="{stroke.get(k, "var(--idle)")}" stroke-width="{1.6 if k in stroke else 1}"{dash}/>'
                   f'<text x="{x + 12}" y="{y + 19}" font-size="13" font-weight="600" fill="var(--ink)">{e(label)}</text>'
                   f'<text x="{x + 12}" y="{y + 37}" font-size="12" fill="var(--muted)">{e(sub)}</text>'
                   f'<text x="{x + 12}" y="{y + 53}" font-size="10.5" fill="var(--muted)" '
                   f'style="font-family:var(--mono)">{e(n.get("head", ""))}</text>')
        if n.get("frac") is not None:
            bw = int((w - 24) * n["frac"])
            out.append(f'<rect x="{x + 12}" y="{y + h - 7}" width="{w - 24}" height="3" rx="1.5" fill="var(--idle-soft)"/>'
                       f'<rect x="{x + 12}" y="{y + h - 7}" width="{bw}" height="3" rx="1.5" fill="var(--done)"/>')
        out.append(f'<title>{e(n.get("tip", n["label"]))}</title></g>')
    out.append("</svg>")
    return "".join(out)


# ---------------------------------------------------------------- sections


def brief_section(s: dict, notes: dict | None, ctx: dict) -> str:
    w = s["windows"]["week"]
    building = ctx["building"]
    closable = s["graph"].get("closable", [])
    stats = [
        ("good", len(w["finished"]), "finished this week", f'{len(s["windows"]["month"]["finished"])} in the last 30 days'),
        ("build", len(building), "in build now", ""),
        ("next", len(s["graph"]["ready"]), "ready to start", ""),
        ("", len(closable), plural(len(closable), "milestone", "milestones").split(" ", 1)[1] + " ready to close", ""),
    ]
    tiles = "".join(f'<div class="stat {c}"><b>{n}</b><span>{e(lbl)}{"<br>" + e(extra) if extra else ""}</span></div>'
                    for c, n, lbl, extra in stats)
    lead = f'<p class="brief">{e(notes["summary"])}</p>' if notes and notes.get("summary") else ""
    recs = ""
    if notes and notes.get("recommendations"):
        recs = ('<div class="recs"><h3>Suggested for next week</h3><ol>'
                + "".join(f"<li>{e(r)}</li>" for r in notes["recommendations"]) + "</ol></div>")
    return f'<section id="brief" aria-label="The week in brief">{lead}<div class="stats">{tiles}</div>{recs}</section>'


def progress(s: dict, code: str | None) -> str:
    f = next((x for x in s["features"] if x["code"] == code), None)
    if not f or not f.get("tasks_total"):
        return '<p class="sub">No task list yet.</p>'
    if f.get("tasks_done") is None:
        return f'<p class="sub">{f["tasks_total"]} tasks planned, none logged yet.</p>'
    done = f["tasks_done"]
    frac = min(1.0, done / f["tasks_total"])
    return (f'<div class="bar"><i style="width:{frac * 100:.0f}%"></i></div>'
            f'<p class="sub">{done} of {f["tasks_total"]} tasks done</p>')


CONTAINER = {"src", "crates", "apps", "packages", "lib", "app", "components", "features", "services",
             "modules", "pages", "internal", "routes", "v1", "v2", "base", "infra"}


def area(path: str) -> str:
    """The last meaningful segment of a path: `backend/migrations/` -> migrations."""
    segs = [s for s in path.split("/") if s and "." not in s]
    for s in reversed(segs):
        if s not in CONTAINER:
            return s.replace("_", " ")
    return segs[-1] if segs else path


def overlap_lines(rid: str, s: dict, ctx: dict) -> str:
    partners, paths = [], []
    for c in s["graph"]["conflicts"]:
        if rid in c["items"]:
            other = c["items"][1] if c["items"][0] == rid else c["items"][0]
            partners.append(f'{ctx["title"](other)} ({ctx["state_word"](other).lower()})')
            paths += c["paths"]
    if not partners:
        return ""
    who = ", ".join(partners[:3]) + (f" and {len(partners) - 3} more" if len(partners) > 3 else "")
    areas = ", ".join(dict.fromkeys(area(p) for p in paths))
    return f'<span class="warn" title="{e(", ".join(dict.fromkeys(paths)))}">Shares code with {e(who)} — {e(areas)}</span>'


def plan_section(s: dict, ctx: dict) -> str:
    items, ms, feats, g = ctx["items"], ctx["ms"], ctx["feats"], s["graph"]
    today = s["today"]

    cards = []
    for i in ctx["building"]:
        f = feats.get(i["feature"], {})
        started = f.get("started")
        when = f"started {day(started)} · {ago(started, today)}" if started else "started more than 8 weeks ago"
        cards.append(f'<div class="card"><h4>{e(f.get("name") or humanize(i["slug"]))}{tag(i["feature"] or i["id"])}</h4>'
                     f'<p class="why">{e(ms[i["milestone"]]["name"])} · {e(when)}</p>{progress(s, i["feature"])}'
                     f'{overlap_lines(i["id"], s, ctx)}</div>')
    building = f'<div class="cards">{"".join(cards)}</div>' if cards else '<p class="empty">Nothing is in build.</p>'

    groups: dict[str, list[str]] = {}
    for r in g["ready"]:
        groups.setdefault(items[r]["milestone"], []).append(r)
    order = sorted(groups, key=lambda m: (0 if ms[m]["commitment"] == "Committed" else 1, ms[m]["order"]))

    def group(m: str) -> str:
        rows = []
        for r in sorted(groups[m], key=lambda r: (-g["unlocks"].get(r, 0), num(r))):
            it = items[r]
            opens = g["unlocks"].get(r, 0)
            bits = [STATE[it["state"]] + (" — needs a spec first" if it["state"] == "unspecced" else "")]
            if opens:
                bits.append(f"opens up {plural(opens, 'later item')}")
            rows.append(f'<li><span><span class="name">{e(ctx["title"](r))}</span>{tag(r)}</span>'
                        f'<span class="sub">{e(" · ".join(bits))}</span>{overlap_lines(r, s, ctx)}</li>')
        commit = pill("committed", "Committed") if ms[m]["commitment"] == "Committed" else pill("", ms[m]["commitment"])
        return (f'<div class="group"><header><b>{e(ms[m]["name"])}</b>{commit}{tag(m)}</header>'
                f'<p class="outcome" title="{e(ms[m]["outcome"])}">{e(ms[m]["outcome"])}</p><ul class="items">{"".join(rows)}</ul></div>')

    committed = [m for m in order if ms[m]["commitment"] == "Committed"]
    rest = [m for m in order if m not in committed]
    ready = "".join(group(m) for m in committed)
    if rest:
        n = sum(len(groups[m]) for m in rest)
        inner = "".join(group(m) for m in rest)
        ready += (inner if not committed else
                  f'<details><summary>{plural(n, "more item")} ready in {plural(len(rest), "planned milestone")}</summary>{inner}</details>')
    if not g["ready"]:
        ready = '<p class="empty">Nothing can start yet: every open item waits on unfinished work.</p>'

    closable = g.get("closable", [])
    close = ""
    if closable:
        close = ('<h3>Milestones ready to close</h3><p class="sub">Every item in these milestones is done. '
                 'Confirm each with /cmk:milestone-review before marking it Closed.</p><ul class="items">'
                 + "".join(f'<li><span><span class="name">{e(ms[m]["name"])}</span>{tag(m)}</span>'
                           f'<span class="sub clamp" title="{e(ms[m]["outcome"])}">{e(ms[m]["outcome"])}</span></li>' for m in closable) + "</ul>")

    chain = g["critical_path"]
    longest = ""
    if chain:
        shown = "".join(f'<li>{e(ctx["title"](r))}{tag(r)} <span class="sub">— {e(ctx["state_word"](r).lower())}</span></li>'
                        for r in chain[:6])
        more = f'<p class="sub">…and {len(chain) - 6} more after these.</p>' if len(chain) > 6 else ""
        longest = (f'<h3>Longest chain still ahead <small>{plural(len(chain), "item")}</small></h3>'
                   f'<p class="sub">Each item waits on the one before it, so the last one cannot land before all of these.</p>'
                   f'<ol class="chain">{shown}</ol>{more}')

    return f"""<section id="plan"><h2>Next week</h2>
<p class="lede">What is still in build, what can start now, and what is finished but not yet closed.</p>
<h3>Still in build</h3>{building}
<h3>Ready to start <small>{plural(len(g["ready"]), "item")}, committed milestones first</small></h3>{ready}
{close}{longest}</section>"""


def happened_section(s: dict, ctx: dict) -> str:
    feats = ctx["feats"]
    w, m = s["windows"]["week"], s["windows"]["month"]
    finished_on: dict[str, str] = {}
    for ev in w["events"]:
        if ev["code"] in w["finished"]:
            finished_on[ev["code"]] = ev["date"]
    by_day: dict[str, list[str]] = {}
    for c in w["finished"]:
        by_day.setdefault(finished_on.get(c, w["since"]), []).append(c)
    days = "".join(
        f'<div class="day"><h4>{e(day(d))}</h4><ul>'
        + "".join(f'<li>{e(feats[c]["name"] if c in feats else c)}{tag(c)}'
                  f'{" <span class=sub>· " + e(feats[c]["domain"]) + "</span>" if c in feats and feats[c]["domain"] != "—" else ""}</li>'
                  for c in sorted(codes, key=lambda c: feats.get(c, {}).get("name", c)))
        + "</ul></div>" for d, codes in sorted(by_day.items(), reverse=True))
    finished = f'<div class="days">{days}</div>' if days else '<p class="empty">Nothing finished this week.</p>'
    batch = "".join(
        f'<p class="note">{plural(len(b["codes"]), "feature")} were marked done together on {e(day(b["date"]))} '
        f'<span class="tag">{e(b["sha"])}</span>. The records were caught up that day, so the work itself '
        'may have finished earlier.</p>' for b in w.get("batches", []))

    peak = max([wk["finished"] for wk in s.get("weekly", [])] + [1])
    bars = "".join(
        f'<div class="{"now" if k == len(s["weekly"]) - 1 else ""}"><b>{wk["finished"]}</b>'
        f'<i style="height:{wk["finished"] / peak * 100:.0f}%"></i><span>{e(day(wk["start"]).split(" ", 1)[1])}</span></div>'
        for k, wk in enumerate(s.get("weekly", [])))
    trend = (f'<h3>Finished per week <small>last 8 weeks</small></h3><div class="trend" role="img" '
             f'aria-label="Features finished per week over the last 8 weeks">{bars}</div>') if bars else ""

    started = f'<p>{names(w["started"], feats)}</p>' if w["started"] else '<p class="empty">Nothing new went into build.</p>'
    new_specs = f'<p>{names(w["specced"], feats)}</p>' if w["specced"] else '<p class="empty">No new specs.</p>'
    items = ctx["items"]

    def road(ids: list[str]) -> str:
        return ", ".join(f'{e(ctx["title"](r))}{tag(r)}' for r in ids[:8]) + (f" and {len(ids) - 8} more" if len(ids) > 8 else "")
    changes = []
    if w["roadmap_new"]:
        changes.append(f'<li><b>{plural(len(w["roadmap_new"]), "item")} added:</b> {road(w["roadmap_new"])}</li>')
    if w["roadmap_revived"]:
        changes.append(f'<li><b>Brought back from deferred:</b> {road(w["roadmap_revived"])}</li>')
    if w["roadmap_dropped"]:
        slugs = w.get("roadmap_slugs", {})
        changes.append('<li><b>Left the plan:</b> ' + ", ".join(
            f'{e(humanize(slugs[r]) if r in slugs else r)}{tag(r)}' for r in w["roadmap_dropped"]) + "</li>")
    roadmap = f'<ul>{"".join(changes)}</ul>' if changes else '<p class="empty">The roadmap did not change.</p>'
    adrs = {a["id"]: a for a in s["adrs"]}
    decisions = ("<ul>" + "".join(f'<li>{e(adrs[a]["title"])}{tag(a)} <span class="sub">· {e(day(adrs[a]["date"]))}</span></li>'
                                  for a in sorted(w["adrs"], reverse=True)) + "</ul>") if w["adrs"] else '<p class="empty">No new decisions.</p>'

    top = m["scopes"][:6]
    peak_c = max([v for _, v in top] + [1])
    activity = "".join(f'<tr><td>{e(k)}</td><td class="n">{v}</td><td style="width:50%"><div class="hbar">'
                       f'<i style="width:{v / peak_c * 100:.0f}%"></i></div></td></tr>' for k, v in top)

    return f"""<section id="happened"><h2>What happened</h2>
<p class="lede">{e(day(w["since"]))} to {e(day(s["today"]))}. A feature counts as finished on the day its status changed to done on this branch.</p>
<h3>Finished this week <small>{len(w["finished"])}</small></h3>{finished}{batch}
<h3>Went into build</h3>{started}
<h3>New specs</h3>{new_specs}
<h3>Roadmap changes</h3>{roadmap}
<h3>Decisions</h3>{decisions}
{trend}
<details><summary>All {len(m["finished"])} features finished in the last 30 days</summary><p>{names(sorted(m["finished"], key=lambda c: feats.get(c, {}).get("name", c)), feats)}</p>
{"".join(f'<p class="note">{plural(len(b["codes"]), "feature")} marked done together on {e(day(b["date"]))}.</p>' for b in m.get("batches", []))}</details>
<details><summary>Where the commits went in the last 30 days ({m["commits"]} commits)</summary>
<table><tbody>{activity}</tbody></table></details></section>"""


def roadmap_section(s: dict, ctx: dict) -> str:
    if not s["has_roadmap"] or not s["milestones"]:
        return '<section id="roadmap"><h2>The roadmap</h2><p class="empty">No roadmap in this repo (docs/roadmap/INDEX.md).</p></section>'
    items, ready = ctx["items"], set(s["graph"]["ready"])
    live = [m for m in s["milestones"] if not m["retired"]]

    def finished(m: dict) -> bool:
        c = m["counts"]
        total = sum(c.values())
        return m["commitment"] == "Closed" or (total > 0 and c["done"] == total)

    open_ms = [m for m in live if not finished(m)]
    done_ms = [m for m in live if finished(m)]
    shown = {m["id"] for m in open_ms}
    nodes = []
    for m in open_ms:
        c = m["counts"]
        total = sum(c.values())
        kind = "committed" if m["commitment"] == "Committed" else ""
        nodes.append({"id": m["id"], "label": m["name"], "sub": f'{c["done"]} of {total} done · {m["commitment"]}',
                      "head": m["id"], "kind": kind, "frac": (c["done"] / total) if total else None, "tip": m["outcome"]})
    edges = [(d, m["id"]) for m in open_ms for d in m["depends_on"] if d in shown]
    overview = svg_graph("Which unfinished milestones wait on which",
                         "Unfinished milestones; an arrow points from the milestone that has to finish first.", nodes, edges)
    hidden = len(done_ms)

    blocks = []
    for m in open_ms:
        mine = [items[r] for r in m["members"] if items[r]["state"] != "retired"]
        if not mine:
            continue
        ids = {i["id"] for i in mine}
        gnodes, gedges, ghosts = [], [], {}
        for i in mine:
            st = "ready" if i["id"] in ready else i["state"]
            gnodes.append({"id": i["id"], "head": i["id"], "label": ctx["title"](i["id"]),
                           "sub": STATE[st] + ("" if i["after_source"] == "field" else " · order assumed"), "kind": st})
        for a, b in s["graph"]["edges"]:
            if b in ids:
                if a not in ids and a not in ghosts and a in items:
                    ghosts[a] = {"id": a, "head": a, "label": ctx["title"](a),
                                 "sub": f'{STATE[items[a]["state"]]} · {ctx["ms"][items[a]["milestone"]]["name"]}',
                                 "kind": items[a]["state"], "ghost": True}
                gedges.append((a, b))
        fig = svg_graph(f'Build order inside {m["name"]}', "Items in this milestone, and items elsewhere they wait on (dashed).",
                        list(ghosts.values()) + gnodes, gedges)
        c = m["counts"]
        total = sum(c.values())
        blocks.append(f'<details class="ms"><summary><b>{e(m["name"])}</b> <span class="sub">— {c["done"]} of {total} done'
                      f'{", " + str(c["building"]) + " in build" if c["building"] else ""}</span>{tag(m["id"])}</summary>'
                      f'<p class="sub">{e(m["outcome"])}</p><figure class="scroll">{fig}<figcaption>Dashed boxes belong to another milestone. '
                      '"Order assumed" means the roadmap does not say what the item waits on, so it is read as waiting on the item listed above it.'
                      '</figcaption></figure></details>')
    finished_list = ", ".join(f'{e(m["name"])}{tag(m["id"])}' for m in done_ms)
    return f"""<section id="roadmap"><h2>The roadmap</h2>
<p class="lede">Unfinished milestones, left to right in the order they can happen. Open one below to see its items.</p>
<figure class="scroll">{overview}<figcaption>{plural(hidden, "finished milestone")} not shown. Blue outline: committed. The bar inside each box is the share of its items done.</figcaption></figure>
<div>{"".join(blocks)}</div>
{f'<details><summary>The {plural(hidden, "finished milestone")}</summary><p>{finished_list}</p></details>' if done_ms else ""}
</section>"""


def catalog_section(s: dict, ctx: dict) -> str:
    colors = {"Shipped": "var(--done)", "Implemented": "var(--done)", "In-progress": "var(--build)",
              "Approved": "var(--accent)", "Draft": "var(--idle)", "Recognized": "var(--idle)", "Retired": "var(--rule)"}
    words = {"Implemented": "done", "Shipped": "shipped", "In-progress": "in build", "Approved": "spec approved",
             "Draft": "spec in draft", "Recognized": "existing, no spec", "Retired": "retired"}
    feats = ctx["feats"]
    latest: dict[str, dict] = {}
    for ev in s["windows"]["month"]["events"]:
        latest[ev["code"]] = ev
    cards = []
    for d in s["domains"]:
        total = sum(d["counts"].values())
        order = list(colors)
        mix = "".join(f'<i style="width:{v / total * 100:.2f}%;background:{colors.get(k, "var(--idle)")}"></i>'
                      for k, v in sorted(d["counts"].items(), key=lambda kv: order.index(kv[0]) if kv[0] in order else 99))
        counts = ", ".join(f"{v} {words.get(k, k.lower())}" for k, v in sorted(d["counts"].items(), key=lambda kv: -kv[1]))
        open_ = [c for c in d["features"] if feats[c]["status"] in ("In-progress", "Approved", "Draft")]
        recent = sorted((latest[c] for c in d["features"] if c in latest and latest[c]["to"] in ("Implemented", "Shipped")),
                        key=lambda ev: ev["date"], reverse=True)[:4]
        recent_html = "".join(f'<li>{e(feats[ev["code"]]["name"])} <span class="sub">· {e(day(ev["date"]))}</span></li>' for ev in recent)
        open_html = "".join(f'<li>{e(feats[c]["name"])} <span class="sub">· {e(words[feats[c]["status"]])}</span></li>' for c in open_)
        title = d["domain"].capitalize() if d["domain"] != "—" else "Features"
        cards.append(f'<div class="card"><h4>{e(title)}</h4><div class="mix">{mix}</div><p class="sub">{plural(total, "feature")}: {e(counts)}</p>'
                     f'<p class="sub"><b>Open</b></p>{"<ul>" + open_html + "</ul>" if open_html else "<p class=empty>Nothing open.</p>"}'
                     f'<p class="sub"><b>Finished lately</b></p>{"<ul>" + recent_html + "</ul>" if recent_html else "<p class=empty>Nothing in 30 days.</p>"}</div>')
    return f'<section id="catalog"><h2>By area</h2><p class="lede">Every feature in the catalog, grouped by area.</p><div class="cards">{"".join(cards)}</div></section>'


def architecture_section(s: dict) -> str:
    adrs = sorted((a for a in s["adrs"] if a["date"]), key=lambda a: (a["date"], a["id"]), reverse=True)[:10]
    arows = "".join(f'<tr><td style="white-space:nowrap">{e(day(a["date"]))}</td><td>{e(a["title"])}{tag(a["id"])}</td></tr>' for a in adrs)
    rules = [a for a in s["architecture"] if not a["retired"]]
    rrows = "".join(f'<tr><td>{e(a["title"])}{tag(a["id"])}</td><td class="n">{len(a["respected_by"])}</td></tr>' for a in rules)
    return f"""<section id="architecture"><h2>Architecture</h2>
<h3>Latest decisions</h3>{"<table><tbody>" + arows + "</tbody></table>" if arows else '<p class="empty">No decision records.</p>'}
{f'<details><summary>The {plural(len(rules), "architecture rule")} and how many feature designs name each</summary><table><thead><tr><th>Rule</th><th>Designs</th></tr></thead><tbody>{rrows}</tbody></table></details>' if rules else ""}
</section>"""


def health_section(s: dict, ctx: dict) -> str:
    cov = s["coverage"]
    lines = []
    if s["has_roadmap"]:
        gap = cov["live_items"] - cov["with_after"]
        msg = (f'<p><b>{cov["with_after"]} of {cov["live_items"]}</b> roadmap items say what they wait for (their <code>After:</code> line). ')
        msg += (f'The other {gap} are read as waiting on the item listed above them, so "ready to start" and the longest chain '
                'show less parallel work than there really is. Add the missing lines through /cmk:roadmap.</p>' if gap
                else "So the order on this page is exactly what the roadmap says.</p>")
        lines.append(msg)
    finds = "".join(f'<li>{pill("alert", FINDING.get(x["rule"], x["rule"]))} {e(x["item"])}: {e(x["detail"])}</li>' for x in s["findings"])
    return f"""<section id="health"><h2>Housekeeping</h2><p class="lede">Gaps in the records that make this page less accurate.</p>
{"".join(lines)}{"<ul class='items'>" + finds + "</ul>" if finds else '<p class="empty">No problems found in the roadmap or decision records.</p>'}</section>"""


# ---------------------------------------------------------------- page


def context(s: dict) -> dict:
    items = {i["id"]: i for i in s["items"]}
    feats = {f["code"]: f for f in s["features"]}
    ms = {m["id"]: m for m in s["milestones"]}
    ready = set(s["graph"]["ready"])

    def title(rid: str) -> str:
        it = items.get(rid)
        if not it:
            return rid
        f = feats.get(it["feature"]) if it["feature"] else None
        return f["name"] if f else humanize(it["slug"])

    def state_word(rid: str) -> str:
        it = items.get(rid)
        if not it:
            return ""
        return STATE["ready"] if rid in ready else STATE.get(it["state"], it["state"])

    return {"items": items, "feats": feats, "ms": ms, "title": title, "state_word": state_word,
            "building": [i for i in s["items"] if i["state"] == "building"]}


def render(s: dict, notes: dict | None = None) -> str:
    ctx = context(s)
    w = s["windows"]["week"]
    heading = week_title(w["since"], s["today"])
    body = "".join([
        brief_section(s, notes, ctx), plan_section(s, ctx), happened_section(s, ctx),
        roadmap_section(s, ctx), catalog_section(s, ctx), architecture_section(s), health_section(s, ctx),
    ])
    nav = "".join(f'<a href="#{i}">{lbl}</a>' for i, lbl in [
        ("plan", "Next week"), ("happened", "What happened"), ("roadmap", "Roadmap"),
        ("catalog", "By area"), ("architecture", "Architecture"), ("health", "Housekeeping")])
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(s["repo"])} — {e(heading)}</title><style>{CSS}</style></head><body>
<header class="top"><div class="wrap"><div class="eyebrow">{e(s["repo"])} · weekly review</div>
<h1>{e(heading)}</h1><div class="meta">Read from the repository on {e(day(s["today"]))} · branch {e(s["branch"])} at {e(s["head"])}</div></div></header>
<nav class="jump" aria-label="Sections"><div class="wrap">{nav}<button class="theme" type="button">Light / dark</button></div></nav>
<main class="wrap">{body}</main><script>{THEME_JS}</script></body></html>
"""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("snapshot")
    ap.add_argument("--notes")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    snap = json.loads(Path(a.snapshot).read_text())
    notes = json.loads(Path(a.notes).read_text()) if a.notes else None
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(render(snap, notes))
    return 0


if __name__ == "__main__":
    sys.exit(main())
