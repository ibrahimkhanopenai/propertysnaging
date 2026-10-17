import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DateInput, openNativePicker } from "@/components/ui/DateInput";

const field = (over: Partial<{ disabled: boolean; readOnly: boolean; showPicker: () => void }> = {}) => ({ disabled: false, readOnly: false, showPicker: vi.fn(), ...over });

describe("DateInput: calendar opens on a click anywhere in the field", () => {
  it("opens the browser's picker", () => {
    const el = field();
    expect(openNativePicker(el)).toBe(true);
    expect(el.showPicker).toHaveBeenCalledOnce();
  });
  it("does nothing on a disabled or read-only field", () => {
    for (const el of [field({ disabled: true }), field({ readOnly: true })]) {
      expect(openNativePicker(el)).toBe(false);
      expect(el.showPicker).not.toHaveBeenCalled();
    }
  });
  it("keeps the native behaviour when the browser has no showPicker or refuses it", () => {
    expect(openNativePicker({ disabled: false, readOnly: false })).toBe(false);
    const refusing = field({ showPicker: () => { throw new DOMException("already open", "InvalidStateError"); } });
    expect(openNativePicker(refusing)).toBe(false);
  });
  it("renders a normal date input (works without JS, keeps name/value/class)", () => {
    const d = renderToStaticMarkup(<DateInput name="reviewDate" className="h-11" />);
    for (const attr of ['type="date"', 'name="reviewDate"', 'class="cursor-pointer h-11"']) expect(d).toContain(attr);
    const dt = renderToStaticMarkup(<DateInput type="datetime-local" name="publishedAt" defaultValue="2026-03-13T16:34" />);
    expect(dt).toContain('type="datetime-local"');
    expect(dt).toContain('value="2026-03-13T16:34"');
  });
});
