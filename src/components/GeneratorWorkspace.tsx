'use client';

import { useCallback, useEffect, useState } from 'react';
import { DesignerProvider, useDesigner } from '@/context/DesignerContext';
import { StickerDesigner } from '@/components/StickerDesigner';
import type { ContentType, DesignerState } from '@/lib/core/schemas';

interface GeneratorWorkspaceProps {
  initialContentType?: ContentType;
  editId?: string;
  presetPatch?: Partial<DesignerState>;
}

// Applies a preset patch on mount — must run inside DesignerProvider
function PresetLoader({ patch }: { patch: Partial<DesignerState> }) {
  const { dispatch } = useDesigner();
  useEffect(() => {
    dispatch({ type: 'LOAD_PRESET', payload: patch });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// Fetches QR data and dispatches LOAD_QR — must run inside DesignerProvider
function EditLoader({
  editId,
  onTitleLoaded,
}: {
  editId: string;
  onTitleLoaded: (title: string) => void;
}) {
  const { dispatch } = useDesigner();

  useEffect(() => {
    async function loadQr() {
      const res = await fetch(`/api/qr/${editId}`);
      if (!res.ok) return; // silently ignore — designer stays at default
      const qrCode = await res.json();

      // Reconstruct DesignerState from persisted shape
      const design = qrCode.design ?? {};
      const style = (design.style ?? {}) as Record<string, unknown>;

      const state: DesignerState = {
        content: qrCode.content?.payload ?? { type: 'url', url: '' },
        qrStyle: (style.qrStyle ?? {}) as DesignerState['qrStyle'],
        shapeId: design.shapeId ?? 'rounded-rect',
        frameId: design.frameId ?? undefined,
        ctaBandColor: (style.ctaBandColor as string | null) ?? undefined,
        decorativeColor: (style.decorativeColor as string | null) ?? undefined,
        backgroundColor: (style.backgroundColor as string) ?? '#FFFFFF',
        borderColor: (style.borderColor as string) ?? '#000000',
        borderWidth: (style.borderWidth as number) ?? 0,
        cta: (style.cta ?? {}) as DesignerState['cta'],
      };

      dispatch({ type: 'LOAD_QR', payload: state });
      onTitleLoaded(qrCode.title ?? '');
    }
    loadQr();
  }, [editId, dispatch, onTitleLoaded]);

  return null;
}

export function GeneratorWorkspace({ initialContentType, editId, presetPatch }: GeneratorWorkspaceProps) {
  const [editTitle, setEditTitle] = useState('');
  const handleTitleLoaded = useCallback((title: string) => setEditTitle(title), []);

  return (
    <DesignerProvider initialContentType={initialContentType}>
      {presetPatch && !editId && <PresetLoader patch={presetPatch} />}
      {editId && <EditLoader editId={editId} onTitleLoaded={handleTitleLoaded} />}
      <StickerDesigner editId={editId} editTitle={editTitle} />
    </DesignerProvider>
  );
}
