import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChipFlavor } from './ChipFlavorCard';
import { BarChart3, Award, Target } from 'lucide-react';

interface FlavorStatsProps {
  flavors: ChipFlavor[];
}

export function FlavorStats({ flavors }: FlavorStatsProps) {
  const categoryCount = flavors.reduce((acc, flavor) => {
    acc[flavor.category] = (acc[flavor.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0];
  const brandCount = flavors.filter(f => f.brand).length;

  const categoryLabels = {
    classic: 'Original',
    spicy: 'Spicy',
    cheesy: 'Cheesy',
    bbq: 'BBQ',
    salt: 'Salt & Vinegar',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Flavors</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{flavors.length}</div>
          <p className="text-xs text-muted-foreground">
            {flavors.length === 1 ? 'flavor' : 'flavors'} ranked
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategory ? categoryLabels[topCategory[0] as keyof typeof categoryLabels] : 'None'}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategory ? `${topCategory[1]} flavor${topCategory[1] !== 1 ? 's' : ''}` : 'Add some flavors!'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Brands</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{brandCount}</div>
          <p className="text-xs text-muted-foreground">
            {((brandCount / Math.max(flavors.length, 1)) * 100).toFixed(0)}% have brand info
          </p>
        </CardContent>
      </Card>

      {Object.keys(categoryCount).length > 0 && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryCount).map(([category, count]) => (
                <Badge key={category} variant="secondary" className="text-sm">
                  {categoryLabels[category as keyof typeof categoryLabels]}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}