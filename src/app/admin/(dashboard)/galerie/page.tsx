"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

export default function AdminGaleriePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ url: "", alt: "" });

  const fetchImages = async () => {
    const res = await fetch("/api/gallery");
    setImages(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "nvs-amour-eternel/galerie");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setForm({ ...form, url: data.url });
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: form.url,
        alt: form.alt || null,
        order: images.length,
      }),
    });
    setForm({ url: "", alt: "" });
    setShowForm(false);
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette photo ?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    fetchImages();
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
          Galerie
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gold hover:bg-gold-dark text-white px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Ajouter une photo
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 mb-6 shadow-sm">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full text-sm"
              />
              {uploading && (
                <p className="text-sm text-gray mt-2 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Upload en cours...
                </p>
              )}
              {form.url && (
                <div className="mt-2">
                  <Image
                    src={form.url}
                    alt="Preview"
                    width={200}
                    height={150}
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-gray mt-2">
                Ou entrez une URL directement :
              </p>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Description (alt)
              </label>
              <input
                type="text"
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Description de la photo"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!form.url}
                className="bg-gold hover:bg-gold-dark disabled:opacity-50 text-white px-6 py-2 text-sm font-medium transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm({ url: "", alt: "" }); }}
                className="border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {images.length === 0 ? (
        <div className="bg-white p-12 text-center shadow-sm">
          <p className="text-gray">Aucune photo dans la galerie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <Image
                src={img.url}
                alt={img.alt || ""}
                width={300}
                height={250}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
              {img.alt && (
                <p className="text-xs text-gray mt-1 truncate">{img.alt}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
