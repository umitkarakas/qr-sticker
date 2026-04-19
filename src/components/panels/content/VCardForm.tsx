'use client';

import React from 'react';
import { useDesigner } from '@/context/DesignerContext';
import { FormField } from './FormField';
import type { ContentData } from '@/lib/core/schemas';

export function VCardForm() {
  const { state, dispatch } = useDesigner();
  const content = state.content as Extract<ContentData, { type: 'vcard' }>;

  const update = (patch: Partial<typeof content>) =>
    dispatch({ type: 'SET_CONTENT', payload: { ...content, ...patch } as ContentData });

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Ad">
        <input
          type="text"
          value={content.firstName}
          onChange={(e) => update({ firstName: e.target.value })}
          placeholder="Ad"
          className="input"
        />
      </FormField>
      <FormField label="Soyad">
        <input
          type="text"
          value={content.lastName ?? ''}
          onChange={(e) => update({ lastName: e.target.value })}
          placeholder="Soyad"
          className="input"
        />
      </FormField>
      <FormField label="Telefon (opsiyonel)">
        <input
          type="tel"
          value={content.phone ?? ''}
          onChange={(e) => update({ phone: e.target.value || undefined })}
          placeholder="+90..."
          className="input"
        />
      </FormField>
      <FormField label="E-posta (opsiyonel)">
        <input
          type="email"
          value={content.email ?? ''}
          onChange={(e) => update({ email: e.target.value || undefined })}
          placeholder="email@example.com"
          className="input"
        />
      </FormField>
      <FormField label="Web Sitesi (opsiyonel)">
        <input
          type="url"
          value={content.website ?? ''}
          onChange={(e) => update({ website: e.target.value || undefined })}
          placeholder="https://example.com"
          className="input"
        />
      </FormField>
      <FormField label="Şirket (opsiyonel)">
        <input
          type="text"
          value={content.org ?? ''}
          onChange={(e) => update({ org: e.target.value || undefined })}
          placeholder="Şirket adı"
          className="input"
        />
      </FormField>
    </div>
  );
}
