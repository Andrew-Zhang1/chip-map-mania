import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { ChipFlavor } from './ChipFlavorCard';

interface AddFlavorFormProps {
  onAdd: (flavor: Omit<ChipFlavor, 'id'>) => void;
}

const categories = [
  { value: 'classic', label: 'Original' },
  { value: 'spicy', label: 'Spicy' },
  { value: 'cheesy', label: 'Cheesy' },
  { value: 'bbq', label: 'BBQ' },
  { value: 'salt', label: 'Salt & Vinegar' },
  { value: 'other', label: 'Other' },
] as const;

export function AddFlavorForm({ onAdd }: AddFlavorFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ChipFlavor['category']>('classic');
  const [brand, setBrand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        category,
        brand: brand.trim() || undefined,
      });
      setName('');
      setBrand('');
      setCategory('classic');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Flavor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Flavor Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cool Ranch Doritos"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ChipFlavor['category'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Brand (Optional)</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g., Doritos, Lays, Pringles"
            />
          </div>
          
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Flavor
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}