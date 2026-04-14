"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  weddingDate: string | null;
  venue: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  prestations: { prestation: { name: string } }[];
  articles: { article: { name: string }; quantity: number; startDate: string | null; endDate: string | null }[];
}

export default function AdminDemandesPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactRequest | null>(null);

  const fetchRequests = async () => {
    const res = await fetch("/api/contact/list");
    setRequests(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/contact/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchRequests();
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
      <h1 className="font-[family-name:var(--font-heading)] text-3xl text-dark mb-8">
        Demandes de devis
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 bg-white shadow-sm max-h-[calc(100vh-200px)] overflow-y-auto">
          {requests.length === 0 ? (
            <p className="p-6 text-gray text-sm">Aucune demande.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelected(req);
                    if (req.status === "NEW") updateStatus(req.id, "READ");
                  }}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selected?.id === req.id ? "bg-cream" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-dark text-sm">
                      {req.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        req.status === "NEW"
                          ? "bg-blue-100 text-blue-700"
                          : req.status === "READ"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {req.status === "NEW"
                        ? "Nouveau"
                        : req.status === "READ"
                        ? "Lu"
                        : "Répondu"}
                    </span>
                  </div>
                  <p className="text-xs text-gray mt-1">{req.email}</p>
                  <p className="text-xs text-gray mt-1">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-[family-name:var(--font-heading)] text-2xl text-dark">
                  {selected.name}
                </h2>
                <select
                  value={selected.status}
                  onChange={(e) => {
                    updateStatus(selected.id, e.target.value);
                    setSelected({ ...selected, status: e.target.value });
                  }}
                  className="border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-gold"
                >
                  <option value="NEW">Nouveau</option>
                  <option value="READ">Lu</option>
                  <option value="REPLIED">Répondu</option>
                </select>
              </div>

              <div className="space-y-3 mb-8">
                <p className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gold" />
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selected.email}
                  </a>
                </p>
                {selected.phone && (
                  <p className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gold" />
                    {selected.phone}
                  </p>
                )}
                {selected.weddingDate && (
                  <p className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gold" />
                    {new Date(selected.weddingDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
                {selected.venue && (
                  <p className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-gold" />
                    {selected.venue}
                  </p>
                )}
              </div>

              {selected.prestations.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-dark text-sm mb-2">
                    Prestations demandées :
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.prestations.map((p, i) => (
                      <span
                        key={i}
                        className="bg-cream text-gold px-3 py-1 text-sm"
                      >
                        {p.prestation.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.articles.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-dark text-sm mb-2">
                    Articles en location :
                  </h3>
                  <div className="space-y-2">
                    {selected.articles.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-gray-50 px-4 py-2 text-sm"
                      >
                        <span>
                          {a.article.name} x{a.quantity}
                        </span>
                        {a.startDate && a.endDate && (
                          <span className="text-gray text-xs">
                            {new Date(a.startDate).toLocaleDateString("fr-FR")}{" "}
                            → {new Date(a.endDate).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.message && (
                <div>
                  <h3 className="font-medium text-dark text-sm mb-2">
                    Message :
                  </h3>
                  <p className="text-gray text-sm whitespace-pre-line bg-gray-50 p-4">
                    {selected.message}
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray">
                Reçu le{" "}
                {new Date(selected.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm p-12 text-center">
              <Eye size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray">
                Sélectionnez une demande pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
