import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Star, Calendar, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: Star,
    title: "Recherche Prestataires",
    description:
      "Nous sélectionnons pour vous les meilleurs prestataires adaptés à vos envies et votre budget.",
  },
  {
    icon: Calendar,
    title: "Organisation",
    description:
      "De la planification au jour J, nous gérons chaque détail pour que vous profitiez pleinement.",
  },
  {
    icon: Sparkles,
    title: "Décoration",
    description:
      "Création d'univers uniques pour votre lieu de réception et votre cérémonie.",
  },
  {
    icon: Heart,
    title: "Coordination Jour J",
    description:
      "Le jour de votre mariage, nous coordonnons tout pour que chaque instant soit parfait.",
  },
];

export default async function HomePage() {
  const prestations = await prisma.prestation.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 4,
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
          alt="Mariage élégant"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
            NVS Amour Éternel
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 animate-fade-in-up-delay font-light">
            Créons ensemble le mariage de vos rêves en Île-de-France
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay">
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium tracking-widest uppercase transition-colors"
            >
              Demander un devis
            </Link>
            <Link
              href="/prestations"
              className="border border-white hover:bg-white hover:text-dark text-white px-8 py-3 text-sm font-medium tracking-widest uppercase transition-colors"
            >
              Nos prestations
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark mb-6">
                Votre mariage, <span className="text-gold">notre passion</span>
              </h2>
              <p className="text-gray leading-relaxed mb-6">
                Chez NVS Amour Éternel, nous mettons tout notre savoir-faire au
                service de votre plus beau jour. De l&apos;organisation à la
                décoration, en passant par la location de matériel, nous vous
                accompagnons à chaque étape.
              </p>
              <p className="text-gray leading-relaxed mb-8">
                Basées en Île-de-France, nous créons des mariages sur-mesure qui
                reflètent votre histoire et vos envies. Chaque détail compte, et
                nous sommes là pour les rendre parfaits.
              </p>
              <Link
                href="/prestations"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium transition-colors"
              >
                Découvrir nos prestations
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
                alt="Décoration de mariage"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark mb-4">
              Nos <span className="text-gold">Services</span>
            </h2>
            <p className="text-gray max-w-2xl mx-auto">
              Un accompagnement complet pour votre mariage, de la première
              rencontre au dernier pas de danse.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-8 bg-cream hover:shadow-lg transition-shadow"
              >
                <feature.icon
                  size={40}
                  className="text-gold mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="font-[family-name:var(--font-heading)] text-xl mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-dark text-white p-12 md:p-20">
            <div className="relative z-10 text-center">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl mb-4">
                Location de Matériel
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                Découvrez notre catalogue de matériel de décoration en location.
                Arches, centres de table, luminaires et bien plus encore.
              </p>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium tracking-widest uppercase transition-colors"
              >
                Voir le catalogue
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-rose">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark mb-4">
            Prêts à commencer ?
          </h2>
          <p className="text-gray mb-8">
            Racontez-nous votre projet et recevez un devis personnalisé
            gratuitement.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-10 py-4 text-sm font-medium tracking-widest uppercase transition-colors"
          >
            Demander un devis gratuit
            <Heart size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
