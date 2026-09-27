"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

interface MenuLink {
  readonly href: string;
  readonly label: string;
}

interface MenuDisclosureProps {
  /** Approved copy a11y.menu-button. */
  readonly label: string;
  /** Approved copy a11y.nav: the panel is the nav below md. */
  readonly navLabel: string;
  readonly links: readonly MenuLink[];
  /** Server-rendered icons: `menu-2` closed, `x` open. */
  readonly openIcon: ReactNode;
  readonly closeIcon: ReactNode;
}

/**
 * The menu below md (DESIGN.md → Header): an `icon-button` with
 * `aria-expanded` and `aria-controls` that opens a panel in flow under the
 * header, with no overlay and no focus trap: rows 48 px tall, split by
 * `divider`. Escape closes it and returns focus to the button; choosing a
 * link closes it. A native <details> can do neither (contrib-engineering
 * §5.3). Without JavaScript the <noscript> style hides the button and shows
 * the panel, so the links stay reachable.
 */
export function MenuDisclosure({
  label,
  navLabel,
  links,
  openIcon,
  closeIcon,
}: MenuDisclosureProps) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        data-js-control=""
        onClick={() => {
          setOpen((current) => !current);
        }}
        className="inline-flex size-target items-center justify-center rounded-base text-primary transition-feedback hover:text-accent md:hidden"
      >
        {open ? closeIcon : openIcon}
      </button>
      <nav
        id={panelId}
        aria-label={navLabel}
        data-menu-panel=""
        data-open={open ? "" : undefined}
        className="hidden basis-full border-t border-rule data-open:block md:hidden!"
      >
        <ul className="divide-y divide-rule">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => {
                  setOpen(false);
                }}
                className="flex min-h-2xl items-center type-label text-primary transition-feedback hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
