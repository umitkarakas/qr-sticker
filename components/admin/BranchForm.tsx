"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { Branch } from "@/types";

const COLOR_OPTIONS = [
    { label: "Kırmızı", value: "#C0392B" },
    { label: "Lacivert", value: "#1A3A6B" },
    { label: "Yeşil", value: "#1E8449" },
    { label: "Mor", value: "#7D3C98" },
    { label: "Turuncu", value: "#CA6F1E" },
    { label: "Gri", value: "#424949" },
];

type Props = { branch?: Branch };

export default function BranchForm({ branch }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: branch?.name ?? "",
        code: branch?.code ?? "",
        label_color: branch?.label_color ?? "#C0392B",
        address: branch?.address ?? "",
        phone: branch?.phone ?? "",
        working_hours: branch?.working_hours ?? "",
        whatsapp_number: branch?.whatsapp_number ?? "",
        google_maps_url: branch?.google_maps_url ?? "",
        google_review_url: branch?.google_review_url ?? "",
        instagram_url: branch?.instagram_url ?? "",
        website_url: branch?.website_url ?? "",
        is_active: branch?.is_active ?? true,
    });

    function set(field: string, value: string | boolean) {
        setForm(f => ({ ...f, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const supabase = createClient();
        const payload = {
            ...form,
            code: form.code.toLowerCase().replace(/[^a-z0-9]/g, ""),
            updated_at: new Date().toISOString(),
        };

        const { error } = branch
            ? await supabase.from("rt_branches").update(payload).eq("id", branch.id)
            : await supabase.from("rt_branches").insert(payload);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/admin/branches");
            router.refresh();
        }
    }

    async function handleDelete() {
        if (!branch || !confirm("Bu şubeyi silmek istediğinizden emin misiniz?")) return;
        const supabase = createClient();
        await supabase.from("rt_branches").delete().eq("id", branch.id);
        router.push("/admin/branches");
    }

    const fields = [
        { id: "name", label: "Şube Adı *", placeholder: "Kebapçı Mustafa - İzmit Metro" },
        { id: "code", label: "Kısa Kod * (URL'de kullanılır)", placeholder: "im" },
        { id: "address", label: "Adres", placeholder: "Köseköy, 41135 Kartepe/Kocaeli" },
        { id: "phone", label: "Telefon", placeholder: "+90 262 000 00 00" },
        { id: "working_hours", label: "Çalışma Saatleri", placeholder: "10:00 - 23:30" },
        { id: "whatsapp_number", label: "WhatsApp Numarası", placeholder: "+905320000000" },
        { id: "google_maps_url", label: "Google Maps URL", placeholder: "https://maps.google.com/..." },
        { id: "google_review_url", label: "Google Yorum URL", placeholder: "https://g.page/r/..." },
        { id: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
        { id: "website_url", label: "Web Sitesi URL", placeholder: "https://..." },
    ] as const;

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Temel Bilgiler</h2>
                {fields.slice(0, 2).map(f => (
                    <div key={f.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <input
                            type="text"
                            value={form[f.id as keyof typeof form] as string}
                            onChange={e => set(f.id, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                ))}
                {/* Label Color */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Masa No Arka Plan Rengi</label>
                    <div className="flex gap-2 flex-wrap">
                        {COLOR_OPTIONS.map(c => (
                            <button
                                key={c.value}
                                type="button"
                                title={c.label}
                                onClick={() => set("label_color", c.value)}
                                className="w-8 h-8 rounded-full border-2 transition-all"
                                style={{
                                    background: c.value,
                                    borderColor: form.label_color === c.value ? "#111" : "transparent",
                                    transform: form.label_color === c.value ? "scale(1.2)" : "scale(1)",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">İletişim & Konum</h2>
                {fields.slice(2).map(f => (
                    <div key={f.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <input
                            type="text"
                            value={form[f.id as keyof typeof form] as string}
                            onChange={e => set(f.id, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                ))}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} className="rounded" />
                    <span className="text-sm text-gray-700">Şube aktif</span>
                </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-60"
                    style={{ background: "#C0392B" }}
                >
                    {loading ? "Kaydediliyor..." : branch ? "Güncelle" : "Şube Oluştur"}
                </button>
                <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-gray-600 text-sm hover:bg-gray-100">
                    İptal
                </button>
                {branch && (
                    <button type="button" onClick={handleDelete} className="ml-auto px-4 py-2.5 rounded-lg text-red-600 text-sm hover:bg-red-50">
                        Şubeyi Sil
                    </button>
                )}
            </div>
        </form>
    );
}
