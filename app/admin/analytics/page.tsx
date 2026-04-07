import { createClient } from "@/utils/supabase/server";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default async function AnalyticsPage() {
    const supabase = await createClient();

    const [{ data: branches }, { data: scans }, { data: clicks }, { data: feedback }] = await Promise.all([
        supabase.from("rt_branches").select("id, name, code, label_color").order("sort_order"),
        supabase.from("rt_scans").select("id, scanned_at, branch_id, table_id, device").order("scanned_at", { ascending: false }),
        supabase.from("rt_link_clicks").select("id, clicked_at, branch_id, link_type").order("clicked_at", { ascending: false }),
        supabase.from("rt_feedback").select("id, rating, branch_id").eq("is_read", false),
    ]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics</h1>
            <AnalyticsDashboard
                branches={branches ?? []}
                scans={scans ?? []}
                clicks={clicks ?? []}
                unreadFeedbackCount={feedback?.length ?? 0}
            />
        </div>
    );
}
