/**
 * What the showcase demonstrates. Metadata only, so pages can list the
 * components without pulling every demo into their bundle.
 */

export interface DemoInfo {
  slug: string;
  /** Matches the component's entry point and its demo file. */
  name: string;
  group: string;
  summary: string;
}

function entry(name: string, group: string, summary: string): DemoInfo {
  const slug = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  return { slug, name, group, summary };
}

export const demos: DemoInfo[] = [
  entry("Container", "Layout", "Centres content in a column with a gutter."),
  entry("Stack", "Layout", "Evenly spaced columns and wrapping rows."),
  entry("Grid", "Layout", "Fits as many columns as there's room for."),
  entry("Section", "Layout", "A titled band of the page."),
  entry("Split", "Layout", "Media and text side by side."),
  entry("SidebarLayout", "Layout", "Sticky navigation beside content."),

  entry("Hero", "Page", "The opening of a page."),
  entry("PageHeader", "Page", "An app page's title, actions and way back."),
  entry("CtaBanner", "Page", "A closing call to action."),
  entry("Announcement", "Page", "A slim bar for news."),
  entry("Alert", "Page", "A notice set into the page."),
  entry("SiteHeader", "Page", "Brand, navigation and actions."),
  entry("SiteFooter", "Page", "Fine print and columns of links."),
  entry("Credit", "Page", "An easy attribution line."),

  entry("Card", "Content", "A bordered panel of short content."),
  entry("MediaCard", "Content", "A card led by an image."),
  entry("FeatureGrid", "Content", "Features divided by hairlines."),
  entry("Steps", "Content", "A numbered sequence."),
  entry("PairList", "Content", "Rows setting one thing against another."),
  entry("DetailList", "Content", "Labelled facts about one thing."),
  entry("PostList", "Content", "Linked entries, such as blog posts."),
  entry("Accordion", "Content", "Expanding sections, without JavaScript."),
  entry("Testimonial", "Content", "A quotation, and who said it."),
  entry("LogoCloud", "Content", "Client and partner logos."),
  entry("Prose", "Content", "Long-form content and rendered Markdown."),
  entry("Figure", "Content", "An image with a caption."),
  entry("Table", "Content", "Rows of data under headings."),
  entry("Terminal", "Content", "Shell commands in a window."),
  entry("CodeBlock", "Content", "Source code, with a copy button."),
  entry("Tabs", "Content", "Panels behind a row of tabs."),

  entry("Badge", "Indicators", "A short, prominent status."),
  entry("Tag", "Indicators", "Topics and features."),
  entry("StatusDot", "Indicators", "A coloured status with a message."),
  entry("Stat", "Indicators", "A figure, optionally against a total."),
  entry("Avatar", "Indicators", "A portrait, or initials."),
  entry("Eyebrow", "Indicators", "The label above a heading."),

  entry("Button", "Controls", "Buttons, and links styled as them."),
  entry("Chip", "Controls", "Compact toggles, for filters."),
  entry("SegmentedControl", "Controls", "One of a few options."),
  entry("Field", "Controls", "Labelled inputs, textareas and selects."),
  entry("RepeatingField", "Controls", "Rows of fields to add, remove and reorder."),
  entry("Switch", "Controls", "An on/off setting."),
  entry("ThemeToggle", "Controls", "Light, dark or the system's; and palettes."),

  entry("TableOfContents", "Navigation", "The page's sections, tracking the reader."),
  entry("Pager", "Navigation", "Previous and next pages."),
  entry("Drawer", "Navigation", "A panel sliding in from the side."),
  entry("Dialog", "Navigation", "A modal, and a confirmation."),

  entry("ParticleField", "Effects", "A drifting particle background."),
  entry("Pattern", "Effects", "Background textures that follow the theme."),
  entry("CursorEffects", "Effects", "Themed cursors, and an effect around the pointer."),
];

export const firstDemo = demos[0]!;

export const groups = [...new Set(demos.map((d) => d.group))].map((group) => ({
  group,
  demos: demos.filter((d) => d.group === group),
}));
