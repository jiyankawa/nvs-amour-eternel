"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

interface BlockedDate {
  id: string;
  startDate: string;
  endDate: string;
  reason: string | null;
}

interface Article {
  id: string;
  name: string;
}

export default function DisponibilitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });

  const fetchData = async () => {
    const [artRes, datesRes] = await Promise.all([
      fetch("/api/articles"),
      fetch(`/api/articles/${id}/disponibilite`),
    ]);
    const articles = await artRes.json();
    const art = articles.find((a: Article) => a.id === id);
    setArticle(art || null);
    setBlockedDates(await datesRes.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/articles/${id}/disponibilite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ startDate: "", endDate: "", reason: "" });
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (blockedDateId: string) => {
    if (!confirm("Supprimer cette période bloquée ?")) return;
    await fetch(
      `/api/articles/${id}/disponibilite?blockedDateId=${blockedDateId}`,
      { method: "DELETE" }
    );
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/catalogue"
        className="inline-flex items-center gap-2 text-gray hover:text-gold transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Retour au catalogue
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl text-dark">
          Disponibilité — {article?.name}
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gold hover:bg-gold-dark text-white px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Bloquer des dates
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 mb-6 shadow-sm">
          <h3 className="font-medium text-dark mb-4">
            Ajouter une période indisponible
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray mb-1">Date début *</label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-gray mb-1">Date fin *</label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-gray mb-1">Raison</label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                  placeholder="Ex: Réservé pour mariage X"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gold hover:bg-gold-dark text-white px-6 py-2 text-sm font-medium transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-sm">
        {blockedDates.length === 0 ? (
          <p className="p-8 text-gray text-center">
            Aucune date bloquée. Cet article est disponible à toutes les dates.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {blockedDates.map((bd) => (
              <div
                key={bd.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-dark">
                    Du{" "}
                    {new Date(bd.startDate).toLocaleDateString("fr-FR")} au{" "}
                    {new Date(bd.endDate).toLocaleDateString("fr-FR")}
                  </p>
                  {bd.reason && (
                    <p className="text-xs text-gray mt-1">{bd.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(bd.id)}
                  className="p-2 text-gray hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
