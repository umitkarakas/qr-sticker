"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

type Branch = { id: string; name: string; code: string; label_color: string | null };
type Scan = { id: string; scanned_at: string; branch_id: string; table_id: string | null; device: string | null };
type Click = { id: string; clicked_at: string; branch_id: string; link_type: string };

const LINK_LABELS: Record<string, string> = {
    whatsapp: "WhatsApp",
    google_review: "Google Yorum",
    instagram: "Instagram",
    website: "Web Sitesi",
    feedback: "Geri Bildirim",
};

const LINK_COLORS: Record<string, string> = {
    whatsapp: "#25D366",
    google_review: "#FBBC04",
    instagram: "#E1306C",
    website: "#2C3E50",
    feedback: "#6C3483",
};

function stat(label: string, value: number | string, sub?: string) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

export default function AnalyticsDashboard({ branches, scans, clicks, unreadFeedbackCount }: {
    branches: Branch[];
    scans: Scan[];
    clicks: Click[];
    unreadFeedbackCount: number;
}) {
    const [branchFilter, setBranchFilter] = useState("all");
    const [range, setRange] = useState(30);

    const cutoff = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - range);
        return d.toISOString();
    }, [range]);

    const filteredScans = useMemo(() =>
        scans.filter(s =>
            s.scanned_at >= cutoff &&
            (branchFilter === "all" || s.branch_id === branchFilter)
        ), [scans, cutoff, branchFilter]);

    const filteredClicks = useMemo(() =>
        clicks.filter(c =>
            c.clicked_at >= cutoff &&
            (branchFilter === "all" || c.branch_id === branchFilter)
        ), [clicks, cutoff, branchFilter]);

    // Today scans
    const todayCutoff = new Date();
    todayCutoff.setHours(0, 0, 0, 0);
    const todayScans = filteredScans.filter(s => s.scanned_at >= todayCutoff.toISOString());

    // Scans by branch
    const scansByBranch = branches.map(b => ({
        name: b.name.split(" - ").pop() ?? b.name,
        tarama: filteredScans.filter(s => s.branch_id === b.id).length,
        fill: b.label_color ?? "#C0392B",
    }));

    // Daily scan trend
    const dailyMap: Record<string, number> = {};
    filteredScans.forEach(s => {
        const day = s.scanned_at.slice(0, 10);
        dailyMap[day] = (dailyMap[day] ?? 0) + 1;
    });
    const dailyData = Object.entries(dailyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14)
        .map(([date, count]) => ({ date: date.slice(5), tarama: count }));

    // Device split
    const mobile = filteredScans.filter(s => s.device === "mobile").length;
    const desktop = filteredScans.filter(s => s.device === "desktop").length;
    const deviceData = [
        { name: "Mobil", value: mobile },
        { name: "Masaüstü", value: desktop },
    ].filter(d => d.value > 0);

    // Click by type
    const clickByType = Object.entries(LINK_LABELS).map(([type, label]) => ({
        name: label,
        tıklama: filteredClicks.filter(c => c.link_type === type).length,
        fill: LINK_COLORS[type],
    })).filter(d => d.tıklama > 0);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <select
                    value={branchFilter}
                    onChange={e => setBranchFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                    <option value="all">Tüm Şubeler</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select
                    value={range}
                    onChange={e => setRange(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                    <option value={7}>Son 7 gün</option>
                    <option value={30}>Son 30 gün</option>
                    <option value={90}>Son 90 gün</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stat("Bugün Tarama", todayScans.length)}
                {stat("Toplam Tarama", filteredScans.length, `Son ${range} gün`)}
                {stat("Toplam Tıklama", filteredClicks.length, `Son ${range} gün`)}
                <Link href="/admin/feedback">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-300 transition-colors cursor-pointer">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Okunmamış Bildirim</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{unreadFeedbackCount}</p>
                        {unreadFeedbackCount > 0 && (
                            <p className="text-xs font-medium mt-1" style={{ color: "#C0392B" }}>Görüntüle →</p>
                        )}
                    </div>
                </Link>
            </div>

            {/* Daily trend */}
            {dailyData.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-900 text-sm mb-4">Günlük Tarama (Son 14 Gün)</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={dailyData}>
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="tarama" fill="#C0392B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* By branch */}
                {scansByBranch.some(b => b.tarama > 0) && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-900 text-sm mb-4">Şube Bazlı Tarama</h2>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={scansByBranch} layout="vertical">
                                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                                <Tooltip />
                                <Bar dataKey="tarama" radius={[0, 4, 4, 0]}>
                                    {scansByBranch.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Click by type */}
                {clickByType.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-900 text-sm mb-4">Link Tıklamaları</h2>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={clickByType}>
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="tıklama" radius={[4, 4, 0, 0]}>
                                    {clickByType.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Device */}
                {deviceData.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-900 text-sm mb-4">Cihaz Dağılımı</h2>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name ?? ""} ${(((percent as number | undefined) ?? 0) * 100).toFixed(0)}%`}>
                                    <Cell fill="#C0392B" />
                                    <Cell fill="#1A3A6B" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
