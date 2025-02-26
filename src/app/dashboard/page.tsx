'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { SideNav } from '@/components/dashboard/SideNav';
import { RightSidebar } from '@/components/dashboard/RightSidebar';
import { DataEntryForm, DataFormValues } from '@/components/dashboard/DataEntryForm';
import { formatDate, formatWeeksUntilDueDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  BarChart,
  DonutChart,
  LineChart,
  ProgressBar,
  Text,
  Title,
  Grid,
  Col, 
  TabGroup, 
  TabList, 
  TabPanel, 
  TabPanels,
  Tab,
  DateRangePicker
} from '@tremor/react';

// Sample data for charts
const healthDataByWeek = [
  { date: '2023-01-01', weight: 130, bloodPressure: 110, sleepHours: 7.5 },
  { date: '2023-01-08', weight: 131, bloodPressure: 112, sleepHours: 7.3 },
  { date: '2023-01-15', weight: 131.5, bloodPressure: 114, sleepHours: 7.1 },
  { date: '2023-01-22', weight: 132, bloodPressure: 115, sleepHours: 6.9 },
  { date: '2023-01-29', weight: 133, bloodPressure: 116, sleepHours: 6.8 },
  { date: '2023-02-05', weight: 134, bloodPressure: 117, sleepHours: 6.7 },
];

const nutritionData = [
  { name: 'Proteins', value: 30 },
  { name: 'Carbs', value: 40 },
  { name: 'Fats', value: 20 },
  { name: 'Fiber', value: 10 },
];

const symptomsData = [
  { name: 'Fatigue', value: 8 },
  { name: 'Nausea', value: 5 },
  { name: 'Cravings', value: 6 },
  { name: 'Mood Swings', value: 4 },
  { name: 'Backache', value: 3 },
];

const exerciseData = [
  { date: '2023-01-01', minutes: 20 },
  { date: '2023-01-02', minutes: 15 },
  { date: '2023-01-03', minutes: 25 },
  { date: '2023-01-04', minutes: 0 },
  { date: '2023-01-05', minutes: 30 },
  { date: '2023-01-06', minutes: 20 },
  { date: '2023-01-07', minutes: 15 },
];

// Chart value formatters
const valueFormatter = (number: number) => {
  return `${number}`;
};

const percentFormatter = (number: number) => {
  return `${number}%`;
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const [dashboardData, setDashboardData] = useState({
    healthData: healthDataByWeek,
    nutritionData: nutritionData,
    symptomsData: symptomsData,
    exerciseData: exerciseData
  });

  if (authLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">You need to log in to access the dashboard</h1>
          <a href="/login" className="text-primary hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleDataSubmit = (data: DataFormValues) => {
    console.log('Form data submitted:', data);
    
    // In a real app, you would send this data to your backend
    // For now, we'll just update the local state with mock data
    setDashboardData(prevData => {
      // Sample update for demo purposes
      return {
        ...prevData,
        healthData: [
          ...prevData.healthData,
          {
            date: new Date().toISOString().slice(0, 10),
            weight: data.weight || 135,
            bloodPressure: parseInt(data.bloodPressure?.split('/')[0] || '120'),
            sleepHours: data.sleepHours || 7.0
          }
        ],
        exerciseData: [
          ...prevData.exerciseData,
          {
            date: new Date().toISOString().slice(0, 10),
            minutes: data.exerciseMinutes || 0
          }
        ]
      };
    });
  };

  // Calculate pregnancy progress from due date
  const pregnancyProgress = profile?.due_date 
    ? calculatePregnancyProgress(new Date(profile.due_date))
    : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Welcome back, {profile?.full_name || user.email}</h1>
          {profile?.due_date && (
            <p className="text-muted-foreground mt-1">
              Your baby is due in {formatWeeksUntilDueDate(profile.due_date)} weeks on {formatDate(profile.due_date)}
            </p>
          )}
        </div>

        <DataEntryForm onDataSubmit={handleDataSubmit} />

        <div className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pregnancy Progress</CardTitle>
              <CardDescription>
                {pregnancyProgress}% complete - {40 - Math.round(pregnancyProgress / 2.5)} weeks to go
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressBar value={pregnancyProgress} color="indigo" className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Grid numItems={1} numItemsMd={2} className="gap-6 mb-6">
          <Col>
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>
                  Track your weight, blood pressure, and sleep over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabGroup>
                  <TabList className="mb-4">
                    <Tab>Weight</Tab>
                    <Tab>Blood Pressure</Tab>
                    <Tab>Sleep</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <LineChart
                        className="h-72 mt-4"
                        data={dashboardData.healthData}
                        index="date"
                        categories={["weight"]}
                        colors={["indigo"]}
                        valueFormatter={valueFormatter}
                        showLegend={false}
                        yAxisWidth={40}
                      />
                    </TabPanel>
                    <TabPanel>
                      <LineChart
                        className="h-72 mt-4"
                        data={dashboardData.healthData}
                        index="date"
                        categories={["bloodPressure"]}
                        colors={["rose"]}
                        valueFormatter={valueFormatter}
                        showLegend={false}
                        yAxisWidth={40}
                      />
                    </TabPanel>
                    <TabPanel>
                      <LineChart
                        className="h-72 mt-4"
                        data={dashboardData.healthData}
                        index="date"
                        categories={["sleepHours"]}
                        colors={["blue"]}
                        valueFormatter={valueFormatter}
                        showLegend={false}
                        yAxisWidth={40}
                      />
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </CardContent>
            </Card>
          </Col>

          <Col>
            <Card>
              <CardHeader>
                <CardTitle>Exercise Activity</CardTitle>
                <CardDescription>
                  Minutes of activity per day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="h-72 mt-4"
                  data={dashboardData.exerciseData}
                  index="date"
                  categories={["minutes"]}
                  colors={["emerald"]}
                  valueFormatter={valueFormatter}
                  showLegend={false}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>
          </Col>
        </Grid>

        <Grid numItems={1} numItemsMd={2} className="gap-6">
          <Col>
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Breakdown</CardTitle>
                <CardDescription>
                  Daily nutrient distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  className="h-64 mt-4"
                  data={dashboardData.nutritionData}
                  category="value"
                  index="name"
                  valueFormatter={percentFormatter}
                  colors={["indigo", "cyan", "amber", "emerald"]}
                />
              </CardContent>
            </Card>
          </Col>

          <Col>
            <Card>
              <CardHeader>
                <CardTitle>Symptoms</CardTitle>
                <CardDescription>
                  Frequency and intensity of symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="h-64 mt-4"
                  data={dashboardData.symptomsData}
                  index="name"
                  categories={["value"]}
                  colors={["violet"]}
                  valueFormatter={valueFormatter}
                  showLegend={false}
                  yAxisWidth={30}
                  layout="vertical"
                />
              </CardContent>
            </Card>
          </Col>
        </Grid>
      </main>
      
      <RightSidebar />
    </div>
  );
}

function calculatePregnancyProgress(dueDate: string | Date): number {
  // Pregnancy is typically 40 weeks
  const PREGNANCY_DURATION_MS = 40 * 7 * 24 * 60 * 60 * 1000; // 40 weeks in milliseconds
  
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);
  
  // Conception date is roughly 40 weeks before due date
  const conceptionDate = new Date(dueDateObj.getTime() - PREGNANCY_DURATION_MS);
  
  // Calculate elapsed time since conception
  const elapsedTime = currentDate.getTime() - conceptionDate.getTime();
  
  // Calculate progress percentage
  const progressPercentage = (elapsedTime / PREGNANCY_DURATION_MS) * 100;
  
  // Ensure the percentage is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(progressPercentage)));
} 