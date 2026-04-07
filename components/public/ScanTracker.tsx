"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ScanTracker({ branchId, tableId }: { branchId: string; tableId: string }) {
    useEffect(() => {
        const key = `scanned_${branchId}_${tableId}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");

        const ua = navigator.userAgent;
        const device = /Mobi|Android/i.test(ua) ? "mobile" : "desktop";
        const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac/.test(ua) ? "macOS" : "other";
        const browser = /Chrome/.test(ua) && !/Edge/.test(ua) ? "Chrome" : /Safari/.test(ua) && !/Chrome/.test(ua) ? "Safari" : /Firefox/.test(ua) ? "Firefox" : "other";

        const supabase = createClient();
        supabase.from("rt_scans").insert({ branch_id: branchId, table_id: tableId, device, os, browser, ua });
    }, [branchId, tableId]);

    return null;
}
