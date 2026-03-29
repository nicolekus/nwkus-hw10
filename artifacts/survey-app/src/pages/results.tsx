import { useSurveyResponses } from "@/hooks/use-survey";
import { Card, Button } from "@/components/ui-custom";
import { Link } from "wouter";
import { Home, Loader2, AlertCircle } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { motion } from "framer-motion";

// Helper to count frequencies
const countFrequencies = (arr: string[]) => {
  const counts: Record<string, number> = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // sort descending
};

const countFrequenciesPreserveOrder = (arr: string[], order: string[]) => {
  const counts: Record<string, number> = {};
  order.forEach(o => counts[o] = 0); // initialize all to 0
  arr.forEach(item => {
    if (counts[item] !== undefined) {
      counts[item]++;
    }
  });
  return order.map(name => ({ name, count: counts[name] }));
};

export default function Results() {
  const { data: responses, isLoading, error } = useSurveyResponses();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-primary">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-lg font-medium animate-pulse">Loading live results...</p>
      </div>
    );
  }

  if (error || !responses) {
    return (
      <div className="max-w-xl mx-auto py-16">
        <Card className="p-8 text-center bg-destructive/5 border-destructive/20">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Results</h2>
          <p className="text-muted-foreground mb-6">{error?.message || "Failed to fetch survey data."}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const totalResponses = responses.length;

  if (totalResponses === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <Card className="p-12">
          <h2 className="text-3xl font-black mb-4">No Responses Yet</h2>
          <p className="text-muted-foreground mb-8">Be the first one to take the student stress survey!</p>
          <Link href="/survey">
            <Button>Take the Survey</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // --- Process Data for Charts ---

  // 1. Stress Frequency
  const frequencyOrder = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];
  const frequencyData = countFrequenciesPreserveOrder(
    responses.map(r => r.stress_frequency), 
    frequencyOrder
  );

  // 2. Biggest Source of Stress
  const sourceData = countFrequencies(responses.map(r => r.stress_source));

  // 3. Coping Methods
  const allCoping = responses.flatMap(r => {
    return r.coping_methods.map(method => {
      if (method === "Other") {
        const raw = r.other_coping_text?.trim() ?? "";
        if (raw.length === 0) return "Other";
        return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
      }
      return method;
    });
  });
  const copingData = countFrequencies(allCoping);

  // 4. Sleep Hours
  const sleepOrder = ["Less than 4 hours", "4-5 hours", "6-7 hours", "8-9 hours", "More than 9 hours"];
  const sleepData = countFrequenciesPreserveOrder(
    responses.map(r => r.sleep_hours),
    sleepOrder
  );

  // Chart styling constants
  const CHartColors = {
    primary: "hsl(var(--primary))",
    accent: "hsl(var(--accent))",
    destructive: "hsl(var(--destructive))",
    grid: "hsl(var(--border) / 0.5)",
    text: "hsl(var(--muted-foreground))"
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border shadow-xl rounded-xl p-3 text-sm">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-primary font-medium">
            Count: <span className="text-foreground">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground">Survey Results</h1>
          <p className="text-muted-foreground mt-1">Live aggregated data from student responses.</p>
        </div>
        <Link href="/">
          <Button variant="outline" className="px-4 py-2">
            <Home className="mr-2 w-4 h-4" />
            Home
          </Button>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 text-center bg-gradient-to-r from-primary to-accent text-white border-none shadow-xl shadow-primary/20">
          <h2 className="text-lg font-medium text-white/80 uppercase tracking-widest mb-2">Total Responses</h2>
          <p className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter">
            {totalResponses}
          </p>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Stress Frequency */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-foreground">How Often Students Feel Stressed</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHartColors.grid} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: CHartColors.text, fontSize: 12 }} 
                    angle={-25}
                    textAnchor="end"
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: CHartColors.text, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
                  <Bar dataKey="count" fill={CHartColors.primary} radius={[6, 6, 0, 0]}>
                    {frequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? CHartColors.accent : CHartColors.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Chart 2: Biggest Source of Stress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-foreground">Biggest Sources of Stress</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CHartColors.grid} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: CHartColors.text, fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: CHartColors.text, fontSize: 12 }} 
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
                  <Bar dataKey="count" fill={CHartColors.primary} radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Chart 3: Coping Methods */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 h-[450px] flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-foreground">How Students Cope with Stress</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={copingData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CHartColors.grid} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: CHartColors.text, fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: CHartColors.text, fontSize: 12 }} 
                    width={110}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
                  <Bar dataKey="count" fill={CHartColors.accent} radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Chart 4: Sleep Hours */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-6 h-[450px] flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-foreground">Sleep Habits</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHartColors.grid} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: CHartColors.text, fontSize: 12 }} 
                    angle={-25}
                    textAnchor="end"
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: CHartColors.text, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
                  <Bar dataKey="count" fill={CHartColors.primary} radius={[6, 6, 0, 0]} barSize={40}>
                     {sleepData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index < 2 ? CHartColors.destructive : CHartColors.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
