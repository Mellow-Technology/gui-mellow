import { Announcement } from "gui-mellow/Announcement";
import { Example } from "../lib/Example";

export default function AnnouncementDemo() {
  return (
    <>
      <Example title="Linked" bleed>
        <Announcement label="New" href="#">
          Version 2 is out, with storage replication.
        </Announcement>
      </Example>
      <Example title="Plain" bleed>
        <Announcement>Office closed Monday for the holiday.</Announcement>
      </Example>
    </>
  );
}
