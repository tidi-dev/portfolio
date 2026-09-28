import type { ReactNode } from "react";

interface ButtonLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  /** A file the link downloads or opens, such as the Résumé PDF. */
  readonly type?: string;
}

/**
 * button-primary as a link (DESIGN.md → Buttons): gold and chamfered; hover
 * accent-hover plus the light sweep. One gold primary per view.
 */
export function PrimaryButtonLink({ href, children, type }: ButtonLinkProps) {
  return (
    <a href={href} type={type} className="chamfer btn type-button btn-primary">
      <span aria-hidden="true" className="btn-sweep" />
      <span className="relative inline-flex items-center gap-xs">
        {children}
      </span>
    </a>
  );
}

/** button-ghost as a link: a text-muted edge, holo on hover. */
export function GhostButtonLink({ href, children, type }: ButtonLinkProps) {
  return (
    <a href={href} type={type} className="chamfer btn type-button btn-ghost">
      <span className="relative inline-flex items-center gap-xs">
        {children}
      </span>
    </a>
  );
}
