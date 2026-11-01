import { ImageResponse } from "next/og";

export const OG_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_CONTENT_TYPE = "image/png";

export interface OgFolderTile {
  title: string;
  count: string;
  accent: string;
  handles: string;
  cmkTag: string;
}

const COLLECTION_TILES: OgFolderTile[] = [
  {
    title: "Design & UI Craft",
    count: "7 skills",
    accent: "#FAB12F",
    handles: "@emilkowalski_ / @pbakaus / @shadcn",
    cmkTag: "cmk:design",
  },
  {
    title: "Visual Explainers",
    count: "3 skills",
    accent: "#82AAFF",
    handles: "@wheresryan22 / @nicobailon",
    cmkTag: "cmk:codebase-docs",
  },
  {
    title: "Workflow & Grill",
    count: "4 skills",
    accent: "#C3E88D",
    handles: "@mattpocockuk / @backnotprop / @obra",
    cmkTag: "cmk:delivery-pipeline",
  },
  {
    title: "Security & QA Gates",
    count: "3 skills",
    accent: "#F87171",
    handles: "@getsentry / @trailofbits / @vercel",
    cmkTag: "cmk:delivery-review",
  },
  {
    title: "Vendor & Cloud SDKs",
    count: "3 skills",
    accent: "#A78BFA",
    handles: "@vercel / @CloudflareDev / @supabase",
    cmkTag: "cmk:toolchain",
  },
  {
    title: "Agent Memory & Context",
    count: "2 skills",
    accent: "#38BDF8",
    handles: "@garrytan / @affaanmustafa",
    cmkTag: "cmk:learn",
  },
];

function BrandHeader({ routeBadge }: { routeBadge: string }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            display: "flex",
            width: "48px",
            height: "48px",
            borderRadius: "13px",
            backgroundColor: "#14161D",
            border: "1.5px solid rgba(130,170,255,0.45)",
            boxShadow: "0 8px 24px rgba(67,125,245,0.28)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.25 4.5H16.5C18.0188 4.5 19.25 5.73122 19.25 7.25V15.75"
              stroke="#82AAFF"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeOpacity="0.65"
            />
            <rect
              x="3.75"
              y="7.25"
              width="13"
              height="13"
              rx="3.6"
              stroke="#93C5FD"
              strokeWidth="1.9"
              fill="#0B0D13"
            />
            <path
              d="M7.35 11.6L9.75 13.75L7.35 15.9"
              stroke="#FFFFFF"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.15 15.9H13.35"
              stroke="#82AAFF"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#F5F5F3",
              letterSpacing: "-0.02em",
            }}
          >
            ai-devkit
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "#8E929F",
              letterSpacing: "0.04em",
            }}
          >
            CommandOSSLabs/ai-devkit
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 16px",
          borderRadius: "999px",
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#C3E88D",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "8px",
            height: "8px",
            borderRadius: "999px",
            backgroundColor: "#C3E88D",
          }}
        />
        <span>{routeBadge}</span>
      </div>
    </div>
  );
}

export function renderCollectionsOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "1200px",
          height: "630px",
          padding: "44px 52px",
          backgroundColor: "#0B0C10",
          backgroundImage:
            "linear-gradient(135deg, #0B0C10 0%, #121726 55%, #0D1017 100%)",
          color: "#F5F5F3",
          fontFamily: "sans-serif",
        }}
      >
        <BrandHeader routeBadge="skills.commandoss.com/skills/collections" />

        {/* Main Split Content */}
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "36px",
          }}
        >
          {/* Left Copy Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "465px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#82AAFF",
                marginBottom: "14px",
              }}
            >
              CURATED X COLLECTIONS / PAIRED WITH CMK:*
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "45px",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
              }}
            >
              Standout Agent Skills, Organized by Craft.
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "18px",
                lineHeight: 1.48,
                color: "#9CA3AF",
                marginTop: "18px",
              }}
            >
              6 translucent collection folders of vetted community skills from X — paired with 23 canonical cmk:* workflows and pinned to verified commits.
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "26px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 18px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(195,232,141,0.1)",
                  border: "1px solid rgba(195,232,141,0.28)",
                  color: "#C3E88D",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                $ npx skills add CommandOSSLabs/ai-devkit
              </div>
            </div>
          </div>

          {/* Right 2x3 Translucent Folder Bento Grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "590px",
              gap: "14px",
            }}
          >
            {COLLECTION_TILES.map((folder) => (
              <div
                key={folder.title}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "286px",
                  height: "134px",
                  padding: "16px 18px",
                  borderRadius: "18px",
                  backgroundColor: "#18151B",
                  backgroundImage:
                    "linear-gradient(155deg, rgba(45,37,53,0.88) 0%, rgba(24,21,27,0.98) 100%)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
                }}
              >
                {/* Top Folder Icon + Count + CMK pairing */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* Mini Translucent Folder SVG with peeking X card */}
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                      <path
                        d="M2 5C2 3.34315 3.34315 2 5 2H11.5L14 5H27C28.6569 5 30 6.34315 30 8V19C30 20.6569 28.6569 22 27 22H5C3.34315 22 2 20.6569 2 19V5Z"
                        fill="#221D27"
                        stroke={folder.accent}
                        strokeWidth="1.5"
                      />
                      <rect
                        x="6"
                        y="6"
                        width="20"
                        height="11"
                        rx="2"
                        fill="#0F1117"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1"
                      />
                      <rect
                        x="8"
                        y="8.5"
                        width="8"
                        height="2"
                        rx="1"
                        fill={folder.accent}
                      />
                      <path
                        d="M2 11C2 9.89543 2.89543 9 4 9H28C29.1046 9 30 9.89543 30 11V19C30 20.6569 28.6569 22 27 22H5C3.34315 22 2 20.6569 2 19V11Z"
                        fill="rgba(45,37,53,0.78)"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#D1D5DB",
                      }}
                    >
                      {folder.count}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(130,170,255,0.14)",
                      color: "#93C5FD",
                    }}
                  >
                    {folder.cmkTag}
                  </span>
                </div>

                {/* Folder Title & Creator Handles */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {folder.title}
                  </span>
                  <span
                    style={{
                      fontSize: "11.5px",
                      color: "#8E929F",
                      marginTop: "4px",
                    }}
                  >
                    {folder.handles}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: "13px",
            color: "#8E929F",
          }}
        >
          <span>23 Core cmk:* Skills  |  22 Vetted X Companion Refs  |  6 Collections</span>
          <span style={{ color: "#D1D5DB" }}>
            Claude Code  |  Codex  |  Cursor  |  OpenCode
          </span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

export function renderSurfaceOgImage({
  routeBadge,
  eyebrow,
  title,
  subtitle,
  pills,
}: {
  routeBadge: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  pills: string[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "1200px",
          height: "630px",
          padding: "50px 58px",
          backgroundColor: "#0B0C10",
          backgroundImage:
            "linear-gradient(135deg, #0B0C10 0%, #121726 55%, #0D1017 100%)",
          color: "#F5F5F3",
          fontFamily: "sans-serif",
        }}
      >
        <BrandHeader routeBadge={routeBadge} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "920px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#82AAFF",
              marginBottom: "16px",
            }}
          >
            {eyebrow.replace(/·/g, "/")}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "56px",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "22px",
              lineHeight: 1.45,
              color: "#9CA3AF",
              marginTop: "20px",
              maxWidth: "820px",
            }}
          >
            {subtitle}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "30px",
            }}
          >
            {pills.map((pill) => (
              <div
                key={pill}
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#E5E7EB",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "18px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: "14px",
            color: "#8E929F",
          }}
        >
          <span style={{ color: "#C3E88D", fontWeight: 600 }}>
            $ npx skills add CommandOSSLabs/ai-devkit
          </span>
          <span>skills.commandoss.com</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
