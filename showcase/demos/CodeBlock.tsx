import { CodeBlock } from "gui-mellow/CodeBlock";
import { Example } from "../lib/Example";

const config = `import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["gui-mellow"],
  experimental: { optimizePackageImports: ["gui-mellow"] },
};

export default config;`;

export default function CodeBlockDemo() {
  return (
    <>
      <Example title="With a title and language" description="The copy button is the only part that ships JavaScript.">
        <CodeBlock title="next.config.ts" language="ts" code={config} />
      </Example>
      <Example title="Bare" description="No title or copy button.">
        <CodeBlock code={`git log --oneline -3`} copy={false} />
      </Example>
      <Example
        title="Highlighted"
        description="Pass HTML from a build-time highlighter such as Shiki as html; code is still what's copied."
      >
        <CodeBlock
          language="scss"
          code={`:root { --gm-radius-md: 4px; }`}
          html={`<span style="color:var(--gm-color-accent)">:root</span> { <span style="color:var(--gm-color-link)">--gm-radius-md</span>: <span style="color:var(--gm-color-success)">4px</span>; }`}
        />
      </Example>
      <Example title="Wrapping long lines">
        <CodeBlock
          wrap
          code="curl -fsSL https://example.com/install.sh | sh -s -- --channel stable --prefix /usr/local --with-completions"
        />
      </Example>
    </>
  );
}
