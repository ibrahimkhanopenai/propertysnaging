import { prisma } from "@/lib/db";
import { deleteLeadAction } from "../../actions";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Leads</h1>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              {["Date", "Source", "Name", "Phone", "Email", "Property", "Location", "Emirate", "Estimate", "Email sent", ""].map((h) => (
                <th key={h} className="p-3 text-start">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? <tr><td colSpan={11} className="p-6 text-muted">No leads yet.</td></tr> : null}
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-line align-top last:border-0">
                <td className="p-3 whitespace-nowrap text-muted">{l.createdAt.toLocaleString("en-GB")}</td>
                <td className="p-3 text-muted">{l.source ?? "-"}</td>
                <td className="p-3 font-semibold">{l.name}{l.message ? <p className="mt-1 max-w-xs font-normal text-muted">{l.message}</p> : null}</td>
                <td className="p-3 whitespace-nowrap"><a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" className="hover:underline">{l.phone}</a></td>
                <td className="p-3">{l.email ?? "-"}</td>
                <td className="p-3">{l.propertyType ?? "-"}{l.bedrooms !== null ? ` · ${l.bedrooms === 0 ? "Studio" : `${l.bedrooms} BR`}` : ""}{l.areaSqft ? ` · ${l.areaSqft} sqft` : ""}</td>
                <td className="p-3">{l.location ?? "-"}</td>
                <td className="p-3">{l.emirate ?? "-"}</td>
                <td className="p-3">{l.estimatedPrice ?? "-"}</td>
                <td className="p-3">{l.emailSent ? "Yes" : "No"}</td>
                <td className="p-3">
                  <form action={deleteLeadAction}><input type="hidden" name="id" value={l.id} /><button className="text-snag">Delete</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
