'use client';

import React from 'react';
import { useDesigner } from '@/context/DesignerContext';
import { FormField } from './FormField';
import type { ContentData } from '@/lib/core/schemas';

export function WiFiForm() {
  const { state, dispatch } = useDesigner();
  const content = state.content as Extract<ContentData, { type: 'wifi' }>;

  const update = (patch: Partial<typeof content>) =>
    dispatch({ type: 'SET_CONTENT', payload: { ...content, ...patch } as ContentData });

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Ağ Adı (SSID)">
        <input
          type="text"
          value={content.ssid}
          onChange={(e) => update({ ssid: e.target.value })}
          placeholder="WiFi Adı"
          className="input"
        />
      </FormField>
      <FormField label="Şifre">
        <input
          type="text"
          value={content.password}
          onChange={(e) => update({ password: e.target.value })}
          placeholder="WiFi şifresi"
          className="input"
        />
      </FormField>
      <FormField label="Güvenlik">
        <select
          value={content.encryption}
          onChange={(e) => update({ encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
          className="input"
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Şifresiz</option>
        </select>
      </FormField>
    </div>
  );
}
