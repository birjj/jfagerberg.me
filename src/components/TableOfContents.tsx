import type {
  ComponentChild,
  ComponentChildren,
  JSX,
  RefCallback,
} from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

export type ToCItem = { slug: string; text: string };
interface ToCProps {
  /** Usually a MarkdownHeadings list, but can also be hardcoded */
  items: ToCItem[];
  /** The height of any fixed headers (plus scroll margins on headers) in pixels, so we can track when the headers are scrolled past */
  scrollOffset?: number;
  /** If set, show a logo as the default link */
  logo?: ComponentChild;
}

const TableOfContents = ({ items, scrollOffset = 50, logo }: ToCProps) => {
  const [current, setCurrent] = useState<ToCItem | null>(null);

  // start observing intersections with header elements whenever items change
  useEffect(() => {
    const handleIntersections: IntersectionObserverCallback = () => {
      const scrollTop =
        (document.documentElement || document.body).scrollTop + scrollOffset;

      // if we only reacted to the intersection change, we wouldn't update when we scrolled upwards
      // instead, loop through each DOM nodes and compare their scroll offset to the document's scrollTop
      for (let i = items.length - 1; i >= 0; --i) {
        const { slug } = items[i];
        const $elm = document.getElementById(slug);
        if (!$elm) {
          continue;
        }
        const scrollPosition = $elm.offsetTop;
        if (scrollPosition < scrollTop) {
          setCurrent(items[i]);
          return;
        }
      }
      setCurrent(null);
    };

    const observer = new IntersectionObserver(handleIntersections, {
      root: null,
      // negative top margin to move the scroll observation point down, negative bottom margin to move the lower point up
      rootMargin: `-${scrollOffset}px 0% -66%`,
      threshold: [0, 0.1, 1],
    });
    document
      .querySelectorAll(`[id]:is(h1,h2,h3,h4)`)
      .forEach(($elm) => observer.observe($elm));
    return () => observer.disconnect();
  }, [items, setCurrent]);

  // handle clicks on links by immediately setting them as active
  const onLinkClick: JSX.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      const id = (e.currentTarget.getAttribute("href") || "").replace("#", "");
      const current = items.find((i) => i.slug === id);
      if (!current) {
        console.error(
          "Clicked ToC link without a ToC header. This should never happen.",
          id
        );
        return;
      }
      setCurrent(current);
      // manually scroll to the element, to avoid having the browser update the URL
      const $elm = document.getElementById(current.slug);
      if ($elm) {
        $elm.scrollIntoView({ behavior: "instant" });
        e.preventDefault();
      }
    },
    [items]
  );

  // keep track of when we have overflow, so we should show the mobile dropdown instead
  const [hasOverflow, setHasOverflow] = useState(false);
  const navResizeObserver = useRef<ResizeObserver>();
  const navRef = ($nav: HTMLElement | null) => {
    navResizeObserver.current?.disconnect();
    if (!$nav) {
      return;
    }

    const onResize: ResizeObserverCallback = (entries) => {
      const hasOverflow = $nav.scrollWidth > $nav.clientWidth;
      setHasOverflow(hasOverflow);
    };
    navResizeObserver.current = new ResizeObserver(onResize);
    navResizeObserver.current.observe($nav);
  };

  return (
    <>
      {logo ? (
        <a
          href="/"
          class={`icon inline-flex items-center relative mr-4 px-2 ${
            current === null ? "active" : ""
          }`}
          title="Navigate home"
        >
          {logo}
        </a>
      ) : null}
      <nav
        id="nav-container"
        class={`flex-shrink flex-grow flex-nowrap inline-flex items-stretch overflow-y-visible w-0 scrollbar-none whitespace-nowrap snap-x mr-4 ${
          hasOverflow ? "invisible" : ""
        }`}
        ref={navRef}
      >
        {items.map((i) => (
          <a
            href={`#${i.slug}`}
            class={`icon inline-flex items-center relative px-2 mr-2 snap-start ${
              current === i ? "active" : ""
            }`}
            onClick={onLinkClick}
            aria-label={`Navigate to ${i.text}`}
          >
            {i.text}
          </a>
        ))}
      </nav>
    </>
  );
};
export default TableOfContents;
