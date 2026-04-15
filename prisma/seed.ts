import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";
import { mkdirSync } from "fs";

const dataDir = path.join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "nvs.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  // IMPORTANT: Changer ces mots de passe avant la mise en production !
  const adminPwd = process.env.ADMIN_PASSWORD || "NVS-Admin-2026!Secure";
  const hashedPassword = await bcrypt.hash(adminPwd, 12);
  await prisma.user.upsert({
    where: { email: "admin@nvsamoureternel.fr" },
    update: { password: hashedPassword },
    create: {
      email: "admin@nvsamoureternel.fr",
      password: hashedPassword,
      name: "Admin NVS",
      role: "ADMIN",
    },
  });

  // Create dev user
  const devPwd = process.env.DEV_PASSWORD || "NVS-Dev-2026!Secure";
  const devPassword = await bcrypt.hash(devPwd, 12);
  await prisma.user.upsert({
    where: { email: "dev@nvsamoureternel.fr" },
    update: { password: devPassword },
    create: {
      email: "dev@nvsamoureternel.fr",
      password: devPassword,
      name: "Développeur",
      role: "DEV",
    },
  });

  // Create prestations
  const prestations = [
    {
      name: "Recherche Prestataires",
      slug: "recherche-prestataires",
      description:
        "Nous recherchons et sélectionnons pour vous les meilleurs prestataires : traiteur, photographe, DJ, fleuriste... Nous négocions les tarifs et coordonnons les rendez-vous pour vous faire gagner du temps et de la sérénité.",
      order: 1,
      price: 500,
      priceVisible: false,
    },
    {
      name: "Organisation",
      slug: "organisation",
      description:
        "De la définition de votre budget à la gestion du rétroplanning, nous prenons en charge l'intégralité de l'organisation de votre mariage. Planning, logistique, gestion des invités — nous pensons à tout.",
      order: 2,
      price: 2000,
      priceVisible: false,
    },
    {
      name: "Décoration du Lieu",
      slug: "decoration-du-lieu",
      description:
        "Nous concevons et réalisons la décoration de votre lieu de réception et de cérémonie. Un univers unique, créé sur-mesure selon vos envies : centres de table, arches florales, mise en lumière, scénographie complète.",
      order: 3,
      price: 1500,
      priceVisible: false,
    },
    {
      name: "Coordination du Jour J",
      slug: "coordination-du-jour-j",
      description:
        "Le jour de votre mariage, nous sommes sur place pour coordonner tous les prestataires, gérer les imprévus et veiller au bon déroulement de chaque instant. Vous n'avez qu'à profiter.",
      order: 4,
      price: 800,
      priceVisible: true,
    },
    {
      name: "Location de Matériel",
      slug: "location-de-materiel",
      description:
        "Découvrez notre catalogue de matériel de décoration en location : arches, centres de table, chandeliers, vases, luminaires, nappes et bien plus. Tout ce qu'il faut pour sublimer votre événement.",
      order: 5,
    },
  ];

  for (const p of prestations) {
    await prisma.prestation.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        order: p.order,
        price: p.price || null,
        priceVisible: p.priceVisible || false,
        active: true,
        photos: "[]",
      },
    });
  }

  // Create categories
  const categories = [
    { name: "Arches & Structures", slug: "arches-structures", order: 1 },
    { name: "Centres de Table", slug: "centres-de-table", order: 2 },
    { name: "Chandeliers & Bougeoirs", slug: "chandeliers-bougeoirs", order: 3 },
    { name: "Vases & Contenants", slug: "vases-contenants", order: 4 },
    { name: "Luminaires", slug: "luminaires", order: 5 },
    { name: "Nappes & Textiles", slug: "nappes-textiles", order: 6 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = c.id;
  }

  // Create sample articles with matching photos
  const articles = [
    { name: "Arche Ronde Dorée", slug: "arche-ronde-doree", description: "Arche ronde en métal doré, parfaite pour une cérémonie laïque élégante. Hauteur 2m20, largeur 1m80.", category: "arches-structures", price: 150, stock: 3, photos: ["https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80"] },
    { name: "Arche Rectangulaire Blanche", slug: "arche-rectangulaire-blanche", description: "Arche rectangulaire en métal blanc, idéale pour une décoration moderne et épurée. Hauteur 2m50, largeur 2m.", category: "arches-structures", price: 120, stock: 2, photos: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80"] },
    { name: "Centre de Table Cristal", slug: "centre-table-cristal", description: "Centre de table en cristal avec support pour bougies et fleurs. Hauteur 40cm.", category: "centres-de-table", price: 25, stock: 20, photos: ["https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80"] },
    { name: "Centre de Table Bois Flotté", slug: "centre-table-bois-flotte", description: "Centre de table naturel en bois flotté, style bohème chic. Longueur 50cm.", category: "centres-de-table", price: 20, stock: 15, photos: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80"] },
    { name: "Chandelier 5 Branches Doré", slug: "chandelier-5-branches-dore", description: "Chandelier élégant à 5 branches en métal doré. Hauteur 60cm.", category: "chandeliers-bougeoirs", price: 30, stock: 12, photos: ["https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80"] },
    { name: "Chandelier Crystal 3 Branches", slug: "chandelier-crystal-3-branches", description: "Chandelier en cristal à 3 branches pour une ambiance romantique. Hauteur 45cm.", category: "chandeliers-bougeoirs", price: 35, stock: 10, photos: ["https://images.unsplash.com/photo-1501901609772-df0848060b33?w=800&q=80"] },
    { name: "Vase Cylindrique Doré", slug: "vase-cylindrique-dore", description: "Vase cylindrique en verre avec finition dorée. Hauteur 30cm, diamètre 15cm.", category: "vases-contenants", price: 15, stock: 30, photos: ["https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80"] },
    { name: "Vase Boule Transparent", slug: "vase-boule-transparent", description: "Vase boule en verre transparent pour compositions florales. Diamètre 25cm.", category: "vases-contenants", price: 12, stock: 25, photos: ["https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80"] },
    { name: "Guirlande Lumineuse LED", slug: "guirlande-lumineuse-led", description: "Guirlande lumineuse LED blanc chaud, 10 mètres, étanche. Parfaite pour illuminer votre lieu de réception.", category: "luminaires", price: 20, stock: 20, photos: ["https://images.unsplash.com/photo-1562547256-2c5ee93b60b7?w=800&q=80"] },
    { name: "Lanternes Suspendues", slug: "lanternes-suspendues", description: "Lot de 3 lanternes en métal doré à suspendre. Hauteurs 20, 25 et 30cm.", category: "luminaires", price: 40, stock: 8, photos: ["https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80"] },
    { name: "Nappe Satin Ivoire", slug: "nappe-satin-ivoire", description: "Nappe en satin ivoire, dimensions 3m x 1m50. Entretien facile, aspect luxueux.", category: "nappes-textiles", price: 15, stock: 30, photos: ["https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80"] },
    { name: "Chemin de Table Doré", slug: "chemin-table-dore", description: "Chemin de table en organza doré avec broderies. Longueur 2m, largeur 30cm.", category: "nappes-textiles", price: 8, stock: 40, photos: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"] },
  ];

  for (const article of articles) {
    const categoryId = createdCategories[article.category];
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: { photos: JSON.stringify(article.photos) },
      create: {
        name: article.name,
        slug: article.slug,
        description: article.description,
        categoryId,
        price: article.price,
        priceVisible: true,
        stock: article.stock,
        active: true,
        photos: JSON.stringify(article.photos),
      },
    });
  }

  // Create site settings
  const settings = [
    { key: "email", value: "contact@nvsamoureternel.fr" },
    { key: "phone", value: "06 XX XX XX XX" },
    { key: "address", value: "Île-de-France, France" },
    { key: "instagram", value: "" },
    { key: "facebook", value: "" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
