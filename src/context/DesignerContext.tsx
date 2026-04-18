'use client';

import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import type { DesignerState, ContentData, QrStyle, CtaConfig, ContentType } from '@/lib/core/schemas';
import { DEFAULT_DESIGNER_STATE } from '@/lib/core/schemas';
import { getDefaultContentTypeState } from '@/lib/core/content-types';

// ─── Actions ───

type DesignerAction =
  | { type: 'SET_CONTENT'; payload: ContentData }
  | { type: 'SET_QR_STYLE'; payload: Partial<QrStyle> }
  | { type: 'SET_SHAPE'; payload: string }
  | { type: 'SET_FRAME'; payload: string }
  | { type: 'CLEAR_FRAME' }
  | { type: 'SET_CTA_BAND_COLOR'; payload: string }
  | { type: 'SET_DECORATIVE_COLOR'; payload: string }
  | { type: 'SET_BACKGROUND_COLOR'; payload: string }
  | { type: 'SET_BORDER_COLOR'; payload: string }
  | { type: 'SET_BORDER_WIDTH'; payload: number }
  | { type: 'SET_CTA'; payload: Partial<CtaConfig> }
  | { type: 'RESET' };

function designerReducer(state: DesignerState, action: DesignerAction): DesignerState {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_QR_STYLE':
      return { ...state, qrStyle: { ...state.qrStyle, ...action.payload } };
    case 'SET_SHAPE':
      return { ...state, shapeId: action.payload };
    case 'SET_FRAME':
      return { ...state, frameId: action.payload };
    case 'CLEAR_FRAME':
      return { ...state, frameId: undefined, ctaBandColor: undefined, decorativeColor: undefined };
    case 'SET_CTA_BAND_COLOR':
      return { ...state, ctaBandColor: action.payload };
    case 'SET_DECORATIVE_COLOR':
      return { ...state, decorativeColor: action.payload };
    case 'SET_BACKGROUND_COLOR':
      return { ...state, backgroundColor: action.payload };
    case 'SET_BORDER_COLOR':
      return { ...state, borderColor: action.payload };
    case 'SET_BORDER_WIDTH':
      return { ...state, borderWidth: action.payload };
    case 'SET_CTA':
      return { ...state, cta: { ...state.cta, ...action.payload } };
    case 'RESET':
      return DEFAULT_DESIGNER_STATE;
    default:
      return state;
  }
}

// ─── Context ───

interface DesignerContextValue {
  state: DesignerState;
  dispatch: Dispatch<DesignerAction>;
}

const DesignerContext = createContext<DesignerContextValue | null>(null);

interface DesignerProviderProps {
  children: React.ReactNode;
  initialContentType?: ContentType;
}

export function DesignerProvider({ children, initialContentType }: DesignerProviderProps) {
  const initialState =
    initialContentType ? getDefaultContentTypeState(initialContentType) : DEFAULT_DESIGNER_STATE;
  const [state, dispatch] = useReducer(designerReducer, initialState);
  return (
    <DesignerContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignerContext.Provider>
  );
}

export function useDesigner(): DesignerContextValue {
  const ctx = useContext(DesignerContext);
  if (!ctx) throw new Error('useDesigner must be used inside DesignerProvider');
  return ctx;
}
