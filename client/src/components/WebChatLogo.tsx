/**
 * WebChatLogo
 *
 * Inline SVG logo component for WebChat.
 * Design: a clean, minimal rounded speech bubble with a subtle
 * "W" stroke mark inside — simple enough to read at 16 px,
 * polished enough for a navbar or product header.
 *
 * Uses `currentColor` so it inherits the surrounding text color in both
 * light and dark themes without any additional CSS.
 */
interface WebChatLogoProps {
  /** Width / height of the icon in pixels. Defaults to 24. */
  size?: number;
  /** Optional extra class names applied to the <svg> element. */
  className?: string;
}

export default function WebChatLogo({
  size = 24,
  className,
}: WebChatLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Speech bubble — subtle filled background */}
      <path
        fill="currentColor"
        fillOpacity={0.12}
        d="M6 4C4.895 4 4 4.895 4 6L4 20C4 21.105 4.895 22 6 22L13 22L15.5 25.5C15.776 25.875 16.224 25.875 16.5 25.5L19 22L26 22C27.105 22 28 21.105 28 20L28 6C28 4.895 27.105 4 26 4Z"
      />

      {/* Speech bubble — clean stroke outline */}
      <path
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        d="M6 4C4.895 4 4 4.895 4 6L4 20C4 21.105 4.895 22 6 22L13 22L15.5 25.5C15.776 25.875 16.224 25.875 16.5 25.5L19 22L26 22C27.105 22 28 21.105 28 20L28 6C28 4.895 27.105 4 26 4Z"
      />

      {/* "W" mark — simple stroke inside the bubble */}
      <polyline
        points="10,10 12.5,16 16,12 19.5,16 22,10"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
