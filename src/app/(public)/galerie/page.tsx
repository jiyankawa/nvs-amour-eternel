import Image from "next/image";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Découvrez nos réalisations de mariage en Île-de-France : décoration, mise en scène et ambiances créées par NVS Amour Éternel.",
};

const defaultPhotos = [
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", alt: "Cérémonie de mariage" },
  { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80", alt: "Décoration florale" },
  { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80", alt: "Couple marié" },
  { url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=80", alt: "Table de réception" },
  { url: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600&q=80", alt: "Bouquet de mariée" },
  { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80", alt: "Décoration de salle" },
  { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80", alt: "Alliances" },
  { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80", alt: "Préparatifs de la mariée" },
  { url: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=600&q=80", alt: "Lieu de réception" },
  { url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80", alt: "Arche florale" },
  { url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&q=80", alt: "Décoration dorée" },
  { url: "https://images.unsplash.com/photo-1470290378698-263fa7ca60ab?w=600&q=80", alt: "Lustres et lumières" },
];

export default async function GaleriePage() {
  const dbPhotos = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  const photos =
    dbPhotos.length > 0
      ? dbPhotos.map((p) => ({ url: p.url, alt: p.alt || "" }))
      : defaultPhotos;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1920&q=80"
          alt="Galerie photos mariage"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4">
            Galerie
          </h1>
          <p className="text-lg font-light max-w-2xl mx-auto">
            Nos plus belles réalisations
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="break-inside-avoid overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    width={600}
                    height={400 + (index % 3) * 100}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
