'use client';

import React from 'react';
import { useDesigner } from '@/context/DesignerContext';
import { FormField } from './FormField';
import type { ContentData } from '@/lib/core/schemas';

export function WhatsAppForm() {
  const { state, dispatch } = useDesigner();
  const content = state.content as Extract<ContentData, { type: 'whatsapp' }>;

  const update = (patch: Partial<typeof content>) =>
    dispatch({ type: 'SET_CONTENT', payload: { ...content, ...patch } as ContentData });

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Telefon Numarası">
        <input
          type="tel"
          value={content.phone}
          onChange={(e) => update({ phone: e.target.value })}
          placeholder="+905001234567"
          className="input"
        />
      </FormField>
      <FormField label="Mesaj (opsiyonel)">
        <input
          type="text"
          value={content.message ?? ''}
          onChange={(e) => update({ message: e.target.value || undefined })}
          placeholder="Merhaba!"
          className="input"
        />
      </FormField>
    </div>
  );
}
