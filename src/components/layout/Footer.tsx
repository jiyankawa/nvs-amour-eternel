import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl mb-4">
              NVS <span className="text-gold">Amour Éternel</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre wedding planner d&apos;exception en Île-de-France et Haute-Normandie.
              Mariages haut de gamme, organisation, décoration et location de matériel.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-lg mb-4 text-gold">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/prestations" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Nos Prestations
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Catalogue Location
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Demander un Devis
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Mentions Légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-lg mb-4 text-gold">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="text-gold flex-shrink-0" />
                contact.nvsamoureternel@gmail.com
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="text-gold flex-shrink-0" />
                06 71 34 73 72
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-gold flex-shrink-0" />
                Île-de-France &amp; Haute-Normandie
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} NVS Amour Éternel. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            Fait avec <Heart size={12} className="text-gold" /> en Île-de-France
          </p>
        </div>
      </div>
    </footer>
  );
}
