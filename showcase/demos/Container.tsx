import { Container } from "gui-mellow/Container";
import { Example } from "../lib/Example";

const box = { padding: "1rem", background: "var(--gm-color-surface-sunken)", borderRadius: "var(--gm-radius-sm)" };

export default function ContainerDemo() {
  return (
    <>
      <Example title="Wide" description="For grids and page furniture: up to --gm-container." bleed>
        <Container>
          <div style={box}>Wide container</div>
        </Container>
      </Example>
      <Example title="Narrow" description="For running text: up to --gm-container-narrow." bleed>
        <Container size="narrow">
          <div style={box}>Narrow container</div>
        </Container>
      </Example>
    </>
  );
}
