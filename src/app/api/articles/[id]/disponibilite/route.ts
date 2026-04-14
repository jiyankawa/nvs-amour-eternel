import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const blockedDates = await prisma.blockedDate.findMany({
      where: { articleId: id },
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json(blockedDates);
  } catch (error) {
    console.error("Disponibilite fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { startDate, endDate, reason } = body;

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Dates requises" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Format de date invalide" }, { status: 400 });
    }

    if (start > end) {
      return NextResponse.json({ error: "La date de début doit être avant la date de fin" }, { status: 400 });
    }

    const blockedDate = await prisma.blockedDate.create({
      data: {
        articleId: id,
        startDate: start,
        endDate: end,
        reason: reason?.slice(0, 500) || null,
      },
    });

    return NextResponse.json(blockedDate);
  } catch (error) {
    console.error("Disponibilite create error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const blockedDateId = searchParams.get("blockedDateId");
    if (!blockedDateId) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await prisma.blockedDate.delete({ where: { id: blockedDateId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Disponibilite delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
