import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const prestations = await prisma.prestation.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(prestations);
  } catch (error) {
    console.error("Prestations fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, photos, price, priceVisible, order, active } = body;

    if (!name || typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }
    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description requise" }, { status: 400 });
    }

    const prestation = await prisma.prestation.create({
      data: {
        name: name.slice(0, 200),
        slug: slugify(name),
        description: description.slice(0, 5000),
        photos: JSON.stringify(Array.isArray(photos) ? photos.slice(0, 20) : []),
        price: typeof price === "number" ? price : null,
        priceVisible: Boolean(priceVisible),
        order: typeof order === "number" ? order : 0,
        active: active !== false,
      },
    });

    return NextResponse.json(prestation);
  } catch (error) {
    console.error("Prestation create error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, description, photos, price, priceVisible, order, active } = body;

    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
    if (!name || typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }

    const prestation = await prisma.prestation.update({
      where: { id },
      data: {
        name: name.slice(0, 200),
        slug: slugify(name),
        description: (description || "").slice(0, 5000),
        photos: JSON.stringify(Array.isArray(photos) ? photos.slice(0, 20) : []),
        price: typeof price === "number" ? price : null,
        priceVisible: Boolean(priceVisible),
        order: typeof order === "number" ? order : 0,
        active: active !== false,
      },
    });

    return NextResponse.json(prestation);
  } catch (error) {
    console.error("Prestation update error:", error);
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
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    await prisma.prestation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Prestation delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
