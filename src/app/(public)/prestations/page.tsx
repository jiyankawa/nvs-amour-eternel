import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Prestations",
  description:
    "Découvrez nos prestations de mariage : organisation, décoration, coordination du jour J et location de matériel en Île-de-France.",
};

const defaultPrestations = [
  {
    name: "Recherche Prestataires",
    description:
      "Nous recherchons et sélectionnons pour vous les meilleurs prestataires : traiteur, photographe, DJ, fleuriste... Nous négocions les tarifs et coordonnons les rendez-vous pour vous faire gagner du temps et de la sérénité.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
  },
  {
    name: "Organisation",
    description:
      "De la définition de votre budget à la gestion du rétroplanning, nous prenons en charge l'intégralité de l'organisation de votre mariage. Planning, logistique, gestion des invités — nous pensons à tout.",
    image:
      "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=800&q=80",
  },
  {
    name: "Décoration du Lieu",
    description:
      "Nous concevons et réalisons la décoration de votre lieu de réception et de cérémonie. Un univers unique, créé sur-mesure selon vos envies : centres de table, arches florales, mise en lumière, scénographie complète.",
    image:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80",
  },
  {
    name: "Coordination du Jour J",
    description:
      "Le jour de votre mariage, nous sommes sur place pour coordonner tous les prestataires, gérer les imprévus et veiller au bon déroulement de chaque instant. Vous n'avez qu'à profiter.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    name: "Location de Matériel",
    description:
      "Découvrez notre catalogue de matériel de décoration en location : arches, centres de table, chandeliers, vases, luminaires, nappes et bien plus. Tout ce qu'il faut pour sublimer votre événement.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  },
];

export default async function PrestationsPage() {
  const dbPrestations = await prisma.prestation.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  const prestations =
    dbPrestations.length > 0
      ? dbPrestations.map((p) => ({
          name: p.name,
          description: p.description,
          image: (() => { try { return JSON.parse(p.photos)[0]; } catch { return null; } })() || defaultPrestations[0].image,
          price: p.price,
          priceVisible: p.priceVisible,
        }))
      : defaultPrestations;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80"
          alt="Prestations mariage"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4">
            Nos Prestations
          </h1>
          <p className="text-lg font-light max-w-2xl mx-auto">
            Un accompagnement sur-mesure pour chaque étape de votre mariage
          </p>
        </div>
      </section>

      {/* Prestations */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          {prestations.map((presta, index) => (
            <div
              key={presta.name}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div
                className={`relative h-[350px] lg:h-[450px] ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={presta.image}
                  alt={presta.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl text-dark mb-6">
                  {presta.name}
                </h2>
                <p className="text-gray leading-relaxed mb-6">
                  {presta.description}
                </p>
                {"price" in presta &&
                  presta.price &&
                  presta.priceVisible && (
                    <p className="text-gold font-[family-name:var(--font-heading)] text-2xl mb-6">
                      À partir de {formatPrice(presta.price)}
                    </p>
                  )}
                {"price" in presta &&
                  presta.price &&
                  !presta.priceVisible && (
                    <p className="text-gold-dark italic mb-6">
                      Prix sur demande
                    </p>
                  )}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-rose">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark mb-4">
            Envie d&apos;en savoir plus ?
          </h2>
          <p className="text-gray mb-8">
            Chaque mariage est unique. Contactez-nous pour discuter de votre
            projet et recevoir un devis personnalisé.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-10 py-4 text-sm font-medium tracking-widest uppercase transition-colors"
          >
            Nous contacter
            <Heart size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
