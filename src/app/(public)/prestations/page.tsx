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
    name: "Organisation Totale",
    description:
      "En nous confiant votre événement, vous vous assurez une gestion incomparable et vous garantir une expérience inoubliable maîtrisée de bout en bout grâce à notre savoir-faire.\n\n• Étude approfondie de votre projet\n• Création d'un cahier des charges\n• Élaboration et suivi de votre budget\n• Conseils, accompagnement, rendez-vous réguliers\n• Recherche et sélection de l'ensemble des prestataires\n• Proposition d'hébergement pour vos invités\n• Conception scénographie\n• Centralisation des animations surprises\n• Planning jour J de votre mariage",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
    price: 1800,
    priceVisible: true,
    priceLabel: "À partir de",
  },
  {
    name: "Coordination du Jour J",
    description:
      "Le jour de votre mariage, nous prenons en charge les aléas, la logistique des prestataires, l'accueil des invités et le bon déroulé de la journée.\n\nGrâce à cette prestation, vous pourrez savourer votre journée en toute sérénité, entouré de vos proches et surtout de votre moitié !\n\n• Rétroplanning\n• Établissement du planning du Jour J\n• Présence et coordination le Jour J\n• Synchronisation des prestataires et accueil des invités",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    name: "Décoration Sur Mesure",
    description:
      "Notre agence NVS Amour Éternel dispose d'une équipe wedding designer spécialisée en décoration sur mesure.\n\nPour créer une véritable identité visuelle à votre mariage, nous vous accompagnons pour définir à vos côtés le style, le thème, les matières, la couleur, les compositions florales et bien plus !\n\nGrâce à son savoir-faire, NVS Amour Éternel vous propose un service complet.",
    image:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80",
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
                <p className="text-gray leading-relaxed mb-6 whitespace-pre-line">
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
