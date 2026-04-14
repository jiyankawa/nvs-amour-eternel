"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";

interface Prestation {
  id: string;
  name: string;
  slug: string;
  description: string;
  photos: string;
  price: number | null;
  priceVisible: boolean;
  order: number;
  active: boolean;
}

export default function AdminPrestationsPage() {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Prestation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    priceVisible: false,
    order: 0,
    active: true,
  });

  const fetchPrestations = async () => {
    const res = await fetch("/api/prestations");
    const data = await res.json();
    setPrestations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrestations();
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", priceVisible: false, order: 0, active: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (p: Prestation) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price?.toString() || "",
      priceVisible: p.priceVisible,
      order: p.order,
      active: p.active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name,
      description: form.description,
      price: form.price ? parseFloat(form.price) : null,
      priceVisible: form.priceVisible,
      order: form.order,
      active: form.active,
      photos: editing ? (() => { try { return JSON.parse(editing.photos); } catch { return []; } })() : [],
    };

    await fetch("/api/prestations", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    resetForm();
    fetchPrestations();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette prestation ?")) return;
    await fetch(`/api/prestations?id=${id}`, { method: "DELETE" });
    fetchPrestations();
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl text-dark">
          Prestations
        </h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-gold hover:bg-gold-dark text-white px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-xl mb-6">
              {editing ? "Modifier" : "Ajouter"} une prestation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Prix</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                    placeholder="Laisser vide si pas de prix"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Ordre</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.priceVisible}
                    onChange={(e) => setForm({ ...form, priceVisible: e.target.checked })}
                    className="accent-gold"
                  />
                  <span className="text-sm">Prix visible sur le site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="accent-gold"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold-dark text-white px-6 py-2 text-sm font-medium transition-colors"
                >
                  {editing ? "Modifier" : "Ajouter"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white shadow-sm">
        {prestations.length === 0 ? (
          <p className="p-8 text-gray text-center">Aucune prestation. Cliquez sur &quot;Ajouter&quot; pour commencer.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {prestations.map((p) => (
              <div key={p.id} className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-dark">{p.name}</h3>
                    {!p.active && (
                      <span className="text-xs bg-gray-100 text-gray px-2 py-0.5 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray mt-1 line-clamp-1">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {p.price && (
                      <span className="text-sm text-gold font-medium">
                        {p.price}€
                      </span>
                    )}
                    {p.price && (
                      <span className="text-xs text-gray flex items-center gap-1">
                        {p.priceVisible ? (
                          <>
                            <Eye size={12} /> Visible
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> Sur demande
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 text-gray hover:text-gold transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-gray hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
