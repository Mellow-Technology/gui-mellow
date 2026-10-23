import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Disclosure } from "gui-mellow/Accordion";
import { Eyebrow } from "gui-mellow/Eyebrow";
import { Pager } from "gui-mellow/Pager";
import { SidebarLayout } from "gui-mellow/SidebarLayout";
import { ComponentNav } from "../../../lib/ComponentNav";
import { demos } from "../../../lib/catalog";
import { loaders } from "../../../lib/registry";
import styles from "../../../lib/showcase.module.scss";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return demos.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const demo = demos.find((d) => d.slug === slug);
  return { title: demo?.name, description: demo?.summary };
}

/**
 * The demo's own source, shown beneath it. The build may run from the repo
 * root or from the showcase directory.
 */
async function readDemoSource(name: string) {
  for (const base of ["demos", "showcase/demos"]) {
    try {
      return await readFile(path.join(process.cwd(), base, `${name}.tsx`), "utf8");
    } catch {}
  }
  return null;
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const index = demos.findIndex((d) => d.slug === slug);
  const demo = demos[index];
  if (!demo) notFound();

  const [{ default: Demo }, source] = await Promise.all([loaders[demo.name]!(), readDemoSource(demo.name)]);
  const previous = demos[index - 1];
  const next = demos[index + 1];

  return (
    <SidebarLayout sidebar={<ComponentNav current={slug} />} sidebarTitle="Components">
      <header className={styles.pageHeader}>
        <Eyebrow tone="accent">{demo.group}</Eyebrow>
        <h1>{demo.name}</h1>
        <p className={styles.summary}>{demo.summary}</p>
        <code className={styles.importLine}>
          import {"{"} {demo.name} {"}"} from &quot;gui-mellow/{demo.name}&quot;;
        </code>
      </header>

      <Demo />

      {source && (
        <Disclosure className={styles.source} title="Source of these examples">
          <pre>
            <code>{source}</code>
          </pre>
        </Disclosure>
      )}

      <Pager
        className={styles.pager}
        previous={previous && { href: `/components/${previous.slug}`, title: previous.name }}
        next={next && { href: `/components/${next.slug}`, title: next.name }}
      />
    </SidebarLayout>
  );
}
