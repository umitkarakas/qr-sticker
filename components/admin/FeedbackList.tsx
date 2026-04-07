"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type FeedbackItem = {
    id: string;
    created_at: string;
    branch_id: string;
    name: string | null;
    phone: string | null;
    rating: number | null;
    message: string;
    is_read: boolean;
    rt_tables: { table_number: number } | null;
    rt_branches: { name: string } | null;
};

type Branch = { id: string; name: string };

export default function FeedbackList({ branches, feedbackItems: initial }: {
    branches: Branch[];
    feedbackItems: FeedbackItem[];
}) {
    const [items, setItems] = useState<FeedbackItem[]>(initial);
    const [branchFilter, setBranchFilter] = useState("all");
    const [showUnread, setShowUnread] = useState(false);

    async function markRead(id: string) {
        const supabase = createClient();
        await supabase.from("rt_feedback").update({ is_read: true }).eq("id", id);
        setItems(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
    }

    const filtered = items.filter(i =>
        (branchFilter === "all" || i.branch_id === branchFilter) &&
        (!showUnread || !i.is_read)
    );

    const unreadCount = items.filter(i => !i.is_read).length;

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-3 flex-wrap items-center">
                <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="all">Tüm Şubeler</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={showUnread} onChange={e => setShowUnread(e.target.checked)} className="rounded" />
                    Sadece okunmamışlar {unreadCount > 0 && <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full font-medium">{unreadCount}</span>}
                </label>
            </div>

            {!filtered.length ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
                    Geri bildirim bulunamadı.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(item => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl border p-5 transition-colors ${item.is_read ? "border-gray-100" : "border-red-200 bg-red-50/30"}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <span className="text-xs font-medium text-gray-500">
                                            {item.rt_branches?.name}
                                        </span>
                                        {item.rt_tables && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                Masa {item.rt_tables.table_number}
                                            </span>
                                        )}
                                        {item.rating && (
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <Star
                                                        key={n}
                                                        className="w-3.5 h-3.5"
                                                        fill={n <= item.rating! ? "#FBBC04" : "none"}
                                                        stroke={n <= item.rating! ? "#FBBC04" : "#D1D5DB"}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        <span className="text-xs text-gray-400 ml-auto">
                                            {new Date(item.created_at).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-900">{item.message}</p>
                                    {(item.name || item.phone) && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {[item.name, item.phone].filter(Boolean).join(" · ")}
                                        </p>
                                    )}
                                </div>
                                {!item.is_read && (
                                    <button
                                        onClick={() => markRead(item.id)}
                                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        <Check className="w-3 h-3" />
                                        Okundu
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
