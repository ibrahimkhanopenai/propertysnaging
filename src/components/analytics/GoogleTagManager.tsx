/**
 * Google Tag Manager — Google's official install snippet, server-rendered so it is in the HTML:
 * <GtmHead> goes in <head>, <GtmNoScript> right after <body>. The container ID comes from
 * NEXT_PUBLIC_GTM_ID; anything that isn't a valid "GTM-XXXX" ID renders nothing (no script injection).
 * gtm.js loads async, so it does not block rendering.
 */
const valid = (id?: string): id is string => Boolean(id && /^GTM-[A-Z0-9]+$/.test(id));

export function GtmHead({ id }: { id?: string }) {
  if (!valid(id)) return null;
  return (
    // Plain <script> on purpose: next/script injects after hydration, GTM must be in the HTML <head>
    // eslint-disable-next-line @next/next/next-script-for-ga
    <script
      id="gtm-head"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`,
      }}
    />
  );
}

export function GtmNoScript({ id }: { id?: string }) {
  if (!valid(id)) return null;
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${id}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
    </noscript>
  );
}
