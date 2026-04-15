import Image from "next/image";
import Link from "next/link";
import { Heart, Award, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos",
  description:
    "Découvrez NVS Amour Éternel, agence spécialisée dans les mariages haut de gamme en Île-de-France et Haute-Normandie. Émilie, wedding planner diplômée, vous accompagne.",
};

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
          alt="À propos NVS Amour Éternel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4">
            À Propos
          </h1>
          <p className="text-lg font-light max-w-2xl mx-auto">
            Votre wedding planner d&apos;exception
          </p>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] lg:h-[550px]">
              <Image
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80"
                alt="Émilie - Wedding Planner"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark mb-6">
                Émilie, <span className="text-gold">votre wedding planner</span>
              </h2>
              <p className="text-gray leading-relaxed mb-6">
                Basée en Île-de-France et en Haute-Normandie, notre agence NVS
                Amour Éternel est spécialisée dans les mariages haut de gamme.
              </p>
              <p className="text-gray leading-relaxed mb-6">
                Organisée, rigoureuse et sérieuse, Émilie est diplômée au titre
                de RNCP — Organisateur de Mariages et d&apos;Événements — Wedding
                Planner à l&apos;école Jaëlys et certifiée également à la Wedding
                Academy en tant que Wedding Designer Experte.
              </p>
              <p className="text-gray leading-relaxed mb-8">
                Avec ses années d&apos;expérience dans l&apos;univers du mariage, Émilie
                vous accompagne avec bienveillance et complicité tout au long de
                votre mariage.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award size={20} className="text-gold mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray">
                    <span className="font-medium text-dark">Diplômée RNCP</span> — Organisateur
                    de Mariages et d&apos;Événements, École Jaëlys
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Award size={20} className="text-gold mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray">
                    <span className="font-medium text-dark">Certifiée Wedding Designer Experte</span> — Wedding Academy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre engagement */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark mb-8">
            Notre <span className="text-gold">Engagement</span>
          </h2>
          <p className="text-gray leading-relaxed mb-6 text-lg">
            De la préparation à la cérémonie, sélection du lieu d&apos;exception, des
            traiteurs étoilés et autres prestataires certifiés sauront répondre à
            vos attentes.
          </p>
          <p className="text-gray leading-relaxed mb-12">
            Émilie exécute un travail minutieux de recherche et recommande des
            prestataires en fonction de leur professionnalisme et de la qualité de
            leurs services. Notre agence vous garantit une organisation sans faille.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-cream">
              <CheckCircle size={32} className="text-gold mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-heading)] text-lg mb-2">Bienveillance</h3>
              <p className="text-sm text-gray">
                Un accompagnement chaleureux et attentif à chaque étape
              </p>
            </div>
            <div className="p-8 bg-cream">
              <CheckCircle size={32} className="text-gold mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-heading)] text-lg mb-2">Excellence</h3>
              <p className="text-sm text-gray">
                Des prestataires triés sur le volet pour un résultat irréprochable
              </p>
            </div>
            <div className="p-8 bg-cream">
              <CheckCircle size={32} className="text-gold mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-heading)] text-lg mb-2">Sérénité</h3>
              <p className="text-sm text-gray">
                Profitez de votre jour J en toute tranquillité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-rose">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-dark mb-4">
            Envie de nous rencontrer ?
          </h2>
          <p className="text-gray mb-8">
            Contactez-nous pour une première rencontre sans engagement.
            Le feeling et la confiance sont essentiels pour commencer cette belle aventure.
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
