'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Sample upcoming appointments data
const upcomingAppointments = [
  { id: 1, title: 'OB-GYN Check-up', date: new Date(2023, 6, 15, 10, 30), location: 'Dr. Smith Clinic' },
  { id: 2, title: 'Ultrasound', date: new Date(2023, 6, 22, 14, 0), location: 'City Hospital' },
];

// Sample tasks data
const tasks = [
  { id: 1, title: 'Take prenatal vitamins', completed: true },
  { id: 2, title: 'Drink 2L of water', completed: false },
  { id: 3, title: 'Do 15min pregnancy yoga', completed: false },
  { id: 4, title: 'Read pregnancy book', completed: true },
];

export function RightSidebar() {
  return (
    <div className="w-80 border-l p-4 h-screen overflow-y-auto bg-background">
      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell size={16} className="text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>You have no new notifications.</p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border-b pb-2 last:border-0 last:pb-0">
                  <p className="font-medium text-sm">{appointment.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(appointment.date.toString())} • {appointment.location}
                  </p>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-xs mt-2">
                View All Appointments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              <Button variant="ghost" size="sm" className="w-full text-xs mt-2">
                Manage Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <Button variant="link" className="p-0 h-auto text-left justify-start text-xs">
                Pregnancy Week-by-Week Guide
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start text-xs">
                Nutrition During Pregnancy
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start text-xs">
                Prenatal Exercise Recommendations
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start text-xs">
                Labor and Delivery Preparation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 