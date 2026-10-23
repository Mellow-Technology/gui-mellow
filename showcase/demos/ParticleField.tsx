import { ParticleField } from "gui-mellow/ParticleField";
import { Example } from "../lib/Example";

export default function ParticleFieldDemo() {
  return (
    <>
      <Example
        title="Contained"
        description="fixed={false} fills the nearest positioned parent. The home page uses the default, behind the whole page."
        bleed
      >
        <div style={{ position: "relative", height: "320px" }}>
          <ParticleField fixed={false} />
        </div>
      </Example>
      <Example title="Your colours" bleed>
        <div style={{ position: "relative", height: "240px" }}>
          <ParticleField
            fixed={false}
            density={0.0003}
            colors={[
              [5, 104, 226],
              [255, 53, 82],
            ]}
          />
        </div>
      </Example>
    </>
  );
}
