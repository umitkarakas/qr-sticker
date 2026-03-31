import { DesignerProvider } from '@/context/DesignerContext';
import { StickerDesigner } from '@/components/StickerDesigner';

export default function App() {
  return (
    <DesignerProvider>
      <StickerDesigner />
    </DesignerProvider>
  );
}
