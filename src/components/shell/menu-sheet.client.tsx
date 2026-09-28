"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import type { NavLink } from "./site-nav";

interface MenuSheetProps {
  /** Approved copy a11y.menu-button. */
  readonly label: string;
  /** Approved copy a11y.nav: the sheet is the nav below xl. */
  readonly navLabel: string;
  readonly links: readonly NavLink[];
  /** Server-rendered icons: `menu-2` closed, `x` open. */
  readonly openIcon: ReactNode;
  readonly closeIcon: ReactNode;
}

/**
 * The menu below xl (DESIGN.md → Menu sheet): an icon button that opens a
 * full-height glass sheet under the strip, with the nav links at
 * `heading-quest` size in 56 px rows. The sheet is a native popover, so it
 * opens, closes on Esc or an outside press, and returns focus to the button
 * without JavaScript. The script adds `aria-expanded`, the menu-2 / x swap,
 * moving focus in on open, and closing when a link is chosen.
 */
export function MenuSheet({
  label,
  navLabel,
  links,
  openIcon,
  closeIcon,
}: MenuSheetProps) {
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const sheetId = useId();

  useEffect(() => {
    const element = sheet.current;
    if (element === null) return;
    const onToggle = (event: ToggleEvent) => {
      const isOpen = event.newState === "open";
      setOpen(isOpen);
      if (isOpen) element.querySelector("a")?.focus();
    };
    element.addEventListener("toggle", onToggle);
    return () => {
      element.removeEventListener("toggle", onToggle);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={sheetId}
        popoverTarget={sheetId}
        className="inline-flex size-target items-center justify-center text-primary transition-colors duration-feedback hover:text-accent-ink xl:hidden"
      >
        {open ? closeIcon : openIcon}
      </button>
      <div
        ref={sheet}
        id={sheetId}
        popover="auto"
        className="menu-sheet z-menu py-lg page-x xl:hidden"
      >
        <nav aria-label={navLabel}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => {
                    sheet.current?.hidePopover();
                  }}
                  className="menu-row type-heading-quest text-primary transition-colors duration-feedback hover:text-accent-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
