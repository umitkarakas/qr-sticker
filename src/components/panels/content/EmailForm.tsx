'use client';

import React from 'react';
import { useDesigner } from '@/context/DesignerContext';
import { FormField } from './FormField';
import type { ContentData } from '@/lib/core/schemas';

export function EmailForm() {
  const { state, dispatch } = useDesigner();
  const content = state.content as Extract<ContentData, { type: 'email' }>;

  const update = (patch: Partial<typeof content>) =>
    dispatch({ type: 'SET_CONTENT', payload: { ...content, ...patch } as ContentData });

  return (
    <div className="flex flex-col gap-3">
      <FormField label="E-posta">
        <input
          type="email"
          value={content.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="info@example.com"
          className="input"
        />
      </FormField>
      <FormField label="Konu (opsiyonel)">
        <input
          type="text"
          value={content.subject ?? ''}
          onChange={(e) => update({ subject: e.target.value || undefined })}
          placeholder="Konu"
          className="input"
        />
      </FormField>
      <FormField label="Mesaj (opsiyonel)">
        <textarea
          value={content.body ?? ''}
          onChange={(e) => update({ body: e.target.value || undefined })}
          placeholder="Mesaj içeriği..."
          rows={3}
          className="input resize-none"
        />
      </FormField>
    </div>
  );
}
