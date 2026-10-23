import type { ComponentProps } from "react";

/** Who made the library, for credits and third-party notice pages. */
export const ATTRIBUTION = {
  name: "gui-mellow",
  url: "https://github.com/Mellow-Technology/gui-mellow",
  year: 2026,
  holder: "Code Incarnate Technologies, LLC",
  copyright: "Copyright (c) 2026 Code Incarnate Technologies, LLC",
  license: "MIT License",
} as const;

export interface CreditProps extends ComponentProps<"span"> {
  /** "short" names and links the library; "full" adds the copyright and licence. */
  variant?: "short" | "full";
}

/**
 * A credit line for a footer or about page: "Built with gui-mellow". It has
 * no styles of its own, so it takes on the text around it.
 */
export function Credit({ variant = "short", ...props }: CreditProps) {
  return (
    <span {...props}>
      Built with <a href={ATTRIBUTION.url}>{ATTRIBUTION.name}</a>
      {variant === "full" && (
        <>
          {" "}
          · © {ATTRIBUTION.year} {ATTRIBUTION.holder} · {ATTRIBUTION.license}
        </>
      )}
    </span>
  );
}
