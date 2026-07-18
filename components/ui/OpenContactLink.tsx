"use client";

import type { ReactNode } from "react";

export const OPEN_CONTACT_EVENT = "akanil:open-contact-note";

interface OpenContactLinkProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

/**
 * Opens the local contact note dialog. Without JavaScript the link degrades
 * to a plain anchor jump to the contact section.
 */
export default function OpenContactLink({
  children,
  className,
  title,
}: OpenContactLinkProps) {
  return (
    <a
      href="#contact"
      className={className}
      title={title}
      onClick={(event) => {
        event.preventDefault();
        document.dispatchEvent(new CustomEvent(OPEN_CONTACT_EVENT));
      }}
    >
      {children}
    </a>
  );
}
