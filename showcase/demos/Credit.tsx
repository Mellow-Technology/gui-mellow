import { ATTRIBUTION, Credit } from "gui-mellow/Credit";
import { SiteFooter } from "gui-mellow/SiteFooter";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

export default function CreditDemo() {
  return (
    <>
      <Example title="Short and full" description="Unstyled, so it fits whatever text it sits in.">
        <Stack gap={3}>
          <Credit />
          <Credit variant="full" />
        </Stack>
      </Example>
      <Example title="In a footer" bleed>
        <SiteFooter brand="Your site">
          <p>© 2026 Your Company</p>
          <Credit />
        </SiteFooter>
      </Example>
      <Example
        title="For a notices page"
        description="ATTRIBUTION holds the details, for a credits or third-party licences page."
      >
        <pre style={{ fontFamily: "var(--gm-font-mono)", fontSize: "var(--gm-text-sm)", whiteSpace: "pre-wrap" }}>
          {`${ATTRIBUTION.name} — ${ATTRIBUTION.url}\n${ATTRIBUTION.copyright}\n${ATTRIBUTION.license}`}
        </pre>
      </Example>
    </>
  );
}
