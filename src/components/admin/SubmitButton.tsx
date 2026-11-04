"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * Submit button for admin server-action forms (e.g. Admin → Locations rows).
 * While the action runs it shows `pendingLabel` and disables itself; when it finishes it briefly
 * flashes `savedLabel`, so a save that doesn't visibly change the row still confirms it worked.
 * Must be rendered inside the <form> it submits (useFormStatus reads that form's state).
 */
export function SubmitButton({
  children,
  className,
  pendingLabel = "Saving…",
  savedLabel = "Saved ✓",
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
  savedLabel?: string;
}) {
  const { pending } = useFormStatus();
  const [saved, setSaved] = useState(false);
  const wasPending = useRef(false);

  // When the submission finishes (pending went true → false), flash the saved label.
  useEffect(() => {
    if (wasPending.current && !pending) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [pending]);
  useEffect(() => {
    wasPending.current = pending;
  });

  return (
    <button disabled={pending} aria-live="polite" className={className}>
      {pending ? pendingLabel : saved ? savedLabel : children}
    </button>
  );
}
