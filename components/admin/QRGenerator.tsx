"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createClient } from "@/utils/supabase/client";
import { Download } from "lucide-react";
import type { Table } from "@/types";

type Branch = { id: string; name: string; code: string; label_color: string | null };

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://001.qrbir.com";

/**
 * SVG şablonuna QR dataURL ve masa numarasını yerleştirip PNG Blob döner.
 * Template'te `id="qr-dots"` olan grup ve `M-2` metni değiştirilir.
 */
async function buildLabelPng(template: string, qrDataUrl: string, tableNumber: number): Promise<Blob> {
    const updated = template
        // QR nokta grubunu <image> ile değiştir
        .replace(
            /<g id="qr-dots">[\s\S]*?<\/g>/,
            `<image href="${qrDataUrl}" x="34.29" y="16.73" width="73.14" height="73.14"/>`,
        )
        // Masa numarasını güncelle
        .replace(
            /<tspan x="0" y="0">M-2<\/tspan>/,
            `<tspan x="0" y="0">M-${tableNumber}</tspan>`,
        );

    const blob = new Blob([updated], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // 4× büyütme → baskı kalitesi (≈567px)
            const scale = 4;
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth * scale;
            canvas.height = img.naturalHeight * scale;
            const ctx = canvas.getContext("2d")!;
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            canvas.toBlob(
                b => (b ? resolve(b) : reject(new Error("toBlob başarısız"))),
                "image/png",
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("SVG yüklenemedi"));
        };
        img.src = url;
    });
}

export default function QRGenerator({ branches }: { branches: Branch[] }) {
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(false);
    const [svgTemplate, setSvgTemplate] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);

    // SVG şablonunu bir kez yükle
    useEffect(() => {
        fetch("/KebapciMustafa-QR.svg")
            .then(r => r.text())
            .then(setSvgTemplate)
            .catch(err => console.error("SVG şablon yüklenemedi:", err));
    }, []);

    async function selectBranch(branch: Branch) {
        setSelectedBranch(branch);
        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase
            .from("rt_tables")
            .select("*")
            .eq("branch_id", branch.id)
            .eq("is_active", true)
            .order("table_number");
        setTables(data ?? []);
        setLoading(false);
    }

    function getQrDataUrl(tableId: string): string | null {
        const canvas = document.getElementById(`qr-${tableId}`) as HTMLCanvasElement | null;
        return canvas ? canvas.toDataURL("image/png") : null;
    }

    async function downloadSingle(table: Table) {
        const qrDataUrl = getQrDataUrl(table.id);
        if (!qrDataUrl) return;

        const link = document.createElement("a");
        link.download = `${selectedBranch!.code}-masa-${table.table_number}.png`;

        if (svgTemplate) {
            const blob = await buildLabelPng(svgTemplate, qrDataUrl, table.table_number);
            link.href = URL.createObjectURL(blob);
        } else {
            link.href = qrDataUrl;
        }
        link.click();
    }

    async function downloadAll() {
        if (!selectedBranch || !tables.length) return;
        setDownloading(true);
        try {
            const JSZip = (await import("jszip")).default;
            const { saveAs } = await import("file-saver");
            const zip = new JSZip();

            for (const table of tables) {
                const qrDataUrl = getQrDataUrl(table.id);
                if (!qrDataUrl) continue;

                let blob: Blob;
                if (svgTemplate) {
                    blob = await buildLabelPng(svgTemplate, qrDataUrl, table.table_number);
                } else {
                    const c = document.getElementById(`qr-${table.id}`) as HTMLCanvasElement;
                    blob = await new Promise<Blob>(res => c.toBlob(b => res(b!)));
                }
                zip.file(`${selectedBranch.code}-masa-${table.table_number}.png`, blob);
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${selectedBranch.code}-qr-etiketler.zip`);
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Şube seçimi */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 text-sm mb-3">Şube Seç</h2>
                <div className="flex gap-2 flex-wrap">
                    {branches.map(b => (
                        <button
                            key={b.id}
                            onClick={() => selectBranch(b)}
                            className="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all"
                            style={{
                                borderColor: selectedBranch?.id === b.id ? (b.label_color ?? "#C0392B") : "#E5E7EB",
                                background: selectedBranch?.id === b.id ? (b.label_color ?? "#C0392B") : "white",
                                color: selectedBranch?.id === b.id ? "white" : "#374151",
                            }}
                        >
                            {b.name}
                        </button>
                    ))}
                </div>
                {svgTemplate && (
                    <p className="text-xs text-gray-400 mt-3">
                        ✓ Etiket şablonu yüklendi — indirmeler orijinal tasarımı kullanır
                    </p>
                )}
            </div>

            {/* QR Grid */}
            {selectedBranch && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-gray-900 text-sm">
                            {tables.length} Masa — {svgTemplate ? "Hazır Etiket" : "QR Kodu"} İndir
                        </h2>
                        {tables.length > 0 && (
                            <button
                                onClick={downloadAll}
                                disabled={downloading}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60 transition-opacity"
                                style={{ background: "#C0392B" }}
                            >
                                <Download className="w-4 h-4" />
                                {downloading ? "Hazırlanıyor…" : "Tümünü İndir (ZIP)"}
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <p className="text-sm text-gray-400 text-center py-8">Yükleniyor…</p>
                    ) : !tables.length ? (
                        <p className="text-sm text-gray-400 text-center py-8">Bu şubede masa bulunamadı.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tables.map(table => {
                                const url = `${BASE_URL}/${selectedBranch.code}/${table.table_number}`;
                                return (
                                    <div
                                        key={table.id}
                                        className="border border-gray-100 rounded-xl p-3 text-center hover:border-gray-300 transition-colors"
                                    >
                                        {/* Önizleme için gizli canvas */}
                                        <div className="flex justify-center mb-2">
                                            <QRCodeCanvas
                                                id={`qr-${table.id}`}
                                                value={url}
                                                size={140}
                                                bgColor="#ffffff"
                                                fgColor="#1a1a1a"
                                                level="M"
                                            />
                                        </div>
                                        {/* Masa badge */}
                                        <div
                                            className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-1"
                                            style={{ background: selectedBranch.label_color ?? "#C0392B" }}
                                        >
                                            M-{table.table_number}
                                        </div>
                                        <p className="text-xs text-gray-400 break-all mb-2">{url}</p>
                                        <button
                                            onClick={() => downloadSingle(table)}
                                            className="flex items-center gap-1 mx-auto text-xs text-gray-500 hover:text-gray-900 transition-colors"
                                        >
                                            <Download className="w-3 h-3" />
                                            {svgTemplate ? "Etiket İndir" : "İndir"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
