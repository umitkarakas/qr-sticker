import { createClient } from "@/utils/supabase/server";
import QRGenerator from "@/components/admin/QRGenerator";

export default async function QRPage() {
    const supabase = await createClient();
    const { data: branches } = await supabase
        .from("rt_branches")
        .select("id, name, code, label_color")
        .eq("is_active", true)
        .order("sort_order");

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">QR Kodlar</h1>
                <p className="text-sm text-gray-500 mt-1">Şube ve masa seçerek QR kodları önizleyin ve indirin.</p>
            </div>
            <QRGenerator branches={branches ?? []} />
        </div>
    );
}
