import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, Calendar } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!article) return { title: "Article non trouvé" };
  return {
    title: article.name,
    description: article.description.slice(0, 160),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      blockedDates: {
        where: { endDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
      },
    },
  });

  if (!article) notFound();

  const photos = (() => { try { return JSON.parse(article.photos) as string[]; } catch { return []; } })();
  const mainPhoto =
    photos[0] ||
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-gray hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Photos */}
          <div>
            <div className="relative h-[400px] lg:h-[500px] mb-4">
              <Image
                src={mainPhoto}
                alt={article.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.slice(1, 5).map((photo, i) => (
                  <div key={i} className="relative h-24">
                    <Image
                      src={photo}
                      alt={`${article.name} ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-xs text-gold uppercase tracking-wider mb-2">
              {article.category.name}
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark mb-6">
              {article.name}
            </h1>

            {article.priceVisible && article.price ? (
              <p className="font-[family-name:var(--font-heading)] text-2xl text-gold mb-6">
                {formatPrice(article.price)}{" "}
                <span className="text-sm text-gray font-body">/ location</span>
              </p>
            ) : (
              <p className="text-gold-dark italic mb-6 text-lg">
                Prix sur demande
              </p>
            )}

            <div className="prose prose-gray mb-8">
              <p className="text-gray leading-relaxed whitespace-pre-line">
                {article.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray mb-6">
              <Package size={16} />
              <span>
                Stock disponible : {article.stock} unité
                {article.stock > 1 ? "s" : ""}
              </span>
            </div>

            {/* Blocked dates */}
            {article.blockedDates.length > 0 && (
              <div className="bg-rose p-6 mb-8">
                <h3 className="font-[family-name:var(--font-heading)] text-lg mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-gold" />
                  Dates indisponibles
                </h3>
                <ul className="space-y-1">
                  {article.blockedDates.map((bd) => (
                    <li key={bd.id} className="text-sm text-gray">
                      Du {formatDate(bd.startDate)} au{" "}
                      {formatDate(bd.endDate)}
                      {bd.reason && (
                        <span className="text-gray-400"> — {bd.reason}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href={`/contact?article=${article.slug}`}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium tracking-wide uppercase transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
