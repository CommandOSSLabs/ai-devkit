import { useId } from "react";

export function AiDevkitLogoIcon({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const gradId = `cmk-logo-grad-${uid}`;
  const glowId = `cmk-logo-glow-${uid}`;

  const boxDims =
    size === "sm" ? "h-7 w-7 rounded-[9px]" : "h-8 w-8 rounded-[10px]";
  const svgDims = size === "sm" ? "h-[16px] w-[16px]" : "h-[18px] w-[18px]";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center bg-[#14161d] shadow-[inset_0_0_0_1px_rgba(130,170,255,0.32),0_4px_14px_rgba(67,125,245,0.22)] ${boxDims} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={svgDims}
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="50%" stopColor="#82AAFF" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient
            id={glowId}
            x1="4"
            y1="7.5"
            x2="16.5"
            y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#161B29" />
            <stop offset="100%" stopColor="#0B0D13" />
          </linearGradient>
        </defs>
        {/* Back stacked skill layer */}
        <path
          d="M7.25 4.5H16.5C18.0188 4.5 19.25 5.73122 19.25 7.25V15.75"
          stroke={`url(#${gradId})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.62"
        />
        {/* Front modular skill tile */}
        <rect
          x="3.75"
          y="7.25"
          width="13"
          height="13"
          rx="3.6"
          stroke={`url(#${gradId})`}
          strokeWidth="1.85"
          fill={`url(#${glowId})`}
        />
        {/* Terminal prompt `>_` inside the skill tile */}
        <path
          d="M7.35 11.6L9.75 13.75L7.35 15.9"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.15 15.9H13.35"
          stroke="#82AAFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
