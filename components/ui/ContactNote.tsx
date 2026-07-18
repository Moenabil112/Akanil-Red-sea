"use client";

import { useEffect, useRef } from "react";
import type { SiteContent } from "@/content/types";
import { OPEN_CONTACT_EVENT } from "./OpenContactLink";
import styles from "./ContactNote.module.css";

interface ContactNoteProps {
  modal: SiteContent["contact"]["modal"];
}

/**
 * Local, accessible contact note. Uses the native <dialog> element for
 * focus management and Escape handling. Nothing is transmitted or stored.
 */
export default function ContactNote({ modal }: ContactNoteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const open = () => dialogRef.current?.showModal();
    document.addEventListener(OPEN_CONTACT_EVENT, open);
    return () => document.removeEventListener(OPEN_CONTACT_EVENT, open);
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="contact-note-title"
      onClick={(event) => {
        // Click on the backdrop (the dialog element itself) closes the note.
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <h3 id="contact-note-title" className={styles.title}>
            {modal.title}
          </h3>
          <button
            type="button"
            className={styles.close}
            onClick={close}
            aria-label={modal.close}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <p className={styles.body}>{modal.body}</p>
        <p className={styles.privacy}>{modal.privacyNote}</p>
        <p className={styles.reference}>
          <span className={styles.referenceLabel}>{modal.referenceLabel}</span>
          <code className="latin-run">{modal.reference}</code>
        </p>
      </div>
    </dialog>
  );
}
