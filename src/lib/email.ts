import { Resend } from "resend";
import { escapeHtml } from "./utils";

export const resend = new Resend(process.env.RESEND_API_KEY);

interface DevisEmailData {
  name: string;
  email: string;
  phone?: string;
  weddingDate?: string;
  venue?: string;
  message?: string;
  prestations: string[];
  articles: { name: string; quantity: number; startDate?: string; endDate?: string }[];
}

export async function sendDevisEmail(data: DevisEmailData) {
  const e = escapeHtml;

  const prestationsList = data.prestations.length
    ? `<h3>Prestations souhaitées :</h3><ul>${data.prestations.map((p) => `<li>${e(p)}</li>`).join("")}</ul>`
    : "";

  const articlesList = data.articles.length
    ? `<h3>Articles en location :</h3><ul>${data.articles.map((a) => `<li>${e(a.name)} x${a.quantity}${a.startDate ? ` (du ${e(a.startDate)} au ${e(a.endDate || "")})` : ""}</li>`).join("")}</ul>`
    : "";

  await resend.emails.send({
    from: "NVS Amour Éternel <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL!,
    subject: `Nouvelle demande de devis - ${data.name.slice(0, 100)}`,
    html: `
      <h2>Nouvelle demande de devis</h2>
      <p><strong>Nom :</strong> ${e(data.name)}</p>
      <p><strong>Email :</strong> ${e(data.email)}</p>
      ${data.phone ? `<p><strong>Téléphone :</strong> ${e(data.phone)}</p>` : ""}
      ${data.weddingDate ? `<p><strong>Date du mariage :</strong> ${e(data.weddingDate)}</p>` : ""}
      ${data.venue ? `<p><strong>Lieu :</strong> ${e(data.venue)}</p>` : ""}
      ${prestationsList}
      ${articlesList}
      ${data.message ? `<h3>Message :</h3><p>${e(data.message)}</p>` : ""}
    `,
  });
}
