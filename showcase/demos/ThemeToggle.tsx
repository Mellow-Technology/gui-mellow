import { PaletteToggle, ThemeToggle } from "gui-mellow/ThemeToggle";
import { palettes } from "../lib/palettes";
import { Example } from "../lib/Example";

export default function ThemeToggleDemo() {
  return (
    <>
      <Example title="Default" description="Pins light or dark, or follows the system. Shared with the header's toggle.">
        <ThemeToggle size="md" />
      </Example>
      <Example
        title="Palettes"
        description="PaletteToggle switches data-palette on the page. Load each palette's stylesheet, such as gui-mellow/styles/themes/solarpunk.scss."
      >
        <PaletteToggle palettes={palettes} size="md" />
      </Example>
      <Example title="Custom labels">
        <ThemeToggle labels={{ light: "☀", dark: "☾", system: "◐" }} />
      </Example>
    </>
  );
}
