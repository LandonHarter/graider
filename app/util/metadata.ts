import { Metadata } from "next";

export default function basicMetadata(metadata?: Metadata): Metadata {
    return {
        metadataBase: new URL('https://graider.vercel.app'),
        title: metadata?.title || 'Graider',
        description: metadata?.description || 'Not confident in your writing? Graider is your partner in improving your writing skills with AI-driven insights to help you.',
        authors: [
            {
                name: "Landon Harter",
                url: 'https://landonharter.me'
            },
            {
                name: "Graider",
                url: 'https://graider.vercel.app'
            },
        ],
        publisher: 'Graider',
        robots: {
            index: true,
            follow: true,
        },
        keywords: metadata?.keywords ? metadata?.keywords : 'Graider, AI, essay, writing, teacher, education',
        creator: 'Graider',
        icons: [
            {
                url: 'https://graider.vercel.app/images/icons/logo.png',
                type: 'image/png',
            },
        ],
        applicationName: 'Graider',
        openGraph: {
            title: metadata?.title || 'Graider',
            description: metadata?.description || 'Not confident in your writing? Graider is your partner in improving your writing skills with AI-driven insights to help you.',
            url: `https://graider.vercel.app${metadata?.openGraph?.url || ''}`,
            type: 'website',
            images: ['https://graider.vercel.app/images/icons/logo.png'],
            siteName: 'Graider',
        },
        twitter: {
            site: `https://graider.vercel.app${metadata?.openGraph?.url || ''}`,
            card: 'summary_large_image',
            images: ['https://graider.vercel.app/images/icons/logo.png'],
            title: metadata?.title || 'Graider',
            description: metadata?.description || 'Not confident in your writing? Graider is your partner in improving your writing skills with AI-driven insights to help you.',
        },
    } as Metadata;
}