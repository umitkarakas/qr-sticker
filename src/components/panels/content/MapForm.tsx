'use client';

import React from 'react';
import { useDesigner } from '@/context/DesignerContext';
import { FormField } from './FormField';
import type { ContentData } from '@/lib/core/schemas';

export function MapForm() {
  const { state, dispatch } = useDesigner();
  const content = state.content as Extract<ContentData, { type: 'location' }>;

  const update = (patch: Partial<typeof content>) =>
    dispatch({ type: 'SET_CONTENT', payload: { ...content, ...patch } as ContentData });

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Google Maps Linki">
        <input
          type="url"
          value={content.url}
          onChange={(e) => update({ url: e.target.value })}
          placeholder="https://maps.google.com/..."
          className="input"
        />
      </FormField>
    </div>
  );
}
