"use client";

import { useState } from "react";
import { MessageSquare, Star, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function FeedbackModal({ branchId, tableId }: { branchId: string; tableId: string }) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!message.trim()) return;
        setLoading(true);
        const supabase = createClient();
        await supabase.from("rt_feedback").insert({
            branch_id: branchId,
            table_id: tableId,
            name: name || null,
            phone: phone || null,
            rating: rating || null,
            message,
        });
        await supabase.from("rt_link_clicks").insert({
            branch_id: branchId,
            table_id: tableId,
            link_type: "feedback",
        });
        setSent(true);
        setLoading(false);
    }

    return (
        <div className="px-4 mt-3">
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-white shadow-sm active:scale-95 transition-transform"
                style={{ background: "#6C3483" }}
            >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-sm">Geri Bildirim Gönderin</span>
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
                    <div className="relative bg-white rounded-t-3xl w-full max-w-lg p-6 pb-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Geri Bildirim</h2>
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {sent ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">🙏</div>
                                <p className="font-semibold text-gray-900">Teşekkürler!</p>
                                <p className="text-sm text-gray-500 mt-1">Geri bildiriminiz iletildi.</p>
                                <button onClick={() => setOpen(false)} className="mt-4 px-6 py-2 rounded-lg text-white text-sm" style={{ background: "#C0392B" }}>
                                    Kapat
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Puanınız</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button key={n} type="button" onClick={() => setRating(n)}>
                                                <Star
                                                    className="w-8 h-8 transition-colors"
                                                    fill={n <= rating ? "#FBBC04" : "none"}
                                                    stroke={n <= rating ? "#FBBC04" : "#D1D5DB"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız *</label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        required
                                        rows={3}
                                        placeholder="Deneyiminizi paylaşın..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="İsteğe bağlı" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="İsteğe bağlı" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
                                    style={{ background: "#C0392B" }}
                                >
                                    {loading ? "Gönderiliyor..." : "Gönder"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
