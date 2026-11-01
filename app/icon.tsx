import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: "#14161D",
          border: "1.5px solid rgba(130,170,255,0.45)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M7.25 4.5H16.5C18.0188 4.5 19.25 5.73122 19.25 7.25V15.75"
            stroke="#82AAFF"
            strokeWidth="2"
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
            strokeWidth="2"
            fill="#0B0D13"
          />
          <path
            d="M7.35 11.6L9.75 13.75L7.35 15.9"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.15 15.9H13.35"
            stroke="#82AAFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
