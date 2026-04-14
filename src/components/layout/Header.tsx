"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Prestations", href: "/prestations" },
  { name: "Catalogue", href: "/catalogue" },
  { name: "Galerie", href: "/galerie" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-dark">
              NVS <span className="text-gold">Amour Éternel</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-dark-light hover:text-gold transition-colors text-sm font-medium tracking-wide uppercase"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-dark text-white px-6 py-2.5 text-sm font-medium tracking-wide uppercase transition-colors"
            >
              Devis gratuit
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 border-t border-gray-light">
            <div className="flex flex-col gap-4 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-dark-light hover:text-gold transition-colors text-sm font-medium tracking-wide uppercase px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="bg-gold hover:bg-gold-dark text-white px-6 py-2.5 text-sm font-medium tracking-wide uppercase transition-colors text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Devis gratuit
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
