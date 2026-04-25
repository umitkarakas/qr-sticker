import { useDesigner } from '@/context/DesignerContext';
import { SHAPES_BY_CATEGORY } from '@/lib/shapes';

export function ShapePanel() {
  const { state, dispatch } = useDesigner();

  return (
    <div className="flex flex-col gap-5">
      <ShapeGroup
        title="Geometrik"
        shapes={SHAPES_BY_CATEGORY.geometric}
        selected={state.shapeId}
        onSelect={(id) => dispatch({ type: 'SET_SHAPE', payload: id })}
      />
      <ShapeGroup
        title="Figüratif"
        shapes={SHAPES_BY_CATEGORY.figurative}
        selected={state.shapeId}
        onSelect={(id) => dispatch({ type: 'SET_SHAPE', payload: id })}
      />
    </div>
  );
}

function ShapeGroup({
  title,
  shapes,
  selected,
  onSelect,
}: {
  title: string;
  shapes: { id: string; name: string; viewBox: string; clipPath: string; outlinePath: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </label>
      <div className="grid grid-cols-5 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onSelect(shape.id)}
            title={shape.name}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              selected === shape.id
                ? 'bg-brand-blue shadow-md ring-2 ring-brand-blue/40'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {/* Mini SVG preview of the shape */}
            <svg
              viewBox={shape.viewBox}
              width="36"
              height="36"
              className="overflow-visible"
            >
              <path
                d={shape.clipPath}
                fill={selected === shape.id ? 'white' : '#6b7280'}
                fillOpacity={selected === shape.id ? 0.9 : 0.7}
              />
            </svg>
            <span
              className={`text-[10px] font-medium leading-tight text-center ${
                selected === shape.id ? 'text-white' : 'text-gray-600'
              }`}
            >
              {shape.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
