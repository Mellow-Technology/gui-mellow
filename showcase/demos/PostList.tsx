import { PostList } from "gui-mellow/PostList";
import { Example } from "../lib/Example";

export default function PostListDemo() {
  return (
    <Example title="Blog posts" bleed>
      <PostList
        items={[
          {
            href: "#one",
            meta: "Oct 2, 2026",
            title: "Why we run our own servers",
            description: "The numbers behind leaving the big clouds, two years on.",
          },
          {
            href: "#two",
            meta: "Aug 14, 2026",
            title: "Static sites are underrated",
            description: "Fast, cheap, and nothing to patch at 3am.",
          },
          { href: "#three", meta: "Jun 1, 2026", title: "Notes on a component library" },
        ]}
      />
    </Example>
  );
}
