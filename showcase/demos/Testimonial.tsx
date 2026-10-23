import { Avatar } from "gui-mellow/Avatar";
import { Grid } from "gui-mellow/Grid";
import { Testimonial } from "gui-mellow/Testimonial";
import { Example } from "../lib/Example";

export default function TestimonialDemo() {
  return (
    <Example title="Reviews">
      <Grid min="260px" gap={7}>
        <Testimonial
          quote="We moved our whole library catalogue in a weekend."
          author="Dana Whitfield"
          authorTitle="Head librarian"
          avatar={<Avatar name="Dana Whitfield" size={40} />}
        />
        <Testimonial quote="Seen same day, and they were lovely." author="Sam R." rating={5} />
      </Grid>
    </Example>
  );
}
