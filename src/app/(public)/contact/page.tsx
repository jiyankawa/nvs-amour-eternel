import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ContactForm from "@/components/contact/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Devis",
  description:
    "Demandez un devis gratuit pour votre mariage. NVS Amour Éternel - Organisation, décoration et location de matériel en Île-de-France.",
};

export default async function ContactPage() {
  const prestations = await prisma.prestation.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const articles = await prisma.article.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      category: { select: { name: true } },
      stock: true,
    },
  });

  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-dark mb-4">
              Demander un <span className="text-gold">Devis</span>
            </h1>
            <p className="text-gray max-w-2xl mx-auto">
              Remplissez le formulaire ci-dessous et nous vous recontacterons
              dans les plus brefs délais avec un devis personnalisé.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 sticky top-28">
                <h2 className="font-[family-name:var(--font-heading)] text-2xl text-dark mb-6">
                  Nos Coordonnées
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail size={20} className="text-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-dark">Email</p>
                      <p className="text-gray text-sm">
                        contact@nvsamoureternel.fr
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone size={20} className="text-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-dark">Téléphone</p>
                      <p className="text-gray text-sm">06 XX XX XX XX</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin size={20} className="text-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-dark">Zone d&apos;intervention</p>
                      <p className="text-gray text-sm">
                        Île-de-France, France
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-light">
                  <p className="text-sm text-gray leading-relaxed">
                    Nous répondons généralement sous 24 à 48h. N&apos;hésitez pas à
                    nous appeler pour toute question urgente.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm
                prestations={prestations}
                articles={articles.map((a) => ({
                  id: a.id,
                  name: a.name,
                  slug: a.slug,
                  categoryName: a.category.name,
                  stock: a.stock,
                }))}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
