"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, CheckSquare, Square } from "lucide-react";
import type { Table } from "@/types";

type Branch = { id: string; name: string; code: string; label_color: string | null };

export default function TableManager({ branch, tables: initialTables }: { branch: Branch; tables: Table[] }) {
    const router = useRouter();
    const [tables, setTables] = useState<Table[]>(initialTables);
    const [bulkCount, setBulkCount] = useState("");
    const [loading, setLoading] = useState(false);

    async function addSingleTable() {
        const nextNum = tables.length > 0 ? Math.max(...tables.map(t => t.table_number)) + 1 : 1;
        await addTables([nextNum]);
    }

    async function addBulkTables() {
        const count = parseInt(bulkCount);
        if (!count || count < 1 || count > 100) return;
        const existingNums = new Set(tables.map(t => t.table_number));
        const newNums: number[] = [];
        let num = 1;
        while (newNums.length < count) {
            if (!existingNums.has(num)) newNums.push(num);
            num++;
        }
        await addTables(newNums);
        setBulkCount("");
    }

    async function addTables(numbers: number[]) {
        setLoading(true);
        const supabase = createClient();
        const rows = numbers.map(n => ({ branch_id: branch.id, table_number: n }));
        const { data, error } = await supabase.from("rt_tables").insert(rows).select();
        if (!error && data) {
            setTables(prev => [...prev, ...data].sort((a, b) => a.table_number - b.table_number));
        }
        setLoading(false);
    }

    async function toggleTable(table: Table) {
        const supabase = createClient();
        await supabase.from("rt_tables").update({ is_active: !table.is_active }).eq("id", table.id);
        setTables(prev => prev.map(t => t.id === table.id ? { ...t, is_active: !t.is_active } : t));
    }

    async function deleteTable(id: string) {
        if (!confirm("Bu masayı silmek istediğinizden emin misiniz?")) return;
        const supabase = createClient();
        await supabase.from("rt_tables").delete().eq("id", id);
        setTables(prev => prev.filter(t => t.id !== id));
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://001.qrbir.com";

    return (
        <div className="space-y-6">
            {/* Masa ekleme */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 text-sm mb-4">Masa Ekle</h2>
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={addSingleTable}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
                        style={{ background: "#C0392B" }}
                    >
                        <Plus className="w-4 h-4" />
                        Tek Masa Ekle
                    </button>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={bulkCount}
                            onChange={e => setBulkCount(e.target.value)}
                            placeholder="Adet"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                            onClick={addBulkTables}
                            disabled={loading || !bulkCount}
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40"
                        >
                            Toplu Ekle
                        </button>
                    </div>
                </div>
            </div>

            {/* Masa listesi */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900 text-sm">{tables.length} Masa</h2>
                </div>
                {!tables.length ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Henüz masa eklenmemiş.</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {tables.map(table => (
                            <div key={table.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                        style={{ background: branch.label_color ?? "#C0392B" }}
                                    >
                                        {table.table_number}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Masa {table.table_number}
                                            {table.label && <span className="text-gray-400 ml-1">— {table.label}</span>}
                                        </p>
                                        <p className="text-xs text-gray-400">{baseUrl}/{branch.code}/{table.table_number}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleTable(table)}
                                        className="text-gray-400 hover:text-gray-700 transition-colors"
                                        title={table.is_active ? "Pasif yap" : "Aktif yap"}
                                    >
                                        {table.is_active ? <CheckSquare className="w-4 h-4 text-green-500" /> : <Square className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => deleteTable(table.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
