export type SocialPlatform =
  | "x"
  | "threads"
  | "instagram"
  | "facebook"
  | "youtube"
  | "github"
  | "web";

export type CuratedSkillSource = {
  platform?: SocialPlatform;
  postUrl?: string;
  profileUrl?: string;
  handle?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};

export type CuratedSkillRef = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  collectionId: string;
  creator: {
    name: string;
    xHandle: string;
    xUrl: string;
    xPostUrl?: string;
    platform?: SocialPlatform;
    handle?: string;
    profileUrl?: string;
    postUrl?: string;
    githubRepo: string;
    githubUrl: string;
  };
  /**
   * Platform-agnostic social & media source (supports X, Threads, Instagram, Facebook, YouTube, GitHub, Web).
   * Falls back to top-level `thumbnailUrl` / `xVideoUrl` / `xAvatarUrl` / `creator.xPostUrl` when omitted.
   */
  source?: CuratedSkillSource;
  thumbnailUrl?: string;
  xAvatarUrl?: string;
  xBannerUrl?: string;
  xVideoUrl?: string;
  installCommand?: string;
  stylePrompt?: string;
  installNote?: string;
  pinnedSha?: string;
  vettedAt: string;
  starsOrInstalls?: string;
  pairsWithCmk: string[];
  featured?: boolean;
  isNew?: boolean;
};

export type SkillCollection = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
};

export const SKILL_COLLECTIONS: SkillCollection[] = [
  {
    id: "design",
    title: "Design",
    subtitle: "UI taste, motion & polish",
    description:
      "Named-designer taste layers, motion grammars, and interface guidelines that stop agents from generating generic AI layouts.",
    badge: "Design & UI",
  },
  {
    id: "explainers",
    title: "Explainers",
    subtitle: "Interactive SVG & visual decks",
    description:
      "Skills that turn complex architectures, diffs, and plans into working isometric machines or hand-drawn HTML explainers.",
    badge: "Visuals",
  },
  {
    id: "workflow",
    title: "Workflow & Grill",
    subtitle: "Plan interrogation & human gates",
    description:
      "Elicitation companions, plan annotators, and autonomous loops that pair with cmk:requirements and cmk:delivery-pipeline.",
    badge: "Engineering",
  },
  {
    id: "security",
    title: "Security & QA",
    subtitle: "Reasoning audits & browser proof",
    description:
      "Security review lenses, differential smart-contract analyzers, and headless browser verifiers for ship evidence.",
    badge: "Verification",
  },
  {
    id: "vendors",
    title: "Vendor SDKs",
    subtitle: "First-party platform rules",
    description:
      "Official skills maintained by Vercel, Cloudflare, Supabase, and Stripe to keep generated SDK code current.",
    badge: "Ecosystem",
  },
  {
    id: "memory",
    title: "Memory & Voice",
    subtitle: "Anti-slop prose & user profiles",
    description:
      "Humanizers that strip AI writing tropes, plus personal preference and cross-session memory companions.",
    badge: "Personalization",
  },
];

export const CURATED_SKILL_REFS: CuratedSkillRef[] = [
  // ─── Design Collection ───────────────────────────────────────────────
  {
    id: "pixel-plays",
    name: "pixel-plays",
    title: "Pixel Plays — 3D Pixel Games OS UI/UX",
    tagline:
      "Open-source 3D isometric voxel & pixel diorama games built with Claude Opus 5.5 — minimal gallery OS chrome, dithered foliage, soft directional shadows, and tactile micro-controls.",
    collectionId: "design",
    creator: {
      name: "Amir Mušić",
      xHandle: "AmirMushich",
      xUrl: "https://x.com/AmirMushich",
      xPostUrl: "https://x.com/AmirMushich/status/2116509069477621819",
      githubRepo: "amirmushichge/pixel-plays",
      githubUrl: "https://github.com/amirmushichge/pixel-plays",
    },
    source: {
      platform: "x",
      postUrl: "https://x.com/AmirMushich/status/2116509069477621819",
      profileUrl: "https://x.com/AmirMushich",
      handle: "AmirMushich",
      thumbnailUrl: "https://pbs.twimg.com/amplify_video_thumb/2116507953377185792/img/7IPO0A17F2lDnamm.jpg",
      videoUrl: "https://video.twimg.com/amplify_video/2116507953377185792/vid/avc1/884x720/MgUUucrULvfImfbg.mp4?tag=29",
      avatarUrl: "https://pbs.twimg.com/profile_images/1872350781686321152/P-st4llY_400x400.jpg",
      bannerUrl: "https://pbs.twimg.com/profile_banners/249795230/1767459893",
    },
    thumbnailUrl: "https://pbs.twimg.com/amplify_video_thumb/2116507953377185792/img/7IPO0A17F2lDnamm.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1872350781686321152/P-st4llY_400x400.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/249795230/1767459893",
    xVideoUrl: "https://video.twimg.com/amplify_video/2116507953377185792/vid/avc1/884x720/MgUUucrULvfImfbg.mp4?tag=29",
    installCommand: "git clone https://github.com/amirmushichge/pixel-plays",
    stylePrompt:
      "Design an interactive 3D isometric pixel-art diorama & mini-game OS ('Pixel Plays' style): (1) pure gallery-white full-viewport stage (#FFFFFF) that lets the isometric diorama float in negative space; (2) crisp nearest-neighbor voxel/pixel rendering with dithered grass fringes, warm timber court borders, and soft angled cast shadows; (3) ultra-minimal OS switcher pill at top-center in monospace (e.g. 'Balote ▾') with zero visual clutter; (4) responsive physics and subtle ambient particle/foliage motion.",
    vettedAt: "2026-11-01",
    starsOrInstalls: "937 likes · 48k views · Open Source",
    pairsWithCmk: ["design", "project-layout"],
    featured: true,
    isNew: true,
  },
  {
    id: "the-making-of-nhang",
    name: "the-making-of-nhang",
    title: "The Making of Nhang — Illustrated Editorial UI/UX Style",
    tagline:
      "Warm giay-do rice-paper canvas (#F5F0E6), hand-drawn ultramarine & vermilion colored-pencil cross-hatching in plain JavaScript, bilingual notebook statechart nodes, and step-by-step playback controls.",
    collectionId: "design",
    creator: {
      name: "Ann Nguyen",
      xHandle: "ann_nnng",
      xUrl: "https://x.com/ann_nnng",
      xPostUrl: "https://x.com/ann_nnng/status/2116811409921372642",
      githubRepo: "ann_nnng/the-making-of-nhang",
      githubUrl: "https://x.com/ann_nnng/status/2116811409921372642",
    },
    thumbnailUrl: "https://pbs.twimg.com/amplify_video_thumb/2116811213246242816/img/k5NYAZhiuP4gAvKK.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/2091330595632861184/QKmUwPaL_400x400.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/1160414154974519296/1744434703",
    xVideoUrl: "https://video.twimg.com/amplify_video/2116811213246242816/vid/avc1/900x720/kyh5C2Q33CYP3Kpn.mp4?tag=29",
    installCommand: "npx skills add cursor/plugins --skill statechart",
    stylePrompt:
      "Draw an interactive step-by-step illustrated diagram in plain JavaScript using 'The Making of Nhang' editorial UI/UX style: (1) warm Vietnamese giay-do rice-paper background (#F5F0E6) with subtle organic grain; (2) procedural colored-pencil & ballpoint cross-hatch illustrations in ultramarine blue (#1E3296), vermilion red (#D6382E), bamboo green (#5DBB46), and golden ochre (#E8A331) with jittered multi-pass strokes; (3) distressed typewriter slab-serif typography (Special Elite / Courier Prime) with Roman numeral chapter kicker, bold ink-bleed display title, blue italic English subtitle, and red italic Vietnamese caption; (4) lined notebook-paper statechart nodes with red margin rule, bilingual labels, wavy blue pencil bottom edge, and animated state token; (5) fixed bottom playback bar with pill buttons (restart, prev, pause, next, 3x speed) and step counter (e.g. 2/27).",
    vettedAt: "2026-11-01",
    starsOrInstalls: "UI/UX Style + JS Canvas · @ann_nnng",
    pairsWithCmk: ["design", "codebase-docs"],
    featured: true,
    isNew: true,
  },
  {
    id: "stageshow",
    name: "stageshow",
    title: "Stageshow Faux UI & Bento Animations",
    tagline:
      "Stageshow: a skill that helps your agent make better faux UI stills, animations, bento grids, and interactive product demos.",
    collectionId: "design",
    creator: {
      name: "Benji Taylor",
      xHandle: "benjitaylor",
      xUrl: "https://x.com/benjitaylor",
      xPostUrl: "https://x.com/benjitaylor/status/2116593247854453244",
      githubRepo: "benjitaylor/skills",
      githubUrl: "https://github.com/benjitaylor/skills",
    },
    thumbnailUrl: "https://pbs.twimg.com/amplify_video_thumb/2116591037816971264/img/646-9xgMoEXyzL8m.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1485350275372048384/FwGgXuTk_400x400.png",
    xVideoUrl: "https://video.twimg.com/amplify_video/2116591037816971264/vid/avc1/1030x720/5_qKCVcaDe2-nLr3.mp4?tag=29",
    installCommand: "npx skills add benjitaylor/skills --skill stageshow",
    vettedAt: "2026-10-31",
    starsOrInstalls: "7.2k likes · 420k views",
    pairsWithCmk: ["design", "delivery-review"],
    featured: true,
    isNew: true,
  },
  {
    id: "dialkit",
    name: "dialkit",
    title: "DialKit Live Interface & Spring Tuner",
    tagline:
      "Live controls and visual timeline editing for React, Svelte, Vue, and JS — tune springs, motion, layout, and shaders by feel.",
    collectionId: "design",
    creator: {
      name: "Josh Puckett",
      xHandle: "joshpuckett",
      xUrl: "https://x.com/joshpuckett",
      xPostUrl: "https://x.com/joshpuckett/status/2079014450712203291",
      githubRepo: "joshpuckett/dialkit",
      githubUrl: "https://github.com/joshpuckett/dialkit",
    },
    thumbnailUrl: "https://pbs.twimg.com/amplify_video_thumb/2079013052712894464/img/WhxrTiVmoS2-t0Ax.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1270368527690522626/-3QQH-bB_400x400.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/11777842/1728934714",
    xVideoUrl: "https://video.twimg.com/amplify_video/2079013052712894464/vid/avc1/992x720/nGFfeEN0DapV_mHw.mp4?tag=29",
    installCommand: "npm install dialkit",
    vettedAt: "2026-10-31",
    starsOrInstalls: "1.6k likes · 94k views",
    pairsWithCmk: ["design", "rule"],
    featured: true,
    isNew: true,
  },
  {
    id: "emilkowalski-skills",
    name: "emilkowalski/skills",
    title: "Emil Kowalski Motion & UI Polish",
    tagline:
      "A named designer's taste: spring physics, restraint in micro-interactions, and Apple-grade animation grammar for web UI.",
    collectionId: "design",
    creator: {
      name: "Emil Kowalski",
      xHandle: "emilkowalski_",
      xUrl: "https://x.com/emilkowalski_",
      githubRepo: "emilkowalski/skills",
      githubUrl: "https://github.com/emilkowalski/skills",
    },
    thumbnailUrl: "https://emilkowal.ski/skill/opengraph-image.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1469017066795679751/CjEOyirb_400x400.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/1255500442898964481/1703289098",
    installCommand: "npx skills add emilkowalski/skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "45.1k stars",
    pairsWithCmk: ["design", "rule", "delivery-review"],
    featured: true,
    isNew: true,
  },
  {
    id: "impeccable",
    name: "impeccable",
    title: "Impeccable Design Language",
    tagline:
      "Opinionated design-language layer with /polish, /audit, and /typeset commands plus a comprehensive UI anti-pattern library.",
    collectionId: "design",
    creator: {
      name: "Paul Bakaus",
      xHandle: "pbakaus",
      xUrl: "https://x.com/pbakaus",
      xPostUrl: "https://x.com/adrien_ninet/status/2041825321721458961",
      githubRepo: "pbakaus/impeccable",
      githubUrl: "https://github.com/pbakaus/impeccable",
    },
    thumbnailUrl: "https://impeccable.style/og-image-v6.png",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1550292580117622784/cT3WhwXw_400x400.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/12999402/1777331270",
    xVideoUrl: "https://video.twimg.com/amplify_video/2041825305669857283/vid/avc1/1280x720/tpRpK9gSAglhlRFA.mp4?tag=21",
    installCommand: "npx skills add pbakaus/impeccable",
    vettedAt: "2026-10-11",
    starsOrInstalls: "79.5k stars",
    pairsWithCmk: ["design", "delivery-simplify"],
    featured: true,
  },
  {
    id: "taste-skill",
    name: "design-taste-frontend",
    title: "Metric-Driven Taste Skill",
    tagline:
      "Quantified layout rhythm, optical alignment, typography hierarchy, and spacing rules for frontend engineering.",
    collectionId: "design",
    creator: {
      name: "Leon Lin",
      xHandle: "Leonxlnx",
      xUrl: "https://x.com/Leonxlnx",
      githubRepo: "Leonxlnx/taste-skill",
      githubUrl: "https://github.com/Leonxlnx/taste-skill",
    },
    thumbnailUrl: "https://repository-images.githubusercontent.com/1162099055/0a968964-fdca-4781-853b-84afc2bc2d31",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1801274240634937344/rYkSOdHw_400x400.jpg",
    xBannerUrl: "https://www.tasteskill.dev/og-image.jpg",
    installCommand: "npx skills add Leonxlnx/taste-skill --skill design-taste-frontend",
    vettedAt: "2026-10-11",
    starsOrInstalls: "94.5k stars",
    pairsWithCmk: ["design", "rule"],
  },
  {
    id: "ui-ux-pro-max",
    name: "ui-ux-pro-max",
    title: "UI/UX Pro Max System Generator",
    tagline:
      "Searchable style, palette, and font pairing database with a design-system generator and WCAG contrast checklist.",
    collectionId: "design",
    creator: {
      name: "NextLevelBuilder",
      xHandle: "nextlevelbuild",
      xUrl: "https://x.com/search?q=ui-ux-pro-max-skill",
      githubRepo: "nextlevelbuilder/ui-ux-pro-max-skill",
      githubUrl: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    },
    thumbnailUrl: "https://repository-images.githubusercontent.com/1106996539/d7c84c2d-e797-405f-a868-87fb194e8432",
    xAvatarUrl: "https://avatars.githubusercontent.com/u/246974152?v=4",
    xBannerUrl: "https://uupm.cc/share.png",
    installCommand: "npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max",
    vettedAt: "2026-10-11",
    starsOrInstalls: "134.6k stars",
    pairsWithCmk: ["design", "requirements"],
  },
  {
    id: "frontend-design",
    name: "frontend-design",
    title: "Anthropic Frontend Design Baseline",
    tagline:
      "Anthropic's canonical baseline skill for avoiding generic AI UI layouts, purple gradients, and cookie-cutter card grids.",
    collectionId: "design",
    creator: {
      name: "Anthropic",
      xHandle: "AnthropicAI",
      xUrl: "https://x.com/AnthropicAI",
      githubRepo: "anthropics/skills",
      githubUrl: "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
    },
    thumbnailUrl: "https://pbs.twimg.com/profile_banners/1353836358901501952/1719228429",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1798110641414443008/XP8gyBaY_400x400.jpg",
    xBannerUrl: "https://opengraph.githubassets.com/89a9ab61c8e03f11c2ce9cd1c6c4d641aee8037ebbc4e8ce2c1bb1e458e88de1/anthropics/skills",
    installCommand: "npx skills add anthropics/skills --skill frontend-design",
    vettedAt: "2026-10-11",
    starsOrInstalls: "973k installs",
    pairsWithCmk: ["design", "repo-setup"],
  },
  {
    id: "web-design-guidelines",
    name: "web-design-guidelines",
    title: "Vercel Web Interface Guidelines",
    tagline:
      "Audits components against Vercel's interface checklist: keyboard focus rings, hit targets, tabular numerals, and layout stability.",
    collectionId: "design",
    creator: {
      name: "Vercel Labs",
      xHandle: "vercel",
      xUrl: "https://x.com/vercel",
      githubRepo: "vercel-labs/agent-skills",
      githubUrl: "https://github.com/vercel-labs/agent-skills",
    },
    thumbnailUrl: "https://pbs.twimg.com/profile_banners/4686835494/1768602813",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1767351110228918272/3Pndc5OT_400x400.png",
    xBannerUrl: "https://opengraph.githubassets.com/37abb79e97149a7ab6b0f994db64997203f3a6db7813f1edfba229094141f463/vercel-labs/agent-skills",
    installCommand: "npx skills add vercel-labs/agent-skills --skill web-design-guidelines",
    vettedAt: "2026-10-11",
    starsOrInstalls: "32.2k stars",
    pairsWithCmk: ["delivery-review", "rule"],
  },
  {
    id: "shadcn-skill",
    name: "shadcn/ui",
    title: "Official shadcn/ui Registry Skill",
    tagline:
      "Teaches agents shadcn CLI v4, custom component registries, and clean token wiring without overwriting project globals.",
    collectionId: "design",
    creator: {
      name: "shadcn",
      xHandle: "shadcn",
      xUrl: "https://x.com/shadcn",
      githubRepo: "shadcn-ui/ui",
      githubUrl: "https://ui.shadcn.com/docs/skills",
    },
    thumbnailUrl: "https://repository-images.githubusercontent.com/585146387/5afcd3e9-126b-48c8-b8d1-e17240c10d51",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    xBannerUrl: "https://repository-images.githubusercontent.com/585146387/5afcd3e9-126b-48c8-b8d1-e17240c10d51",
    installCommand: "npx skills add shadcn/ui",
    vettedAt: "2026-10-11",
    starsOrInstalls: "125k stars",
    pairsWithCmk: ["toolchain", "project-layout"],
  },

  // ─── Explainers Collection ───────────────────────────────────────────
  {
    id: "gamedev-cheatsheet",
    name: "gamedev-cheatsheet",
    title: "Game Dev Cheat Sheet — 34 Animated AI Prompt Concepts",
    tagline:
      "34 interactive game development & rendering concepts with live animations and exact vocabulary lines to paste into AI coding prompts.",
    collectionId: "explainers",
    creator: {
      name: "Nicolas Zullo",
      xHandle: "NicolasZu",
      xUrl: "https://x.com/NicolasZu",
      xPostUrl: "https://x.com/NicolasZu/status/2116601766410326177",
      githubRepo: "NicolasZu/gamedev-cheatsheet",
      githubUrl: "https://gamedev-cheatsheet.com",
    },
    thumbnailUrl: "https://pbs.twimg.com/amplify_video_thumb/2116599538760781824/img/QnwZuRP1mdCGmX5R.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1592537257008840709/dIE0_SfE_400x400.jpg",
    xBannerUrl: "https://gamedev-cheatsheet.com/og.jpg",
    xVideoUrl: "https://video.twimg.com/amplify_video/2116599538760781824/vid/avc1/1032x720/TN7jG4oIxcXmtgxi.mp4?tag=29",
    installCommand: "https://gamedev-cheatsheet.com",
    vettedAt: "2026-10-31",
    starsOrInstalls: "1.1k likes · 1.9k bookmarks · 61.5k views",
    pairsWithCmk: ["glossary", "design", "codebase-docs"],
    featured: true,
    isNew: true,
  },
  {
    id: "anatomy",
    name: "anatomy",
    title: "Anatomy — Explain by Building",
    tagline:
      "Explains a technical concept by inventing a working machine whose operation is the concept, rendered as interactive isometric SVG.",
    collectionId: "explainers",
    creator: {
      name: "Ryan",
      xHandle: "wheresryan22",
      xUrl: "https://x.com/wheresryan22",
      githubRepo: "wheresryan22/anatomy",
      githubUrl: "https://github.com/wheresryan22/anatomy",
    },
    thumbnailUrl: "https://skills.wheresryan.sh/anatomy/og.png",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/2099342814383308806/jbg4Mcs9_400x400.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/1688810283601387520/1770834316",
    installCommand: "npx skills add wheresryan22/anatomy",
    vettedAt: "2026-10-11",
    starsOrInstalls: "418 stars · MIT",
    pairsWithCmk: ["codebase-docs", "design", "docs"],
    featured: true,
    isNew: true,
  },
  {
    id: "visual-explainer",
    name: "visual-explainer",
    title: "Visual Explainer Decks & Diffs",
    tagline:
      "Builds self-contained HTML pages and slide decks with hand-drawn diagrams for architecture reviews, PR recaps, and plan audits.",
    collectionId: "explainers",
    creator: {
      name: "Nico Bailon",
      xHandle: "nicobailon",
      xUrl: "https://x.com/nicobailon",
      xPostUrl: "https://x.com/JayScambler/status/2088356230968287547",
      githubRepo: "nicobailon/visual-explainer",
      githubUrl: "https://github.com/nicobailon/visual-explainer",
    },
    thumbnailUrl: "https://pbs.twimg.com/amplify_video_thumb/2088356115289395201/img/YnyFaXJaMAE2smE6.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/2031940627114463232/JmwSPNSq_200x200.jpg",
    xBannerUrl: "https://opengraph.githubassets.com/b020eacb9a0242b155f46ef59309925bb23ac7c62bf63012f45b705218ec022e/nicobailon/visual-explainer",
    xVideoUrl: "https://video.twimg.com/amplify_video/2088356115289395201/vid/avc1/1128x720/AySRhHycB4Wi4P8B.mp4?tag=29",
    installCommand: "npx skills add nicobailon/visual-explainer",
    vettedAt: "2026-10-11",
    starsOrInstalls: "10.3k stars",
    pairsWithCmk: ["design", "delivery-handoff", "delivery-review"],
    featured: true,
  },
  {
    id: "understand-anything",
    name: "Understand-Anything",
    title: "Understand-Anything Knowledge Graph",
    tagline:
      "Turns an unfamiliar repository into an interactive, queryable knowledge graph that complements progressive-disclosure docs.",
    collectionId: "explainers",
    creator: {
      name: "Egonex AI",
      xHandle: "fleetingbits",
      xUrl: "https://x.com/fleetingbits",
      xPostUrl: "https://x.com/fleetingbits/status/2088016749849682120",
      githubRepo: "Egonex-AI/Understand-Anything",
      githubUrl: "https://github.com/Egonex-AI/Understand-Anything",
    },
    thumbnailUrl: "https://pbs.twimg.com/media/HPofaRHbMAA8NNO.jpg?name=large",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1905042879460069376/XLCyb9Cr_200x200.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/1699179045764612096/1699141885",
    installCommand: "npx skills add Egonex-AI/Understand-Anything",
    vettedAt: "2026-10-11",
    starsOrInstalls: "85.9k stars",
    pairsWithCmk: ["codebase-docs", "discover-efforts"],
  },

  // ─── Workflow & Grill Collection ─────────────────────────────────────
  {
    id: "grill-me",
    name: "grill-me",
    title: "Matt Pocock's Grill-Me Interrogation",
    tagline:
      "Relentlessly interviews you about edge cases, hidden assumptions, and trade-offs before a single line of spec or code is written.",
    collectionId: "workflow",
    creator: {
      name: "Matt Pocock",
      xHandle: "mattpocockuk",
      xUrl: "https://x.com/mattpocockuk",
      githubRepo: "mattpocock/skills",
      githubUrl: "https://github.com/mattpocock/skills",
    },
    thumbnailUrl: "https://res.cloudinary.com/total-typescript/image/upload/v1777381841/skills-og_2x.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1666460461884211204/SmBm505D_400x400.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/346640777/1779721449",
    installCommand: "npx skills add mattpocock/skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "1.3M installs",
    pairsWithCmk: ["requirements", "delivery-spec-plan", "adr"],
    featured: true,
    isNew: true,
  },
  {
    id: "plannotator",
    name: "plannotator",
    title: "Plannotator — Local Plan & Diff Gate",
    tagline:
      "Annotate an agent's implementation plan locally before execution and review diffs PR-style with structured feedback back to the agent.",
    collectionId: "workflow",
    creator: {
      name: "backnotprop",
      xHandle: "backnotprop",
      xUrl: "https://x.com/backnotprop",
      xPostUrl: "https://x.com/plannotator/status/2093419561077154287",
      githubRepo: "backnotprop/plannotator",
      githubUrl: "https://github.com/backnotprop/plannotator",
    },
    thumbnailUrl: "https://pbs.twimg.com/amplify_video_thumb/2093418875631353856/img/iKilY-db-ShvKgyT.jpg",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1993077560985767936/kJPMmCOb_400x400.jpg",
    xBannerUrl: "https://plannotator.ai/assets/plannotator-generic-og-v1.jpg",
    xVideoUrl: "https://video.twimg.com/amplify_video/2093418875631353856/vid/avc1/1144x720/bs8zrtzV4LZhUC68.mp4?tag=29",
    installNote: "Use when already installed locally (/plannotator-annotate & /plannotator-review)",
    pinnedSha: "5e38b79",
    vettedAt: "2026-10-12",
    starsOrInstalls: "Pinned SHA 5e38b79",
    pairsWithCmk: ["delivery-spec-plan", "delivery-ship", "delivery-review"],
    featured: true,
    isNew: true,
  },
  {
    id: "superpowers",
    name: "superpowers",
    title: "Obra Superpowers Methodology",
    tagline:
      "Battle-tested workflows for structured brainstorming, TDD, systematic debugging, and subagent-driven implementation.",
    collectionId: "workflow",
    creator: {
      name: "Jesse Vincent",
      xHandle: "obra",
      xUrl: "https://x.com/obra",
      githubRepo: "obra/superpowers",
      githubUrl: "https://github.com/obra/superpowers",
    },
    thumbnailUrl: "https://pbs.twimg.com/profile_banners/289403/1385248556",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1594449061754843136/gc_DEnhp_400x400.jpg",
    xBannerUrl: "https://opengraph.githubassets.com/d628990887706651e0730a8cba13a90a76b4c1207d405b2e22917fd1cb869fe9/obra/superpowers",
    installCommand: "npx skills add obra/superpowers",
    vettedAt: "2026-10-11",
    starsOrInstalls: "297k stars",
    pairsWithCmk: ["delivery-pipeline", "requirements", "delivery-spec-plan"],
  },
  {
    id: "compound-engineering",
    name: "compound-engineering",
    title: "Every Inc Compound Engineering",
    tagline:
      "Home of the ce-compound session retrospective pattern that turns debugging sessions into durable repository learnings.",
    collectionId: "workflow",
    creator: {
      name: "Every Inc",
      xHandle: "every",
      xUrl: "https://x.com/every",
      githubRepo: "EveryInc/compound-engineering-plugin",
      githubUrl: "https://github.com/EveryInc/compound-engineering-plugin",
    },
    thumbnailUrl: "https://pbs.twimg.com/profile_banners/809565356/1791303348",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/2087946611716472832/m2zR-Rci_400x400.jpg",
    xBannerUrl: "https://opengraph.githubassets.com/985ac33607f5402a82da2372fc3e648960bef0eb9e895b58347efa89c547a551/EveryInc/compound-engineering-plugin",
    installCommand: "npx skills add EveryInc/compound-engineering-plugin",
    vettedAt: "2026-10-11",
    starsOrInstalls: "25.5k stars",
    pairsWithCmk: ["learn", "rule", "delivery-workflow"],
  },

  // ─── Security & QA Collection ────────────────────────────────────────
  {
    id: "sentry-security-review",
    name: "security-review",
    title: "Sentry Reasoning Security Review",
    tagline:
      "Reasoning-first security review lens from Sentry engineers — traces trust boundaries and exploit paths instead of running a rote checklist.",
    collectionId: "security",
    creator: {
      name: "Sentry",
      xHandle: "getsentry",
      xUrl: "https://x.com/getsentry",
      githubRepo: "getsentry/skills",
      githubUrl: "https://github.com/getsentry/skills",
    },
    thumbnailUrl: "https://pbs.twimg.com/profile_banners/1923107326858493952/1762815857",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1988020311061917702/0OIJY0PS_400x400.png",
    xBannerUrl: "https://opengraph.githubassets.com/e07908a205fa8c0df51eec8a77ca91800144c12e827bd0dda23d41886457a762/getsentry/skills",
    installCommand: "npx skills add getsentry/skills --skill security-review",
    vettedAt: "2026-10-11",
    starsOrInstalls: "1.0k stars",
    pairsWithCmk: ["delivery-review", "enclave"],
    featured: true,
  },
  {
    id: "trailofbits-skills",
    name: "trailofbits/skills",
    title: "Trail of Bits Differential & Audit Suite",
    tagline:
      "CodeQL/Semgrep rules, differential security review, and smart-contract / cryptographic audit workflows.",
    collectionId: "security",
    creator: {
      name: "Trail of Bits",
      xHandle: "trailofbits",
      xUrl: "https://x.com/trailofbits",
      githubRepo: "trailofbits/skills",
      githubUrl: "https://github.com/trailofbits/skills",
    },
    thumbnailUrl: "https://pbs.twimg.com/profile_banners/127289989/1628021425",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1422651083500003334/FbbYmQT__400x400.png",
    xBannerUrl: "https://opengraph.githubassets.com/b9091f8c11f1f5fd19e6fc31745aba143b38d1d99f783db325687c45df083d42/trailofbits/skills",
    installCommand: "npx skills add trailofbits/skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "7.5k stars",
    pairsWithCmk: ["delivery-review", "sui-sdk", "rust"],
  },
  {
    id: "agent-browser",
    name: "agent-browser",
    title: "Vercel Agent Browser QA",
    tagline:
      "Deterministic browser automation skill for capturing live UI verification evidence before opening a pull request.",
    collectionId: "security",
    creator: {
      name: "Vercel Labs",
      xHandle: "vercel",
      xUrl: "https://x.com/vercel",
      githubRepo: "vercel-labs/agent-browser",
      githubUrl: "https://github.com/vercel-labs/agent-browser",
    },
    thumbnailUrl: "https://repository-images.githubusercontent.com/1140553475/42a931e7-9d10-4ffb-8605-41de16eefd0b",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1767351110228918272/3Pndc5OT_400x400.png",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/4686835494/1768602813",
    installCommand: "npx skills add vercel-labs/agent-browser",
    vettedAt: "2026-10-11",
    starsOrInstalls: "1.1M installs",
    pairsWithCmk: ["delivery-ship", "local-stack"],
  },

  // ─── Vendor SDKs Collection ──────────────────────────────────────────
  {
    id: "vercel-agent-skills",
    name: "react-best-practices",
    title: "Vercel React & Next.js Best Practices",
    tagline:
      "First-party guidance on React 19, Server Actions, caching, and bundle optimization straight from the Next.js team.",
    collectionId: "vendors",
    creator: {
      name: "Vercel",
      xHandle: "vercel",
      xUrl: "https://x.com/vercel",
      githubRepo: "vercel-labs/agent-skills",
      githubUrl: "https://github.com/vercel-labs/agent-skills",
    },
    thumbnailUrl: "https://repository-images.githubusercontent.com/1140553475/42a931e7-9d10-4ffb-8605-41de16eefd0b",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1767351110228918272/3Pndc5OT_400x400.png",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/4686835494/1768602813",
    installCommand: "npx skills add vercel-labs/agent-skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "32.2k stars",
    pairsWithCmk: ["toolchain", "codebase-docs"],
  },
  {
    id: "cloudflare-skills",
    name: "cloudflare/skills",
    title: "Cloudflare Workers & Edge Platform",
    tagline:
      "Up-to-date bindings for Workers, Durable Objects, R2, D1, and Wrangler configuration without stale training-data hallucinations.",
    collectionId: "vendors",
    creator: {
      name: "Cloudflare",
      xHandle: "CloudflareDev",
      xUrl: "https://x.com/CloudflareDev",
      githubRepo: "cloudflare/skills",
      githubUrl: "https://github.com/cloudflare/skills",
    },
    thumbnailUrl: "https://pbs.twimg.com/profile_banners/300637864/1792655993",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/2091957221253173248/kB_huM5C_400x400.jpg",
    xBannerUrl: "https://opengraph.githubassets.com/d090393fe2bfa9e1aeafc5ba3023239375f0d021c2c741c607d32d5eb18d03f5/cloudflare/skills",
    installCommand: "npx skills add cloudflare/skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "3.0k stars",
    pairsWithCmk: ["infra", "cicd"],
  },
  {
    id: "supabase-skills",
    name: "postgres-best-practices",
    title: "Supabase & Postgres Best Practices",
    tagline:
      "Row-Level Security policies, indexing strategies, migration hygiene, and edge function patterns from Supabase.",
    collectionId: "vendors",
    creator: {
      name: "Supabase",
      xHandle: "supabase",
      xUrl: "https://x.com/supabase",
      githubRepo: "supabase/agent-skills",
      githubUrl: "https://github.com/supabase/agent-skills",
    },
    thumbnailUrl: "https://pbs.twimg.com/profile_banners/1219566488325017602/1747832797",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1822981431586439168/7xkKXRGQ_400x400.jpg",
    xBannerUrl: "https://opengraph.githubassets.com/82e8e541cc939613b820854f5fa0e790f57709a511519fd6899649c519a886843/supabase/agent-skills",
    installCommand: "npx skills add supabase/agent-skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "2.7k stars",
    pairsWithCmk: ["local-stack", "testcontainers"],
  },

  // ─── Memory & Voice Collection ───────────────────────────────────────
  {
    id: "humanizer",
    name: "humanizer",
    title: "Humanizer — Strip 26 AI Writing Tropes",
    tagline:
      "Removes puffery, 'delve/testament/tapestry' vocabulary, and robotic transitions from documentation, PR descriptions, and release notes.",
    collectionId: "memory",
    creator: {
      name: "blader",
      xHandle: "blader",
      xUrl: "https://x.com/blader",
      githubRepo: "blader/humanizer",
      githubUrl: "https://github.com/blader/humanizer",
    },
    thumbnailUrl: "https://repository-images.githubusercontent.com/1136666433/96e8e1ef-3e9d-4c03-be6f-15d6fd662f6d",
    xAvatarUrl: "https://pbs.twimg.com/profile_images/1600585199800111106/zIdLh9UL_400x400.jpg",
    xBannerUrl: "https://pbs.twimg.com/profile_banners/4468111/1729962315",
    installCommand: "npx skills add blader/humanizer",
    vettedAt: "2026-10-11",
    starsOrInstalls: "55.5k stars",
    pairsWithCmk: ["docs", "delivery-ship", "requirements"],
    featured: true,
  },
  {
    id: "soul-md",
    name: "soul.md",
    title: "SOUL.md Personal Style Builder",
    tagline:
      "Interviews you and analyzes your real writing samples to synthesize a personal SOUL.md and STYLE.md preference layer.",
    collectionId: "memory",
    creator: {
      name: "Aaron Mars",
      xHandle: "aeonfun",
      xUrl: "https://x.com/aeonfun",
      githubRepo: "aeonfun/soul.md",
      githubUrl: "https://github.com/aeonfun/soul.md",
    },
    thumbnailUrl: "https://repository-images.githubusercontent.com/1148236572/202b6911-c8fa-4961-8dca-e085a03ff563",
    xAvatarUrl: "https://avatars.githubusercontent.com/u/10599870?v=4",
    xBannerUrl: "https://repository-images.githubusercontent.com/1148236572/202b6911-c8fa-4961-8dca-e085a03ff563",
    installCommand: "npx skills add aeonfun/soul.md",
    vettedAt: "2026-10-11",
    starsOrInstalls: "687 stars",
    pairsWithCmk: ["agent-instructions", "learn"],
    isNew: true,
  },
];

export type StarterCombo = {
  id: string;
  title: string;
  problem: string;
  cmkSkillId: string;
  cmkHandle: string;
  companionRefId: string;
  companionName: string;
  creatorHandle: string;
  outcome: string;
};

export const STARTER_COMBOS: StarterCombo[] = [
  {
    id: "spec-grill",
    title: "Interrogate Before Writing Requirements",
    problem: "Agents jump straight into drafting a PRD while edge cases are still fuzzy.",
    cmkSkillId: "requirements",
    cmkHandle: "cmk:requirements",
    companionRefId: "grill-me",
    companionName: "grill-me",
    creatorHandle: "mattpocockuk",
    outcome:
      "grill-me stress-tests your assumptions first; cmk:requirements then locks the answers into EARS acceptance criteria under docs/requirements/.",
  },
  {
    id: "plan-gate",
    title: "Human-Annotated Spec & Diff Gate",
    problem: "Long implementation plans scroll past in terminal chat without line-by-line human sign-off.",
    cmkSkillId: "delivery-spec-plan",
    cmkHandle: "cmk:delivery-spec-plan",
    companionRefId: "plannotator",
    companionName: "plannotator",
    creatorHandle: "backnotprop",
    outcome:
      "cmk:delivery-spec-plan hands its finished plan to /plannotator-annotate for inline human notes before Phase 3 implementation starts.",
  },
  {
    id: "visual-arch",
    title: "Living System Design + Visual Explainers",
    problem: "Prose design docs are accurate, but reviewers need a mental model they can scan in 15 seconds.",
    cmkSkillId: "design",
    cmkHandle: "cmk:design",
    companionRefId: "anatomy",
    companionName: "anatomy",
    creatorHandle: "wheresryan22",
    outcome:
      "cmk:design records canonical architecture in docs/design/; anatomy or visual-explainer renders an interactive isometric SVG machine from it.",
  },
  {
    id: "ui-taste-rules",
    title: "Codify Designer Taste into Repo Rules",
    problem: "Frontend diffs drift back to generic AI spacing and linear easings across sessions.",
    cmkSkillId: "rule",
    cmkHandle: "cmk:rule",
    companionRefId: "emilkowalski-skills",
    companionName: "emilkowalski/skills",
    creatorHandle: "emilkowalski_",
    outcome:
      "Pair Emil Kowalski's motion grammar or Paul Bakaus's impeccable with cmk:rule so your repo's docs/rules/react/ enforces the exact standard.",
  },
];

export function buildShoutoutTweet(ref: CuratedSkillRef): string {
  const cmkList = ref.pairsWithCmk.slice(0, 2).map((id) => `cmk:${id}`).join(" + ");
  const cmd = ref.installCommand ?? `https://github.com/${ref.creator.githubRepo}`;
  return [
    `Shoutout to @${ref.creator.xHandle} for ${ref.title} (${ref.name}) — curated in the @CommandOSSLabs AI DevKit Collections.`,
    ``,
    `${ref.tagline}`,
    cmkList ? `Pairs great with ${cmkList} in our SDLC workflow.` : ``,
    ``,
    `Try it: ${cmd}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function detectSocialPlatform(rawUrl?: string | null): SocialPlatform {
  if (!rawUrl) return "x";
  try {
    const trimmed = rawUrl.trim();
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const host = new URL(normalized).hostname.replace(/^www\./i, "").toLowerCase();
    if (host === "x.com" || host === "twitter.com" || host.endsWith(".twitter.com")) return "x";
    if (host === "threads.net" || host === "threads.com" || host.endsWith(".threads.net")) return "threads";
    if (host === "instagram.com" || host === "instagr.am" || host.endsWith(".instagram.com")) return "instagram";
    if (host === "facebook.com" || host === "fb.com" || host === "fb.watch" || host.endsWith(".facebook.com")) {
      return "facebook";
    }
    if (host === "youtube.com" || host === "youtu.be" || host.endsWith(".youtube.com")) return "youtube";
    if (host === "github.com" || host.endsWith(".github.com")) return "github";
    return "web";
  } catch {
    return "x";
  }
}

export function getSocialPlatformLabel(platform: SocialPlatform): string {
  switch (platform) {
    case "x":
      return "X";
    case "threads":
      return "Threads";
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "youtube":
      return "YouTube";
    case "github":
      return "GitHub";
    default:
      return "Web";
  }
}

export function resolveRefPlatform(ref: CuratedSkillRef): SocialPlatform {
  if (ref.source?.platform) return ref.source.platform;
  if (ref.creator.platform) return ref.creator.platform;
  const candidateUrl =
    ref.source?.postUrl ??
    ref.creator.postUrl ??
    ref.creator.xPostUrl ??
    ref.source?.profileUrl ??
    ref.creator.profileUrl ??
    ref.creator.xUrl;
  return detectSocialPlatform(candidateUrl);
}

export function resolveRefHandle(ref: CuratedSkillRef): string {
  return (
    ref.source?.handle ??
    ref.creator.handle ??
    ref.creator.xHandle ??
    ref.creator.name
  ).replace(/^@/, "");
}

export function resolveRefPostUrl(ref: CuratedSkillRef): string | undefined {
  return ref.source?.postUrl ?? ref.creator.postUrl ?? ref.creator.xPostUrl;
}

export function resolveRefVideoUrl(ref: CuratedSkillRef): string | null {
  return ref.source?.videoUrl ?? ref.xVideoUrl ?? null;
}

export function resolveRefXLink(ref: CuratedSkillRef): string {
  return (
    ref.source?.postUrl ||
    ref.creator.postUrl ||
    ref.creator.xPostUrl ||
    ref.source?.profileUrl ||
    ref.creator.profileUrl ||
    ref.creator.xUrl ||
    `https://x.com/${resolveRefHandle(ref)}`
  );
}

export function resolveRefThumbnail(ref: CuratedSkillRef): string {
  if (ref.source?.thumbnailUrl) return ref.source.thumbnailUrl;
  if (ref.thumbnailUrl) return ref.thumbnailUrl;
  if (ref.source?.bannerUrl) return ref.source.bannerUrl;
  if (ref.xBannerUrl) return ref.xBannerUrl;
  const repo = ref.creator.githubRepo?.trim();
  if (repo && repo.includes("/") && !repo.startsWith("http")) {
    return `https://opengraph.githubassets.com/1/${repo}`;
  }
  const handle = resolveRefHandle(ref).trim();
  const platform = resolveRefPlatform(ref);
  if (handle) {
    const provider = platform === "threads" ? "instagram" : platform === "web" ? "x" : platform;
    return `https://unavatar.io/${provider}/${handle}`;
  }
  return "https://pbs.twimg.com/profile_banners/4686835494/1768602813";
}

export function resolveRefFallbackThumbnail(ref: CuratedSkillRef): string {
  const primary = ref.source?.thumbnailUrl ?? ref.thumbnailUrl;
  const banner = ref.source?.bannerUrl ?? ref.xBannerUrl;
  if (banner && banner !== primary) return banner;
  const repo = ref.creator.githubRepo?.trim();
  if (repo && repo.includes("/") && !repo.startsWith("http")) {
    return `https://opengraph.githubassets.com/1/${repo}`;
  }
  return resolveRefAvatar(ref);
}

export function resolveRefAvatar(ref: CuratedSkillRef): string {
  if (ref.source?.avatarUrl) return ref.source.avatarUrl;
  if (ref.xAvatarUrl) return ref.xAvatarUrl;
  const handle = resolveRefHandle(ref).trim();
  const platform = resolveRefPlatform(ref);
  if (handle) {
    const provider = platform === "threads" ? "instagram" : platform === "web" ? "x" : platform;
    return `https://unavatar.io/${provider}/${handle}`;
  }
  return "https://pbs.twimg.com/profile_images/1767351110228918272/3Pndc5OT_400x400.png";
}

