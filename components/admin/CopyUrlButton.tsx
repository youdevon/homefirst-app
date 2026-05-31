"use client";

type CopyUrlButtonProps = {
  url: string;
  label?: string;
};

export default function CopyUrlButton({
  url,
  label = "Copy URL",
}: CopyUrlButtonProps) {
  return (
    <button
      type="button"
      className="admin-link-btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          // Fallback for older browsers
          const input = document.createElement("input");
          input.value = url;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
        }
      }}
      aria-label={`Copy URL ${url}`}
    >
      {label}
    </button>
  );
}
