import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import BranchForm from "@/components/admin/BranchForm";

export default async function EditBranchPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = await params;
    const supabase = await createClient();
    const { data: branch } = await supabase
        .from("rt_branches")
        .select("*")
        .eq("id", branchId)
        .single();

    if (!branch) notFound();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">{branch.name}</h1>
            <BranchForm branch={branch} />
        </div>
    );
}
