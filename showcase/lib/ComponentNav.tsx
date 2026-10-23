import Link from "next/link";
import { sidebarLinkClass } from "gui-mellow/SidebarLayout";
import { groups } from "./catalog";
import styles from "./showcase.module.scss";

export function ComponentNav({ current }: { current?: string }) {
  return (
    <nav aria-label="Components">
      {groups.map(({ group, demos }) => (
        <div key={group} className={styles.navGroup}>
          <div className={styles.navGroupTitle}>{group}</div>
          <ul className={styles.navList}>
            {demos.map((demo) => (
              <li key={demo.slug}>
                <Link
                  href={`/components/${demo.slug}`}
                  className={sidebarLinkClass}
                  aria-current={demo.slug === current ? "page" : undefined}
                >
                  {demo.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
