/**
 * A file in showcase/public, with the base path the site is served from.
 * next/link adds it to links by itself; plain <img> and CSS URLs need this.
 */
export function asset(path: `/${string}`) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
