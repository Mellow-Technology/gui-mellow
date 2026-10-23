import type { Metadata } from "next";
import Link from "next/link";
import {
  Archivo,
  Chakra_Petch,
  Figtree,
  Fraunces,
  Fredoka,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Nunito,
  Space_Grotesk,
} from "next/font/google";
import { ATTRIBUTION } from "gui-mellow/Credit";
import { CursorEffects, CursorToggle } from "gui-mellow/CursorEffects";
import { SiteFooter } from "gui-mellow/SiteFooter";
import { SiteHeader } from "gui-mellow/SiteHeader";
import { PaletteToggle, ThemeScript, ThemeToggle } from "gui-mellow/ThemeToggle";
import { firstDemo } from "../lib/catalog";
import { palettes } from "../lib/palettes";
import styles from "../lib/showcase.module.scss";
import { GitHubLink } from "../lib/GitHubLink";
import { ThemeEditor, ThemeEditorButton } from "../lib/ThemeEditor";
import "gui-mellow/styles.scss";
import "gui-mellow/styles/themes/solarpunk.scss";
import "gui-mellow/styles/themes/magazine.scss";
import "gui-mellow/styles/themes/cyberpunk.scss";
import "gui-mellow/styles/themes/kawaii.scss";

const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600"] });
const body = IBM_Plex_Sans({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400"] });

// The other palettes' fonts, fetched only once one is in use
const solarDisplay = Fraunces({ variable: "--font-solar-display", subsets: ["latin"], preload: false });
const solarBody = Figtree({ variable: "--font-solar-body", subsets: ["latin"], preload: false });
const magazine = Archivo({ variable: "--font-magazine", subsets: ["latin"], preload: false });
const cyber = Chakra_Petch({
  variable: "--font-cyber",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  preload: false,
});
const kawaiiDisplay = Fredoka({ variable: "--font-kawaii-display", subsets: ["latin"], preload: false });
const kawaiiBody = Nunito({ variable: "--font-kawaii-body", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: { default: "GUI Mellow", template: "%s · gui-mellow" },
  description: "Shared React components for Next.js sites.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={[display, body, mono, solarDisplay, solarBody, magazine, cyber, kawaiiDisplay, kawaiiBody]
        .map((font) => font.variable)
        .join(" ")}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <CursorEffects />
        <SiteHeader
          brand={<Link href="/">GUI Mellow</Link>}
          items={[
            { href: "/", label: "Overview" },
            { href: "/components", label: "Components" },
            { href: "/tokens", label: "Tokens" },
            { href: "/theming", label: "Theming" },
          ]}
          actions={
            <>
              <PaletteToggle palettes={palettes} className={styles.desktopOnly} />
              <ThemeToggle labels={{ light: "☀", dark: "☾", system: "Auto" }} />
              <ThemeEditorButton className={styles.desktopOnly} />
              <GitHubLink className={styles.desktopOnly} />
            </>
          }
        />
        <main>{children}</main>
        <ThemeEditor />
        <SiteFooter
          brand="GUI Mellow"
          columns={[
            {
              heading: "Library",
              links: [
                { href: "/components", label: "Components" },
                { href: "/tokens", label: "Tokens" },
                { href: "/theming", label: "Theming" },
                { href: ATTRIBUTION.url, label: "GitHub" },
              ],
            },
            {
              heading: "Start",
              links: [{ href: `/components/${firstDemo.slug}`, label: firstDemo.name }],
            },
          ]}
        >
          <p>Created by the friendly folks @ <a href="https://community-cloud.technology" target="_blank">Community Cloud</a></p>
          <CursorToggle className={styles.footerToggle} />
        </SiteFooter>
      </body>
    </html>
  );
}
