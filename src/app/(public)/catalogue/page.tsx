import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue Location",
  description:
    "Découvrez notre catalogue de matériel de décoration de mariage en location : arches, centres de table, chandeliers, vases et plus.",
};

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  const where: Record<string, unknown> = { active: true };
  if (params.categorie) {
    where.category = { slug: params.categorie };
  }
  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { description: { contains: params.q } },
    ];
  }

  const articles = await prisma.article.findMany({
    where,
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80"
          alt="Catalogue location mariage"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4">
            Catalogue Location
          </h1>
          <p className="text-lg font-light max-w-2xl mx-auto">
            Matériel de décoration pour sublimer votre mariage
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link
              href="/catalogue"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                !params.categorie
                  ? "bg-gold text-white"
                  : "bg-white text-dark hover:bg-gold hover:text-white"
              }`}
            >
              Tous
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogue?categorie=${cat.slug}`}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  params.categorie === cat.slug
                    ? "bg-gold text-white"
                    : "bg-white text-dark hover:bg-gold hover:text-white"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Articles Grid */}
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray text-lg mb-4">
                Aucun article trouvé pour le moment.
              </p>
              <p className="text-gray">
                Notre catalogue est en cours de préparation. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => {
                const photos = (() => { try { return JSON.parse(article.photos) as string[]; } catch { return []; } })();
                const photo =
                  photos[0] ||
                  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80";

                return (
                  <Link
                    key={article.id}
                    href={`/catalogue/${article.slug}`}
                    className="group bg-white hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={photo}
                        alt={article.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-gold uppercase tracking-wider mb-1">
                        {article.category.name}
                      </p>
                      <h3 className="font-[family-name:var(--font-heading)] text-lg text-dark mb-2">
                        {article.name}
                      </h3>
                      {article.priceVisible && article.price ? (
                        <p className="text-gold font-semibold">
                          {formatPrice(article.price)}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic text-sm">
                          Prix sur demande
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
