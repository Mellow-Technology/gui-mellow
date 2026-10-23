import { Button } from "gui-mellow/Button";
import { SelectField, TextField } from "gui-mellow/Field";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";
import styles from "../lib/showcase.module.scss";

export default function FieldDemo() {
  return (
    <>
      <Example title="Contact form" description="Plain form controls: use them controlled or uncontrolled.">
        <form>
          <Stack gap={5} style={{ maxWidth: "28rem" }}>
            <TextField label="Name" name="name" required autoComplete="name" />
            <TextField label="Email" name="email" type="email" required hint="We'll only use it to reply." />
            <SelectField
              label="Location"
              name="location"
              options={[
                { value: "stl", label: "Saint Louis County" },
                { value: "stc", label: "Saint Charles" },
              ]}
            />
            <TextField label="Message" name="message" multiline placeholder="How can we help?" />
            <div>
              <Button type="submit">Send</Button>
            </div>
          </Stack>
        </form>
      </Example>
      <Example title="Error">
        <div style={{ maxWidth: "28rem" }}>
          <TextField label="Phone" name="phone" type="tel" defaultValue="555-01" error="That number looks too short." />
        </div>
      </Example>
      <Example
        title="Styling only the control"
        description="className styles the whole field; controlClassName only the input, textarea or select."
      >
        <div style={{ maxWidth: "28rem" }}>
          <TextField label="Commit" defaultValue="9f3c2ab" controlClassName={styles.mono} />
        </div>
      </Example>
    </>
  );
}
