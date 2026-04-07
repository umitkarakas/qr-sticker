import { createClient } from "@/utils/supabase/server";
import FeedbackList from "@/components/admin/FeedbackList";

export default async function FeedbackPage() {
    const supabase = await createClient();

    const [{ data: branches }, { data: feedback }] = await Promise.all([
        supabase.from("rt_branches").select("id, name").order("sort_order"),
        supabase
            .from("rt_feedback")
            .select("*, rt_tables(table_number), rt_branches(name)")
            .order("created_at", { ascending: false })
            .limit(200),
    ]);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Geri Bildirimler</h1>
                    <p className="text-sm text-gray-500 mt-1">{feedback?.length ?? 0} kayıt</p>
                </div>
            </div>
            <FeedbackList branches={branches ?? []} feedbackItems={feedback ?? []} />
        </div>
    );
}
