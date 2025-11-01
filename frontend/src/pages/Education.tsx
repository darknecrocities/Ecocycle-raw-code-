import { useGetEducationalContent } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Lightbulb, Leaf, Recycle, Droplet, Zap, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Education() {
  const { data: educationalContent } = useGetEducationalContent();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Predefined eco-tips and facts
  const ecoTips = [
    {
      icon: Recycle,
      title: 'Reduce, Reuse, Recycle',
      content: 'Always follow the 3 Rs in order: First reduce consumption, then reuse items, and finally recycle what you can\'t reuse.',
      category: 'General',
    },
    {
      icon: Leaf,
      title: 'Composting Benefits',
      content: 'Composting organic waste reduces methane emissions from landfills and creates nutrient-rich soil for gardening.',
      category: 'Composting',
    },
    {
      icon: Droplet,
      title: 'Water Conservation',
      content: 'Fix leaky faucets and use water-efficient appliances to save thousands of gallons of water per year.',
      category: 'Conservation',
    },
    {
      icon: Zap,
      title: 'Energy Efficiency',
      content: 'Switch to LED bulbs and unplug devices when not in use to reduce energy consumption by up to 75%.',
      category: 'Energy',
    },
    {
      icon: Recycle,
      title: 'Plastic Alternatives',
      content: 'Choose reusable bags, bottles, and containers to significantly reduce single-use plastic waste.',
      category: 'Recycling',
    },
    {
      icon: Cpu,
      title: 'E-Waste Recycling',
      content: 'Properly recycle electronics to recover valuable materials and prevent toxic substances from entering landfills.',
      category: 'Electronics',
    },
  ];

  const ecoFacts = [
    'Recycling one aluminum can saves enough energy to power a TV for 3 hours.',
    'Composting can divert up to 30% of household waste from landfills.',
    'It takes 450 years for a plastic bottle to decompose in a landfill.',
    'Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
    'Glass can be recycled endlessly without loss of quality or purity.',
    'E-waste is the fastest growing waste stream globally, with only 20% being recycled.',
    'Proper waste sorting can increase recycling rates by up to 50%.',
    'Organic waste in landfills produces methane, a greenhouse gas 25x more potent than CO2.',
    'One ton of recycled electronics can yield more gold than 17 tons of gold ore.',
    'Electronics contain valuable materials like gold, silver, copper, and rare earth elements.',
  ];

  // Rotate tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % ecoTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = ecoTips[currentTipIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Learn & Grow</h1>
        <p className="text-muted-foreground text-lg">
          Discover tips, facts, and best practices for sustainable waste management.
        </p>
      </div>

      {/* Featured Rotating Tip */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent overflow-hidden">
        <div className="relative">
          <img
            src="/assets/generated/education-header.dim_600x200.png"
            alt="Education"
            className="w-full h-32 object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <currentTip.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{currentTip.title}</CardTitle>
              <CardDescription>Tip of the moment • {currentTip.category}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{currentTip.content}</p>
          <div className="flex gap-1 mt-4">
            {ecoTips.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  index === currentTipIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="tips" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tips">Eco Tips</TabsTrigger>
          <TabsTrigger value="facts">Eco Facts</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
        </TabsList>

        {/* Eco Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecoTips.map((tip, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <tip.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                  <CardDescription>{tip.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Eco Facts Tab */}
        <TabsContent value="facts" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {ecoFacts.map((fact, index) => (
              <Card
                key={index}
                className="border-2 hover:border-accent/50 transition-all hover:shadow-lg"
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-sm">{fact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/recycling-bin-icon-transparent.dim_64x64.png"
                  alt="Recycling"
                  className="h-12 w-12"
                />
                <div>
                  <CardTitle>Recycling Guide</CardTitle>
                  <CardDescription>Learn what can and cannot be recycled</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-success mb-2">✓ Can Be Recycled:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Paper, cardboard, and newspapers</li>
                  <li>Glass bottles and jars</li>
                  <li>Aluminum and steel cans</li>
                  <li>Plastic bottles and containers (check local guidelines)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-destructive mb-2">✗ Cannot Be Recycled:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Food-contaminated paper or cardboard</li>
                  <li>Plastic bags and film</li>
                  <li>Styrofoam and foam packaging</li>
                  <li>Broken glass or ceramics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/compost-bin-icon-transparent.dim_64x64.png"
                  alt="Composting"
                  className="h-12 w-12"
                />
                <div>
                  <CardTitle>Composting Guide</CardTitle>
                  <CardDescription>Turn organic waste into nutrient-rich soil</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-success mb-2">✓ Compostable:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Fruit and vegetable scraps</li>
                  <li>Coffee grounds and tea bags</li>
                  <li>Eggshells and nutshells</li>
                  <li>Yard waste (leaves, grass clippings)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-destructive mb-2">✗ Not Compostable:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Meat, fish, and dairy products</li>
                  <li>Oils and fats</li>
                  <li>Pet waste</li>
                  <li>Diseased plants</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/hazardous-waste-icon-transparent.dim_64x64.png"
                  alt="Hazardous"
                  className="h-12 w-12"
                />
                <div>
                  <CardTitle>Hazardous Waste Guide</CardTitle>
                  <CardDescription>Proper disposal of dangerous materials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hazardous waste requires special handling and should never be thrown in regular trash or recycling bins.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Common Hazardous Items:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Batteries (all types)</li>
                  <li>Paint, solvents, and chemicals</li>
                  <li>Fluorescent bulbs and CFLs</li>
                  <li>Motor oil and automotive fluids</li>
                  <li>Pesticides and herbicides</li>
                </ul>
              </div>
              <p className="text-sm text-warning">
                ⚠️ Contact your local waste management facility for proper disposal locations and procedures.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/electronics-waste-icon-transparent.dim_64x64.png"
                  alt="Electronics"
                  className="h-12 w-12"
                />
                <div>
                  <CardTitle>Electronics Waste (E-Waste) Guide</CardTitle>
                  <CardDescription>Responsible disposal of electronic devices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Electronic waste contains valuable materials and hazardous substances that require specialized recycling.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Common E-Waste Items:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Smartphones, tablets, and computers</li>
                  <li>TVs, monitors, and displays</li>
                  <li>Printers, scanners, and office equipment</li>
                  <li>Gaming consoles and accessories</li>
                  <li>Small appliances and chargers</li>
                  <li>Batteries and power banks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-success mb-2">✓ Best Practices:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Remove personal data before recycling</li>
                  <li>Find certified e-waste recycling centers</li>
                  <li>Consider donating working electronics</li>
                  <li>Check manufacturer take-back programs</li>
                  <li>Never throw electronics in regular trash</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm font-medium">
                  💡 Did you know? Recycling electronics recovers precious metals like gold, silver, and copper, reducing the need for mining!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Backend Educational Content */}
      {educationalContent && educationalContent.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Additional Resources
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {educationalContent.map((content) => (
              <Card key={Number(content.id)} className="border-2">
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                  <CardDescription>{content.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{content.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
