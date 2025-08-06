import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface ChipFlavor {
  id: string;
  name: string;
  category: 'classic' | 'spicy' | 'cheesy' | 'bbq' | 'salt';
  brand?: string;
}

interface ChipFlavorCardProps {
  flavor: ChipFlavor;
  rank: number;
  onRemove: (id: string) => void;
}

const categoryStyles = {
  classic: 'bg-chip-classic border-chip-classic/30',
  spicy: 'bg-chip-spicy border-chip-spicy/30',
  cheesy: 'bg-chip-cheesy border-chip-cheesy/30',
  bbq: 'bg-chip-bbq border-chip-bbq/30',
  salt: 'bg-chip-salt border-chip-salt/30',
};

const categoryLabels = {
  classic: 'Original',
  spicy: 'Spicy',
  cheesy: 'Cheesy',
  bbq: 'BBQ',
  salt: 'Salt & Vinegar',
};

export function ChipFlavorCard({ flavor, rank, onRemove }: ChipFlavorCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: flavor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        relative p-4 cursor-grab active:cursor-grabbing
        shadow-[var(--shadow-chip)] border-2
        ${categoryStyles[flavor.category]}
        ${isDragging ? 'opacity-50 shadow-[var(--shadow-elevated)]' : 'hover:shadow-[var(--shadow-elevated)]'}
        transition-all duration-200
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 font-bold text-sm">
              #{rank}
            </div>
            <GripVertical className="h-4 w-4 text-foreground/60" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{flavor.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-full bg-background/60 text-foreground/80">
                {categoryLabels[flavor.category]}
              </span>
              {flavor.brand && (
                <span className="text-foreground/60">{flavor.brand}</span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(flavor.id);
          }}
          className="h-8 w-8 p-0 hover:bg-destructive/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}