import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ChipFlavorCard, ChipFlavor } from '@/components/ChipFlavorCard';
import { AddFlavorForm } from '@/components/AddFlavorForm';
import { FlavorStats } from '@/components/FlavorStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Download, Upload } from 'lucide-react';

const Index = () => {
  const [flavors, setFlavors] = useState<ChipFlavor[]>([
    { id: '1', name: 'Cool Ranch Doritos', category: 'cheesy', brand: 'Doritos' },
    { id: '2', name: 'Flamin\' Hot Cheetos', category: 'spicy', brand: 'Cheetos' },
    { id: '3', name: 'Original Lays', category: 'classic', brand: 'Lays' },
    { id: '4', name: 'BBQ Pringles', category: 'bbq', brand: 'Pringles' },
  ]);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFlavors((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const addFlavor = (flavorData: Omit<ChipFlavor, 'id'>) => {
    const newFlavor: ChipFlavor = {
      ...flavorData,
      id: Date.now().toString(),
    };
    setFlavors([...flavors, newFlavor]);
    toast({
      title: "Flavor added!",
      description: `${newFlavor.name} has been added to your ranking.`,
    });
  };

  const removeFlavor = (id: string) => {
    const flavor = flavors.find(f => f.id === id);
    setFlavors(flavors.filter(f => f.id !== id));
    toast({
      title: "Flavor removed",
      description: `${flavor?.name} has been removed from your ranking.`,
    });
  };

  const clearAll = () => {
    setFlavors([]);
    toast({
      title: "All flavors cleared",
      description: "Your ranking list has been reset.",
    });
  };

  const exportRanking = () => {
    const rankingData = {
      ranking: flavors.map((flavor, index) => ({
        rank: index + 1,
        ...flavor,
      })),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(rankingData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chip-flavor-ranking.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Ranking exported!",
      description: "Your chip flavor ranking has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-bg)] p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-[var(--gradient-warm)] bg-clip-text text-transparent">
            🥔 Chip Flavor Ranker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drag and drop to rank your favorite chip flavors from best to worst. 
            Create your ultimate snack tier list!
          </p>
        </div>

        {/* Stats */}
        <FlavorStats flavors={flavors} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Flavor Form */}
          <div className="lg:col-span-1">
            <AddFlavorForm onAdd={addFlavor} />
            
            {flavors.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={exportRanking} variant="outline" className="w-full" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Ranking
                  </Button>
                  <Button onClick={clearAll} variant="outline" className="w-full" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ranking List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Your Chip Flavor Ranking
                  {flavors.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      ({flavors.length} flavor{flavors.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </CardTitle>
                {flavors.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Drag the cards to reorder your ranking. #1 is your absolute favorite!
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {flavors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🥔</div>
                    <h3 className="text-lg font-semibold mb-2">No flavors added yet</h3>
                    <p className="text-muted-foreground">
                      Add your first chip flavor to get started with ranking!
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={flavors} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {flavors.map((flavor, index) => (
                          <ChipFlavorCard
                            key={flavor.id}
                            flavor={flavor}
                            rank={index + 1}
                            onRemove={removeFlavor}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
