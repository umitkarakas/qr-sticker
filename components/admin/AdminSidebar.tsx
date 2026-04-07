"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Building2, QrCode, MessageSquare, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navItems = [
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/branches", label: "Şubeler & Masalar", icon: Building2 },
    { href: "/admin/qr", label: "QR Kodlar", icon: QrCode },
    { href: "/admin/feedback", label: "Geri Bildirimler", icon: MessageSquare },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    }

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "#C0392B" }}>
                        01
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">Kebapçı Mustafa</p>
                        <p className="text-xs text-gray-400">Yönetim Paneli</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                active
                                    ? "text-white"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            style={active ? { background: "#C0392B" } : {}}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 truncate mb-3">{userEmail}</p>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
