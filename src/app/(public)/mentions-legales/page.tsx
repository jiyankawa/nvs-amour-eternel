import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl text-dark mb-12">
          Mentions Légales
        </h1>

        <div className="space-y-8 text-gray text-sm leading-relaxed">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-3">
              Éditeur du site
            </h2>
            <p>NVS Amour Éternel</p>
            <p>Île-de-France, France</p>
            <p>Email : contact@nvsamoureternel.fr</p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-3">
              Hébergement
            </h2>
            <p>Vercel Inc.</p>
            <p>340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-3">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, vidéos,
              logos) est protégé par le droit d&apos;auteur. Toute reproduction,
              même partielle, est interdite sans autorisation préalable.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-3">
              Protection des données personnelles
            </h2>
            <p>
              Les informations recueillies via le formulaire de contact sont
              destinées exclusivement à NVS Amour Éternel pour le traitement de
              votre demande. Conformément au RGPD, vous disposez d&apos;un droit
              d&apos;accès, de modification et de suppression de vos données
              personnelles. Pour exercer ce droit, contactez-nous par email.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-3">
              Cookies
            </h2>
            <p>
              Ce site n&apos;utilise pas de cookies de tracking. Seuls des
              cookies techniques nécessaires au fonctionnement du site sont
              utilisés.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
