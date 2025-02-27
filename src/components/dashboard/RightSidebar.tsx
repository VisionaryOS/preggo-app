'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Check, Heart, Baby } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Sample tasks data
const tasks = [
  { id: 1, title: 'Take prenatal vitamins', completed: true },
  { id: 2, title: 'Drink 2L of water', completed: false },
  { id: 3, title: 'Do 15min pregnancy yoga', completed: false },
  { id: 4, title: 'Read pregnancy book', completed: true },
];

// Health score marker component
interface HealthMarkerProps {
  score: number;
  icon: React.ReactNode;
  label: string;
}

function HealthScoreMarker({ score, icon, label }: HealthMarkerProps) {
  const getProgressColor = (value: number) => {
    if (value < 70) return "bg-gradient-to-r from-red-500 to-red-400";
    if (value < 80) return "bg-gradient-to-r from-amber-500 to-amber-400";
    if (value < 90) return "bg-gradient-to-r from-lime-500 to-green-400";
    return "bg-gradient-to-r from-green-600 to-green-500";
  };

  return (
    <div className="space-y-1 flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className="text-xs font-medium">{score}%</span>
      </div>
      <div className="relative h-2 w-full rounded-full overflow-hidden bg-muted/30">
        <div className={`absolute top-0 left-0 h-full ${getProgressColor(score)}`} style={{ width: `${score}%` }} />
        <div 
          className="absolute top-0 h-full w-1 bg-background border-2 border-foreground rounded-full" 
          style={{ left: `calc(${score}% - 2px)` }}
        />
      </div>
    </div>
  );
}

export function RightSidebar() {
  // Calculate health scores (sample calculations)
  const babyHealthScore = Math.min(95, Math.round(75 + Math.random() * 20));
  const momHealthScore = Math.min(98, Math.round(80 + Math.random() * 18));
  
  return (
    <div className="w-80 border-l h-screen overflow-hidden bg-background flex flex-col">
      <div className="p-4 flex-1 overflow-hidden">
        <div className="h-full pb-2 space-y-4">
          {/* Health Scores - Side by side */}
          <Card className="shadow-none border">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart size={16} className="text-primary" />
                Health Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="flex gap-3">
                <HealthScoreMarker 
                  score={momHealthScore} 
                  icon={<span className="text-sm">👩</span>} 
                  label="Mom" 
                />
                <HealthScoreMarker 
                  score={babyHealthScore} 
                  icon={<Baby className="h-4 w-4 text-primary" />} 
                  label="Baby" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Tasks */}
          <Card className="shadow-none border">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm font-medium">
                Daily Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      task.completed ? 'bg-primary' : 'border border-muted-foreground'
                    }`}>
                      {task.completed && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Manage Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 