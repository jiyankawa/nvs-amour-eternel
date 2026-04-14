import { prisma } from "@/lib/db";
import { Package, Star, MessageSquare, Image } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [articleCount, prestationCount, requestCount, galleryCount, recentRequests] =
    await Promise.all([
      prisma.article.count(),
      prisma.prestation.count(),
      prisma.contactRequest.count(),
      prisma.galleryImage.count(),
      prisma.contactRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          prestations: { include: { prestation: true } },
        },
      }),
    ]);

  const newRequests = await prisma.contactRequest.count({
    where: { status: "NEW" },
  });

  const stats = [
    { name: "Articles", value: articleCount, icon: Package, href: "/admin/catalogue" },
    { name: "Prestations", value: prestationCount, icon: Star, href: "/admin/prestations" },
    { name: "Demandes", value: requestCount, icon: MessageSquare, href: "/admin/demandes", badge: newRequests },
    { name: "Photos galerie", value: galleryCount, icon: Image, href: "/admin/galerie" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-heading)] text-3xl text-dark mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={24} className="text-gold" />
              {stat.badge ? (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stat.badge} nouveau{stat.badge > 1 ? "x" : ""}
                </span>
              ) : null}
            </div>
            <p className="text-3xl font-bold text-dark">{stat.value}</p>
            <p className="text-sm text-gray mt-1">{stat.name}</p>
          </Link>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-dark">
            Dernières demandes
          </h2>
        </div>
        {recentRequests.length === 0 ? (
          <p className="p-6 text-gray text-sm">Aucune demande pour le moment.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentRequests.map((req) => (
              <div key={req.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-dark">{req.name}</p>
                  <p className="text-sm text-gray">{req.email}</p>
                  <p className="text-xs text-gray mt-1">
                    {req.prestations.map((p) => p.prestation.name).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
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
                  <p className="text-xs text-gray mt-2">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
