"use client";

import { MessageCircle, Star, Globe } from "lucide-react";
// Instagram ikonu lucide'de mevcut değil, SVG kullanıyoruz
function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
    );
}
import { createClient } from "@/utils/supabase/client";
import type { Branch, Table } from "@/types";

type LinkType = "whatsapp" | "google_review" | "instagram" | "website" | "feedback";

const buttons: {
    type: LinkType;
    label: string;
    icon: React.ElementType;
    bg: string;
    getUrl: (branch: Branch, table: Table) => string | null;
}[] = [
    {
        type: "whatsapp",
        label: "WhatsApp ile Mesaj Gönder",
        icon: MessageCircle,
        bg: "#25D366",
        getUrl: (b, t) =>
            b.whatsapp_number
                ? `https://wa.me/${b.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(`Merhaba, ${b.name} - Masa ${t.table_number} `)}`
                : null,
    },
    {
        type: "google_review",
        label: "Google'da Değerlendirin",
        icon: Star,
        bg: "#FBBC04",
        getUrl: b => b.google_review_url,
    },
    {
        type: "instagram",
        label: "Instagram'da Takip Edin",
        icon: InstagramIcon,
        bg: "#E1306C",
        getUrl: b => b.instagram_url,
    },
    {
        type: "website",
        label: "Web Sitemizi Ziyaret Edin",
        icon: Globe,
        bg: "#2C3E50",
        getUrl: b => b.website_url,
    },
];

async function trackClick(type: LinkType, branchId: string, tableId: string) {
    const supabase = createClient();
    await supabase.from("rt_link_clicks").insert({
        branch_id: branchId,
        table_id: tableId,
        link_type: type,
    });
}

export default function ActionButtons({ branch, table }: { branch: Branch; table: Table }) {
    const visibleButtons = buttons.filter(b => b.getUrl(branch, table));

    return (
        <div className="px-4 space-y-3 mt-4">
            {visibleButtons.map(({ type, label, icon: Icon, bg, getUrl }) => {
                const url = getUrl(branch, table)!;
                return (
                    <a
                        key={type}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick(type, branch.id, table.id)}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-white shadow-sm active:scale-95 transition-transform"
                        style={{ background: bg }}
                    >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="font-semibold text-sm">{label}</span>
                    </a>
                );
            })}
        </div>
    );
}
