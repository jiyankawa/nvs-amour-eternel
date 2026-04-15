"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Calendar, FolderPlus, Upload, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { articles: number };
}

interface Article {
  id: string;
  name: string;
  slug: string;
  description: string;
  photos: string;
  categoryId: string;
  price: number | null;
  priceVisible: boolean;
  stock: number;
  active: boolean;
  category: { id: string; name: string };
}

export default function AdminCataloguePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [catName, setCatName] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    priceVisible: false,
    stock: 1,
    active: true,
  });

  const fetchData = async () => {
    const [artRes, catRes] = await Promise.all([
      fetch("/api/articles"),
      fetch("/api/categories"),
    ]);
    setArticles(await artRes.json());
    setCategories(await catRes.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", categoryId: "", price: "", priceVisible: false, stock: 1, active: true });
    setPhotos([]);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (a: Article) => {
    setEditing(a);
    setPhotos((() => { try { return JSON.parse(a.photos); } catch { return []; } })());
    setForm({
      name: a.name,
      description: a.description,
      categoryId: a.categoryId,
      price: a.price?.toString() || "",
      priceVisible: a.priceVisible,
      stock: a.stock,
      active: a.active,
    });
    setShowForm(true);
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "nvs-amour-eternel/articles");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setPhotos((prev) => [...prev, data.url]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name,
      description: form.description,
      categoryId: form.categoryId,
      price: form.price ? parseFloat(form.price) : null,
      priceVisible: form.priceVisible,
      stock: form.stock,
      active: form.active,
      photos,
    };

    await fetch("/api/articles", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catName }),
    });
    setCatName("");
    setShowCatForm(false);
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl text-dark">
          Catalogue
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCatForm(true)}
            className="border border-gold text-gold hover:bg-gold hover:text-white px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <FolderPlus size={18} />
            Catégorie
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-gold hover:bg-gold-dark text-white px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Article
          </button>
        </div>
      </div>

      {/* Category Form Modal */}
      {showCatForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-xl mb-4">
              Nouvelle catégorie
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Nom de la catégorie"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold-dark text-white px-6 py-2 text-sm font-medium transition-colors"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowCatForm(false)}
                  className="border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-xl mb-6">
              {editing ? "Modifier" : "Ajouter"} un article
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
                <label className="block text-sm font-medium text-dark mb-1">Catégorie *</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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
              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Photos</label>
                {photos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {photos.map((url, i) => (
                      <div key={i} className="relative group">
                        <Image
                          src={url}
                          alt={`Photo ${i + 1}`}
                          width={120}
                          height={120}
                          className="w-full h-24 object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-gray-300 cursor-pointer hover:border-gold transition-colors mb-2">
                  {uploading ? (
                    <Loader2 size={18} className="animate-spin text-gold" />
                  ) : (
                    <Upload size={18} className="text-gray" />
                  )}
                  <span className="text-sm text-gray">
                    {uploading ? "Upload en cours..." : "Uploader une photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Ou coller une URL d'image..."
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (photoUrl.trim()) {
                        setPhotos((prev) => [...prev, photoUrl.trim()]);
                        setPhotoUrl("");
                      }
                    }}
                    disabled={!photoUrl.trim()}
                    className="bg-gold hover:bg-gold-dark disabled:opacity-30 text-white px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Prix</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
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
                  <span className="text-sm">Prix visible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="accent-gold"
                  />
                  <span className="text-sm">Actif</span>
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

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="bg-white px-3 py-1 text-sm text-dark border border-gray-200"
            >
              {cat.name} ({cat._count.articles})
            </span>
          ))}
        </div>
      )}

      {/* Articles List */}
      <div className="bg-white shadow-sm">
        {articles.length === 0 ? (
          <p className="p-8 text-gray text-center">
            Aucun article. Commencez par créer une catégorie puis ajoutez des articles.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {articles.map((a) => (
              <div key={a.id} className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-dark">{a.name}</h3>
                    <span className="text-xs bg-cream text-gold px-2 py-0.5">
                      {a.category.name}
                    </span>
                    {!a.active && (
                      <span className="text-xs bg-gray-100 text-gray px-2 py-0.5 rounded">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray mt-1 line-clamp-1">
                    {a.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    {a.price && (
                      <span className="text-gold font-medium">{a.price}€</span>
                    )}
                    {a.price && (
                      <span className="text-gray flex items-center gap-1 text-xs">
                        {a.priceVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {a.priceVisible ? "Visible" : "Sur demande"}
                      </span>
                    )}
                    <span className="text-gray text-xs">Stock: {a.stock}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/catalogue/${a.id}/disponibilite`}
                    className="p-2 text-gray hover:text-blue-500 transition-colors"
                    title="Gérer la disponibilité"
                  >
                    <Calendar size={18} />
                  </Link>
                  <button
                    onClick={() => handleEdit(a)}
                    className="p-2 text-gray hover:text-gold transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
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
