import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

type SitemapEvent = {
    slug: string;
    month: number;
    day: number;
    type: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://todaylab.today";

    const events: SitemapEvent[] = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
        },
        select: {
            slug: true,
            month: true,
            day: true,
            type: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/calendar`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/birthdays`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/submit`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: event.type === "BIRTHDAY" ? 0.85 : 0.8,
    }));

    const uniqueDateMap = new Map<string, { month: number; day: number }>();

    for (const event of events) {
        const key = `${event.month}-${event.day}`;
        uniqueDateMap.set(key, {
            month: event.month,
            day: event.day,
        });
    }

    const datePages: MetadataRoute.Sitemap = Array.from(uniqueDateMap.values()).map(
        (date) => ({
            url: `${baseUrl}/date/${date.month}/${date.day}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        })
    );

    const monthPages: MetadataRoute.Sitemap = Array.from(
        { length: 12 },
        (_, index) => ({
            url: `${baseUrl}/date/${index + 1}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        })
    );

    return [...staticPages, ...monthPages, ...eventPages, ...datePages];
}
