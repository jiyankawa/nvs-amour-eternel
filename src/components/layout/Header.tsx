"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "À Propos", href: "/a-propos" },
  { name: "Prestations", href: "/prestations" },
  { name: "Catalogue", href: "/catalogue" },
  { name: "Galerie", href: "/galerie" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
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
              type="button"
              className="md:hidden p-3 relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="absolute inset-0 z-10" />
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile nav — portal-style, outside header, max z-index */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Panel */}
          <div className="absolute inset-x-0 top-0 bg-white shadow-xl">
            {/* Header bar */}
            <div className="flex justify-between items-center h-20 px-4">
              <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-dark">
                NVS <span className="text-gold">Amour Éternel</span>
              </span>
              <button
                type="button"
                className="p-3 relative"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer"
              >
                <span className="absolute inset-0 z-10" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Links */}
            <div className="flex flex-col px-6 pb-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-dark hover:text-gold transition-colors text-lg font-medium tracking-wide uppercase py-4 border-b border-gray-light"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="bg-gold hover:bg-gold-dark text-white px-6 py-4 text-lg font-medium tracking-wide uppercase transition-colors text-center mt-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Devis gratuit
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
