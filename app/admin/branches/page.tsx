import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Building2, ChevronRight } from "lucide-react";
import type { Branch } from "@/types";

export default async function BranchesPage() {
    const supabase = await createClient();
    const { data: branches } = await supabase
        .from("rt_branches")
        .select("*")
        .order("sort_order");

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Şubeler</h1>
                    <p className="text-sm text-gray-500 mt-1">{branches?.length ?? 0} şube</p>
                </div>
                <Link
                    href="/admin/branches/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ background: "#C0392B" }}
                >
                    <Plus className="w-4 h-4" />
                    Yeni Şube
                </Link>
            </div>

            {!branches?.length ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Henüz şube eklenmemiş.</p>
                    <Link href="/admin/branches/new" className="text-sm font-medium mt-2 inline-block" style={{ color: "#C0392B" }}>
                        İlk şubeyi ekle →
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {branches.map((branch: Branch) => (
                        <div key={branch.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                                    style={{ background: branch.label_color ?? "#C0392B" }}
                                >
                                    {branch.code.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{branch.name}</p>
                                    <p className="text-sm text-gray-400">{branch.address ?? "Adres girilmemiş"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/admin/branches/${branch.id}/tables`}
                                    className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Masalar
                                </Link>
                                <Link
                                    href={`/admin/branches/${branch.id}`}
                                    className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                    style={{ color: "#C0392B" }}
                                >
                                    Düzenle <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
