import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendDevisEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 demandes par IP par 15 minutes
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });
    if (!success) {
      return NextResponse.json(
        { error: "Trop de demandes. Veuillez réessayer dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, weddingDate, venue, message, prestationIds, articles, captchaToken } = body;

    // Vérification Turnstile CAPTCHA
    if (process.env.TURNSTILE_SECRET_KEY && process.env.TURNSTILE_SECRET_KEY !== "1x0000000000000000000000000000000AA") {
      if (!captchaToken) {
        return NextResponse.json({ error: "Vérification CAPTCHA requise" }, { status: 400 });
      }
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captchaToken,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json({ error: "Vérification CAPTCHA échouée" }, { status: 400 });
      }
    }

    if (!name || typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (phone && (typeof phone !== "string" || phone.length > 30)) {
      return NextResponse.json({ error: "Téléphone invalide" }, { status: 400 });
    }
    if (message && (typeof message !== "string" || message.length > 5000)) {
      return NextResponse.json({ error: "Message trop long" }, { status: 400 });
    }

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: name.slice(0, 200),
        email: email.slice(0, 320),
        phone: phone?.slice(0, 30) || null,
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        venue: venue?.slice(0, 500) || null,
        message: message?.slice(0, 5000) || null,
        prestations: {
          create: (Array.isArray(prestationIds) ? prestationIds : [])
            .slice(0, 10)
            .map((id: string) => ({ prestationId: id })),
        },
        articles: {
          create: (Array.isArray(articles) ? articles : [])
            .slice(0, 50)
            .map((a: { articleId: string; quantity: number; startDate?: string; endDate?: string }) => ({
              articleId: a.articleId,
              quantity: Math.min(Math.max(1, Number(a.quantity) || 1), 100),
              startDate: a.startDate ? new Date(a.startDate) : null,
              endDate: a.endDate ? new Date(a.endDate) : null,
            })),
        },
      },
      include: {
        prestations: { include: { prestation: true } },
        articles: { include: { article: true } },
      },
    });

    try {
      await sendDevisEmail({
        name,
        email,
        phone,
        weddingDate,
        venue,
        message,
        prestations: contactRequest.prestations.map((p) => p.prestation.name),
        articles: contactRequest.articles.map((a) => ({
          name: a.article.name,
          quantity: a.quantity,
          startDate: a.startDate?.toLocaleDateString("fr-FR"),
          endDate: a.endDate?.toLocaleDateString("fr-FR"),
        })),
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json({ success: true, id: contactRequest.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
