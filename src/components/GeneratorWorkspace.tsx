'use client';

import { DesignerProvider } from '@/context/DesignerContext';
import { StickerDesigner } from '@/components/StickerDesigner';
import type { ContentType } from '@/lib/core/schemas';

interface GeneratorWorkspaceProps {
  initialContentType?: ContentType;
}

export function GeneratorWorkspace({ initialContentType }: GeneratorWorkspaceProps) {
  return (
    <DesignerProvider initialContentType={initialContentType}>
      <StickerDesigner />
    </DesignerProvider>
  );
}
