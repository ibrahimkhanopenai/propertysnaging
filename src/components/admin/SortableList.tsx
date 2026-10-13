"use client";

import { useRef, useState, useTransition } from "react";

type Item = { id: number; label: string; node: React.ReactNode };

/**
 * Drag-to-reorder list for the admin (no library). Drag a row by its handle (mouse or touch), or focus
 * the handle and use ↑/↓. The new order is saved at once through `onReorder(ids)` (a server action).
 * Rows keep their React state while moving (keyed by id), so unsaved edits in other rows survive.
 */
export function SortableList({ items, onReorder }: { items: Item[]; onReorder: (ids: number[]) => Promise<{ ok: boolean }> }) {
  const ids = items.map((i) => i.id);
  const [order, setOrder] = useState(ids);
  // Follow the server list when it changes (row added/deleted, or the saved order came back)
  const [prevIds, setPrevIds] = useState(ids);
  if (ids.join() !== prevIds.join()) {
    setPrevIds(ids);
    setOrder(ids);
  }
  const [activeId, setActiveId] = useState<number | null>(null);
  const [status, setStatus] = useState<"" | "saved" | "error">("");
  const [pending, startTransition] = useTransition();
  const rowRefs = useRef(new Map<number, HTMLLIElement>());
  const byId = new Map(items.map((i) => [i.id, i]));

  function commit(next: number[], before: number[]) {
    if (next.join() === before.join()) return;
    setStatus("");
    startTransition(async () => {
      const res = await onReorder(next).catch(() => ({ ok: false }));
      if (res.ok) setStatus("saved");
      else {
        setOrder(before);
        setStatus("error");
      }
    });
  }

  // Move/up are tracked on window: React moves the dragged row in the DOM, which drops pointer capture
  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>, id: number) {
    if (e.button !== 0) return;
    e.preventDefault();
    const before = order;
    let current = order;
    setActiveId(id);
    const move = (ev: PointerEvent) => {
      const y = ev.clientY;
      // Scroll the page when dragging near the top/bottom edge (long area lists)
      if (y < 80) window.scrollBy(0, -12);
      else if (y > window.innerHeight - 80) window.scrollBy(0, 12);
      const others = current.filter((x) => x !== id);
      let at = others.length;
      for (let i = 0; i < others.length; i++) {
        const r = rowRefs.current.get(others[i])?.getBoundingClientRect();
        if (r && y < r.top + r.height / 2) {
          at = i;
          break;
        }
      }
      const next = [...others.slice(0, at), id, ...others.slice(at)];
      if (next.join() !== current.join()) {
        current = next;
        setOrder(next);
      }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      setActiveId(null);
      commit(current, before);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, id: number) {
    const from = order.indexOf(id);
    const to = e.key === "ArrowUp" ? from - 1 : e.key === "ArrowDown" ? from + 1 : -1;
    if (to < 0 || to >= order.length) return;
    e.preventDefault();
    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, id);
    setOrder(next);
    commit(next, order);
    // keep focus on the moved handle
    requestAnimationFrame(() => rowRefs.current.get(id)?.querySelector<HTMLButtonElement>("[data-handle]")?.focus());
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="h-4 text-xs text-subtle" aria-live="polite">
        {pending ? "Saving order…" : status === "saved" ? "Order saved — live on the site." : status === "error" ? <span className="text-snag">Could not save the order. Try again.</span> : order.length > 1 ? "Drag ⠿ to change the order (or focus it and use ↑ ↓)." : ""}
      </p>
      <ul className="flex flex-col gap-2">
        {order.map((id) => {
          const item = byId.get(id);
          if (!item) return null;
          const active = activeId === id;
          return (
            <li
              key={id}
              ref={(el) => {
                if (el) rowRefs.current.set(id, el);
                else rowRefs.current.delete(id);
              }}
              className={`flex items-stretch gap-2 rounded-xl transition-shadow ${active ? "relative z-10 shadow-[0_12px_30px_rgba(10,10,10,0.18)] ring-2 ring-ink" : ""}`}
            >
              <button
                type="button"
                data-handle
                aria-label={`Move ${item.label} (drag, or use the arrow keys)`}
                onPointerDown={(e) => onPointerDown(e, id)}
                onKeyDown={(e) => onKeyDown(e, id)}
                className={`flex w-8 shrink-0 touch-none select-none items-center justify-center rounded-lg border border-line bg-mist text-lg leading-none text-muted hover:border-ink hover:text-ink ${active ? "cursor-grabbing" : "cursor-grab"}`}
              >
                ⠿
              </button>
              <div className="min-w-0 flex-1">{item.node}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
