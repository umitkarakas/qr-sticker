import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import TableManager from "@/components/admin/TableManager";
import type { Table } from "@/types";

export default async function TablesPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = await params;
    const supabase = await createClient();

    const { data: branch } = await supabase
        .from("rt_branches")
        .select("id, name, code, label_color")
        .eq("id", branchId)
        .single();

    if (!branch) notFound();

    const { data: tables } = await supabase
        .from("rt_tables")
        .select("*")
        .eq("branch_id", branchId)
        .order("table_number");

    return (
        <div>
            <div className="mb-8">
                <p className="text-sm text-gray-400 mb-1">Şube</p>
                <h1 className="text-2xl font-bold text-gray-900">{branch.name} — Masalar</h1>
            </div>
            <TableManager branch={branch} tables={tables ?? []} />
        </div>
    );
}
