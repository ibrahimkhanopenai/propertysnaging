import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { site, whatsappLink } from "@/lib/site";

/**
 * Call + WhatsApp on every page (client requirement).
 * Desktop: floating round buttons. Mobile: full-width bottom bar.
 */
export function FloatingContact({ dict }: { dict: Dictionary }) {
  return (
    <>
      <div className="fixed bottom-6 end-6 z-40 hidden flex-col gap-3 md:flex">
        <a href={whatsappLink(dict.quote.waIntro)} target="_blank" rel="noopener noreferrer" data-track="floating" aria-label={dict.nav.whatsapp} className="flex size-14 items-center justify-center rounded-full bg-wa text-white shadow-lg transition hover:bg-wa-dark">
          <Icon name="whatsapp" size={26} />
        </a>
        <a href={`tel:${site.phone}`} data-track="floating" aria-label={`${dict.nav.call} ${site.phoneDisplay}`} className="flex size-14 items-center justify-center rounded-full bg-ink text-white shadow-lg transition hover:bg-ink-soft">
          <Icon name="phone" size={24} />
        </a>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        <a href={`tel:${site.phone}`} data-track="mobile_bar" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-white">
          <Icon name="phone" size={18} />
          {dict.nav.call}
        </a>
        <a href={whatsappLink(dict.quote.waIntro)} target="_blank" rel="noopener noreferrer" data-track="mobile_bar" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-wa font-semibold text-white">
          <Icon name="whatsapp" size={18} />
          {dict.nav.whatsapp}
        </a>
      </div>
    </>
  );
}
