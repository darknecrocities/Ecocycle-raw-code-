import { useGetMyAnalytics, useGetMyWasteLogs } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Leaf, TrendingUp, Recycle } from 'lucide-react';

export default function Analytics() {
  const { data: analytics } = useGetMyAnalytics();
  const { data: wasteLogs } = useGetMyWasteLogs();

  const categoryData = analytics?.categoryBreakdown.map(([category, value]) => ({
    name: category.replace(/([A-Z])/g, ' $1').trim(),
    value: value,
  })) || [];

  const methodData = analytics?.methodBreakdown.map(([method, value]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: value,
  })) || [];

  const COLORS = [
    'oklch(0.65 0.18 155)', 
    'oklch(0.70 0.15 180)', 
    'oklch(0.75 0.12 120)', 
    'oklch(0.68 0.16 200)',
    'oklch(0.60 0.20 280)'
  ];

  const totalLogs = wasteLogs?.length || 0;
  const totalWaste = analytics?.totalWaste || 0;

  // Calculate environmental impact (simplified)
  const co2Saved = (totalWaste * 0.5).toFixed(1); // Rough estimate
  const treesEquivalent = Math.floor(totalWaste / 10);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-lg">
          Visualize your waste management trends and environmental impact.
        </p>
      </div>

      {/* Impact Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Waste Logged
            </CardTitle>
            <Recycle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWaste.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {totalLogs} logs
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CO₂ Saved
            </CardTitle>
            <Leaf className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{co2Saved} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated carbon offset
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trees Equivalent
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{treesEquivalent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Trees planted equivalent
            </p>
          </CardContent>
        </Card>
      </div>

      {totalLogs === 0 ? (
        <Card className="border-2">
          <CardContent className="text-center py-12 space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">No data to display yet</p>
              <p className="text-muted-foreground">Start logging waste to see your analytics</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Waste by Category</CardTitle>
              <CardDescription>Distribution of waste types you've logged</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: 'Weight (kg)',
                    color: 'oklch(0.65 0.18 155)',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Method Breakdown */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Disposal Methods</CardTitle>
              <CardDescription>How you've been disposing of waste</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: 'Weight (kg)',
                    color: 'oklch(0.65 0.18 155)',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={methodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="oklch(0.65 0.18 155)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Logs Table */}
      {totalLogs > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Waste Logs</CardTitle>
            <CardDescription>Your latest waste disposal activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wasteLogs?.slice(0, 10).map((log) => (
                <div key={Number(log.id)} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {log.category.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {log.quantity} kg • {log.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(Number(log.timestamp) / 1000000).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
