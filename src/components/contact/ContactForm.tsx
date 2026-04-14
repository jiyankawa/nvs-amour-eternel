"use client";

import { useState, useRef } from "react";
import { Send, Plus, Minus, Loader2, CheckCircle, ChevronDown } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface Prestation {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  stock: number;
}

interface ArticleSelection {
  articleId: string;
  quantity: number;
}

export default function ContactForm({
  prestations,
  articles,
}: {
  prestations: Prestation[];
  articles: Article[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    weddingDate: "",
    venue: "",
    rentalStart: "",
    rentalEnd: "",
    message: "",
  });
  const [selectedPrestations, setSelectedPrestations] = useState<string[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<ArticleSelection[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const togglePrestation = (id: string) => {
    setSelectedPrestations((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleCategory = (catName: string) => {
    setOpenCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    );
  };

  const getArticleQty = (articleId: string): number => {
    return selectedArticles.find((a) => a.articleId === articleId)?.quantity || 0;
  };

  const setArticleQty = (articleId: string, qty: number, maxStock: number) => {
    const clamped = Math.max(0, Math.min(qty, maxStock));
    if (clamped === 0) {
      setSelectedArticles((prev) => prev.filter((a) => a.articleId !== articleId));
    } else {
      setSelectedArticles((prev) => {
        const existing = prev.find((a) => a.articleId === articleId);
        if (existing) {
          return prev.map((a) =>
            a.articleId === articleId ? { ...a, quantity: clamped } : a
          );
        }
        return [...prev, { articleId, quantity: clamped }];
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          prestationIds: selectedPrestations,
          articles: selectedArticles.map((a) => ({
            ...a,
            startDate: formData.rentalStart,
            endDate: formData.rentalEnd,
          })),
          captchaToken,
        }),
      });

      if (!res.ok) throw new Error("Erreur");
      setStatus("success");
    } catch {
      setStatus("error");
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white p-12 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-heading)] text-2xl text-dark mb-4">
          Demande envoyée !
        </h3>
        <p className="text-gray">
          Merci pour votre demande. Nous vous recontacterons dans les plus brefs
          délais avec un devis personnalisé.
        </p>
      </div>
    );
  }

  // Group articles by category
  const articlesByCategory = articles.reduce(
    (acc, article) => {
      if (!acc[article.categoryName]) acc[article.categoryName] = [];
      acc[article.categoryName].push(article);
      return acc;
    },
    {} as Record<string, Article[]>
  );

  const totalArticlesSelected = selectedArticles.length;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 space-y-8">
      {/* Personal Info */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-4">
          Vos Informations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border border-gray-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Date du mariage
            </label>
            <input
              type="date"
              value={formData.weddingDate}
              onChange={(e) =>
                setFormData({ ...formData, weddingDate: e.target.value })
              }
              className="w-full border border-gray-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark mb-1">
              Lieu de réception
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              className="w-full border border-gray-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Rental Dates */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-2">
          Dates de location
        </h3>
        <p className="text-sm text-gray mb-4">
          Indiquez la période souhaitée pour la location du matériel
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={formData.rentalStart}
              onChange={(e) =>
                setFormData({ ...formData, rentalStart: e.target.value })
              }
              className="w-full border border-gray-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={formData.rentalEnd}
              min={formData.rentalStart || undefined}
              onChange={(e) =>
                setFormData({ ...formData, rentalEnd: e.target.value })
              }
              className="w-full border border-gray-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Prestations */}
      {prestations.length > 0 && (
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-4">
            Prestations souhaitées
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prestations.map((presta) => (
              <label
                key={presta.id}
                className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                  selectedPrestations.includes(presta.id)
                    ? "border-gold bg-rose"
                    : "border-gray-light hover:border-gold-light"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPrestations.includes(presta.id)}
                  onChange={() => togglePrestation(presta.id)}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-sm font-medium text-dark">
                  {presta.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-[family-name:var(--font-heading)] text-xl text-dark">
              Articles en location
            </h3>
            {totalArticlesSelected > 0 && (
              <span className="text-xs bg-gold text-white px-2.5 py-1 rounded-full">
                {totalArticlesSelected} article{totalArticlesSelected > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {Object.entries(articlesByCategory).map(([catName, catArticles]) => {
              const isOpen = openCategories.includes(catName);
              const selectedInCat = catArticles.filter(
                (a) => getArticleQty(a.id) > 0
              ).length;

              return (
                <div key={catName} className="border border-gray-light">
                  {/* Category header — collapsible */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(catName)}
                    className="w-full flex items-center justify-between p-4 hover:bg-cream/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-dark">
                        {catName}
                      </span>
                      {selectedInCat > 0 && (
                        <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                          {selectedInCat}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-gray transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Category articles */}
                  {isOpen && (
                    <div className="border-t border-gray-light divide-y divide-gray-light">
                      {catArticles.map((article) => {
                        const qty = getArticleQty(article.id);

                        return (
                          <div
                            key={article.id}
                            className={`flex items-center justify-between px-4 py-3 transition-colors ${
                              qty > 0 ? "bg-rose/50" : ""
                            }`}
                          >
                            <span
                              className={`text-sm flex-1 ${
                                qty > 0 ? "font-medium text-dark" : "text-gray"
                              }`}
                            >
                              {article.name}
                            </span>

                            <div className="flex items-center border border-gray-light bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  setArticleQty(article.id, qty - 1, article.stock)
                                }
                                className="p-1.5 hover:bg-cream disabled:opacity-30"
                                disabled={qty === 0}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-sm min-w-[2rem] text-center font-medium">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setArticleQty(article.id, qty + 1, article.stock)
                                }
                                className="p-1.5 hover:bg-cream disabled:opacity-30"
                                disabled={qty >= article.stock}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-xl text-dark mb-4">
          Votre Message
        </h3>
        <textarea
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Décrivez votre projet, vos envies, vos besoins..."
          className="w-full border border-gray-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
        />
      </div>

      {/* CAPTCHA */}
      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setCaptchaToken(token)}
        onExpire={() => setCaptchaToken(null)}
        options={{ theme: "light", size: "normal" }}
      />

      {/* Submit */}
      {status === "error" && (
        <p className="text-red-500 text-sm">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !captchaToken}
        className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-white px-8 py-3 text-sm font-medium tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={18} />
            Envoyer la demande
          </>
        )}
      </button>
    </form>
  );
}
