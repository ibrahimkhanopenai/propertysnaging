/**
 * Microsoft Clarity (heatmaps + session recordings) — Microsoft's official snippet, server-rendered
 * in <head> like GTM. Project ID from NEXT_PUBLIC_CLARITY_ID (same project as the WordPress site);
 * anything that isn't a plain alphanumeric ID renders nothing. Don't also fire Clarity from GTM.
 */
const valid = (id?: string): id is string => Boolean(id && /^[a-z0-9]{6,20}$/i.test(id));

export function ClarityHead({ id }: { id?: string }) {
  if (!valid(id)) return null;
  return (
    <script
      id="clarity"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`,
      }}
    />
  );
}
