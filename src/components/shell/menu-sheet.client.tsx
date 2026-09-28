"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import type { NavLink } from "./site-nav";
import { useCurrentSection } from "./use-current-section";

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
 * moving focus in on open, closing when a link is chosen, the current
 * section's `aria-current` (scroll-spy), and a focus loop while the sheet
 * is open: Tab cycles through the button (its "x") and the links, so focus
 * never moves behind the sheet (QA F2). Esc still closes it and returns
 * focus to the button (native popover).
 */
export function MenuSheet({
  label,
  navLabel,
  links,
  openIcon,
  closeIcon,
}: MenuSheetProps) {
  const [open, setOpen] = useState(false);
  const current = useCurrentSection();
  const sheet = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
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

  // While open, focus loops through the button and the sheet's links: Tab
  // from the last link goes to the button, Shift+Tab from the button to
  // the last link. In between, the popover's own focus order (right after
  // its invoker) already holds.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const trigger = button.current;
      const links = sheet.current?.querySelectorAll("a");
      const first = links?.[0];
      const last = links?.[links.length - 1];
      if (trigger === null || first === undefined || last === undefined) {
        return;
      }
      const active = document.activeElement;
      const inside = active === trigger || sheet.current?.contains(active);
      let next: HTMLElement | undefined;
      if (!inside) next = event.shiftKey ? last : first;
      else if (event.shiftKey && active === trigger) next = last;
      else if (!event.shiftKey && active === last) next = trigger;
      if (next === undefined) return;
      event.preventDefault();
      next.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
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
                  aria-current={current === link.id ? "true" : undefined}
                  onClick={() => {
                    sheet.current?.hidePopover();
                  }}
                  className="nav-link menu-row type-heading-quest text-primary transition-colors duration-feedback hover:text-accent-ink"
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
