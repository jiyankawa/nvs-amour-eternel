import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Articles fetch error:", error);
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
    const { name, description, photos, categoryId, price, priceVisible, stock, active } = body;

    if (!name || typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }
    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description requise" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Catégorie requise" }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        name: name.slice(0, 200),
        slug: slugify(name),
        description: description.slice(0, 5000),
        photos: JSON.stringify(Array.isArray(photos) ? photos.slice(0, 20) : []),
        categoryId,
        price: typeof price === "number" ? price : null,
        priceVisible: Boolean(priceVisible),
        stock: Math.min(Math.max(0, Number(stock) || 1), 9999),
        active: active !== false,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Article create error:", error);
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
    const { id, name, description, photos, categoryId, price, priceVisible, stock, active } = body;

    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
    if (!name || typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        name: name.slice(0, 200),
        slug: slugify(name),
        description: (description || "").slice(0, 5000),
        photos: JSON.stringify(Array.isArray(photos) ? photos.slice(0, 20) : []),
        categoryId,
        price: typeof price === "number" ? price : null,
        priceVisible: Boolean(priceVisible),
        stock: Math.min(Math.max(0, Number(stock) || 1), 9999),
        active: active !== false,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Article update error:", error);
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

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Article delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
