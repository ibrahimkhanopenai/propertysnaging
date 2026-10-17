import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getSettings, waLink } from "@/lib/settings";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import { getNav, type NavItem } from "./nav";

/**
 * Dropdowns open below the header. Each nav <li> fills the full header height (see <nav> below), so the mouse
 * never leaves the item's hover area on its way down to the menu.
 * Hover intent (CSS only): a list closes 200 ms after the mouse leaves (a slightly diagonal path does not close it)
 * and a menu opens 100 ms after the mouse arrives (passing over the next item does not pop its menu over this one).
 * Keyboard focus opens at once. `visibility` is in the transition list so the close delay applies to it too.
 * - The full-width Services panel waits longer (500 ms): the way to its far columns can pass over other items
 *   (Arabic, slow mouse, farthest column needs ~450 ms).
 * - A small list (Locations) closes at once when the Services item is hovered, so it never covers the Services panel.
 *   Both use the same z-index, so a list opened after Services (later in the DOM) is on top of it.
 */
const dropdown =
  "invisible absolute top-full z-50 translate-y-1 rounded-2xl border border-line bg-white p-3 opacity-0 shadow-[0_18px_40px_rgba(10,10,10,0.08)] transition-[opacity,translate,visibility] duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:delay-0";
const listDropdown = `${dropdown} delay-200 group-has-[>li[data-mega]:hover]/nav:delay-0`;
const megaDropdown = `${dropdown} delay-500`;

export async function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cfg = await getSettings();
  const L = (p: string) => localePath(locale, p);
  const nav: NavItem[] = getNav(dict, locale).map((item) => ({
    ...item,
    href: L(item.href),
    children: item.children?.map((c) => ({ ...c, href: L(c.href) })),
    groups: item.groups?.map((g) => ({ ...g, items: g.items.map((c) => ({ ...c, href: L(c.href) })) })),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container className="flex items-center justify-between gap-4 py-3">
        <Logo href={L("/")} />

        {/* -my-3 + self-stretch: the nav (and every <li>) spans the header's full height, up to the top edge of the dropdowns */}
        <nav aria-label="Main" className="hidden self-stretch xl:-my-3 xl:flex">
          <ul className="group/nav flex items-stretch">
            {nav.map((item) => (
              <li key={item.label} data-mega={item.groups ? "" : undefined} className={`${item.groups ? "group static" : "group relative"} flex items-center`}>
                <Link href={item.href} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[15px] text-ink-soft hover:text-ink 2xl:px-2.5">
                  {item.label}
                  {item.children || item.groups ? <Icon name="chevron" size={14} /> : null}
                </Link>
                {item.children ? (
                  <ul className={`${listDropdown} start-0 min-w-60`}>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-mist">{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.groups ? (
                  <div className={`${megaDropdown} inset-x-4 mx-auto grid max-w-[1400px] lg:inset-x-10 grid-cols-4 gap-6 p-6`}>
                    {item.groups.map((g) => (
                      <div key={g.title}>
                        <p className="mb-2 px-3 text-[13px] font-semibold text-subtle">{g.title}</p>
                        <ul>
                          {g.items.map((c) => (
                            <li key={c.href}>
                              <Link href={c.href} className="block rounded-lg px-3 py-2 text-[15px] hover:bg-mist">{c.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link href={item.href} className="col-span-4 border-t border-line px-3 pt-4 text-[15px] font-semibold hover:underline">
                      {dict.nav.allServices}
                    </Link>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Hidden at xl, where the 9-item nav needs the room; the top bar always shows the number */}
          <a href={`tel:${cfg.phone}`} data-track="header" className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-semibold hover:bg-mist md:inline-flex xl:hidden 2xl:inline-flex" dir="ltr">
            <Icon name="phone" size={18} />
            {cfg.phoneDisplay}
          </a>
          <LanguageSwitch locale={locale} label={dict.nav.switchLanguage} ariaLabel={dict.nav.switchLanguageLabel} />
          <ButtonLink href={waLink(cfg, dict.quote.waIntro)} variant="whatsapp" icon="whatsapp" external className="whitespace-nowrap rounded-full max-lg:hidden">
            {dict.nav.whatsapp}
          </ButtonLink>
          <ButtonLink href={`${L("/")}#quote`} className="whitespace-nowrap rounded-full max-sm:hidden">{dict.nav.getQuote}</ButtonLink>
          <MobileMenu items={nav} openLabel={dict.nav.menu} closeLabel={dict.nav.close} quoteHref={`${L("/")}#quote`} quoteLabel={dict.nav.getQuote} />
        </div>
      </Container>
    </header>
  );
}
