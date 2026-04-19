'use client';

import React from 'react';
import { useDesigner } from '@/context/DesignerContext';
import { FormField } from './FormField';
import type { ContentData } from '@/lib/core/schemas';

export function UrlForm() {
  const { state, dispatch } = useDesigner();
  const content = state.content as Extract<ContentData, { type: 'url' }>;

  const update = (patch: Partial<typeof content>) =>
    dispatch({ type: 'SET_CONTENT', payload: { ...content, ...patch } as ContentData });

  return (
    <div className="flex flex-col gap-3">
      <FormField label="URL">
        <input
          type="url"
          value={content.url}
          onChange={(e) => update({ url: e.target.value })}
          placeholder="https://example.com"
          className="input"
        />
      </FormField>
      <FormField label="Başlık (opsiyonel)">
        <input
          type="text"
          value={content.title ?? ''}
          onChange={(e) => update({ title: e.target.value || undefined })}
          placeholder="Örn: Web Sitemiz"
          className="input"
        />
      </FormField>
    </div>
  );
}
