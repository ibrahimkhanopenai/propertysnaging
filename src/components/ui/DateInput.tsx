"use client";

import type { InputHTMLAttributes, MouseEvent } from "react";
import { cn } from "@/lib/utils";

type PickerInput = Pick<HTMLInputElement, "disabled" | "readOnly"> & { showPicker?: () => void };

/** Opens the browser's own calendar. Unsupported browser or picker already open → the field keeps its native behaviour. */
export function openNativePicker(el: PickerInput): boolean {
  if (el.disabled || el.readOnly || typeof el.showPicker !== "function") return false;
  try {
    el.showPicker();
    return true;
  } catch {
    return false;
  }
}

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { type?: "date" | "datetime-local" | "time" };

/**
 * Native date / date-time input whose calendar opens on a click anywhere in the field,
 * not only on the small calendar icon. No date-picker library: it uses the browser's picker.
 */
export function DateInput({ type = "date", className, onClick, ...props }: Props) {
  return (
    <input
      {...props}
      type={type}
      className={cn("cursor-pointer", className)}
      onClick={(e: MouseEvent<HTMLInputElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) openNativePicker(e.currentTarget);
      }}
    />
  );
}
