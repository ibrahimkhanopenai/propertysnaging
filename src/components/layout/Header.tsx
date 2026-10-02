import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import { getNav, type NavItem } from "./nav";

const dropdown =
  "invisible absolute top-full z-50 translate-y-1 rounded-2xl border border-line bg-white p-3 opacity-0 shadow-[0_18px_40px_rgba(10,10,10,0.08)] transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center">
            {nav.map((item) => (
              <li key={item.label} className={item.groups ? "group static" : "group relative"}>
                <Link href={item.href} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[15px] text-ink-soft hover:text-ink">
                  {item.label}
                  {item.children || item.groups ? <Icon name="chevron" size={14} /> : null}
                </Link>
                {item.children ? (
                  <ul className={`${dropdown} start-0 min-w-60`}>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-mist">{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.groups ? (
                  <div className={`${dropdown} inset-x-4 mx-auto grid max-w-[1400px] lg:inset-x-10 grid-cols-4 gap-6 p-6`}>
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
          <a href={`tel:${site.phone}`} data-track="header" className="hidden items-center gap-2 rounded-full px-3 py-2 text-[15px] font-semibold hover:bg-mist md:inline-flex" dir="ltr">
            <Icon name="phone" size={18} />
            {site.phoneDisplay}
          </a>
          <LanguageSwitch locale={locale} label={dict.nav.switchLanguage} ariaLabel={dict.nav.switchLanguageLabel} />
          <ButtonLink href={whatsappLink(dict.quote.waIntro)} variant="whatsapp" icon="whatsapp" external className="hidden rounded-full lg:inline-flex">
            {dict.nav.whatsapp}
          </ButtonLink>
          <ButtonLink href={`${L("/")}#quote`} className="hidden rounded-full sm:inline-flex">{dict.nav.getQuote}</ButtonLink>
          <MobileMenu items={nav} openLabel={dict.nav.menu} closeLabel={dict.nav.close} quoteHref={`${L("/")}#quote`} quoteLabel={dict.nav.getQuote} />
        </div>
      </Container>
    </header>
  );
}
