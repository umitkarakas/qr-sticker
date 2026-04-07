import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ScanTracker from "@/components/public/ScanTracker";
import ActionButtons from "@/components/public/ActionButtons";
import FeedbackModal from "@/components/public/FeedbackModal";

export async function generateMetadata({ params }: { params: Promise<{ branchCode: string; tableNumber: string }> }) {
    const { branchCode, tableNumber } = await params;
    return {
        title: `Masa ${tableNumber} — 01 Kebapçı Mustafa`,
        robots: "noindex",
    };
}

export default async function TableLandingPage({
    params,
}: {
    params: Promise<{ branchCode: string; tableNumber: string }>;
}) {
    const { branchCode, tableNumber } = await params;
    const supabase = await createClient();

    const { data: branch } = await supabase
        .from("rt_branches")
        .select("*")
        .eq("code", branchCode)
        .eq("is_active", true)
        .single();

    if (!branch) notFound();

    const { data: table } = await supabase
        .from("rt_tables")
        .select("*")
        .eq("branch_id", branch.id)
        .eq("table_number", parseInt(tableNumber))
        .eq("is_active", true)
        .single();

    if (!table) notFound();

    return (
        <div className="min-h-screen" style={{ background: "#FAF5F5" }}>
            {/* Header */}
            <div className="px-4 pt-8 pb-4 text-center">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-sm"
                    style={{ background: "#C0392B" }}
                >
                    01
                </div>
                <h1 className="text-xl font-bold text-gray-900">{branch.name}</h1>
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: branch.label_color ?? "#C0392B" }}>
                    Masa {table.table_number}
                    {table.label && ` — ${table.label}`}
                </div>
                {branch.working_hours && (
                    <p className="text-xs text-gray-400 mt-2">Çalışma saatleri: {branch.working_hours}</p>
                )}
            </div>

            {/* Action Buttons */}
            <ActionButtons branch={branch} table={table} />

            {/* Feedback section */}
            <FeedbackModal branchId={branch.id} tableId={table.id} />

            {/* Scan tracker (client-side, silent) */}
            <ScanTracker branchId={branch.id} tableId={table.id} />
        </div>
    );
}
