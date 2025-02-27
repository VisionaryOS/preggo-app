'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Phone, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crisis } from '@/types/journey.types';

// Sample crisis data
const crisisData: Crisis[] = [
  {
    id: 'bleeding',
    title: 'Vaginal Bleeding',
    symptoms: [
      'Bright red blood (more than spotting)',
      'Bleeding with pain or cramping',
      'Passing tissue or clots'
    ],
    whenToCall: [
      'Any vaginal bleeding in the first trimester',
      'Heavy bleeding (soaking through a pad in less than an hour)',
      'Bleeding with severe abdominal pain'
    ],
    emergencySteps: [
      'Lie down and rest on your left side',
      'Note the amount, color, and any accompanying symptoms',
      'Seek immediate medical attention'
    ],
    helplineNumbers: [
      'Emergency: 911',
      'Labor & Delivery: 555-123-4567',
      'Nurse Line: 555-789-0123'
    ]
  },
  {
    id: 'contractions',
    title: 'Preterm Contractions',
    symptoms: [
      'Regular tightening or pain in your abdomen',
      'Pressure in your pelvis or lower back',
      'More than 4 contractions in an hour before 37 weeks'
    ],
    whenToCall: [
      'Contractions every 10 minutes (or closer) before 37 weeks',
      'Contractions that don\'t stop with rest and hydration',
      'Contractions with other symptoms like fluid leakage'
    ],
    emergencySteps: [
      'Drink 2-3 glasses of water and empty your bladder',
      'Lie down on your left side for an hour',
      'Time the contractions (how often and how long they last)'
    ],
    helplineNumbers: [
      'Emergency: 911',
      'Labor & Delivery: 555-123-4567',
      'Nurse Line: 555-789-0123'
    ]
  },
  {
    id: 'water-breaking',
    title: 'Water Breaking',
    symptoms: [
      'Sudden gush of fluid from vagina',
      'Continuous trickle of fluid',
      'Clear, pale yellow, or greenish fluid'
    ],
    whenToCall: [
      'Any rupture of membranes before 37 weeks',
      'Green or brown fluid (may indicate meconium)',
      'Rupture of membranes without contractions starting within 12 hours'
    ],
    emergencySteps: [
      'Note the time, amount, color, and odor of the fluid',
      'Use a pad (not a tampon) to collect the fluid',
      'Avoid baths, swimming, or intercourse',
      'Contact your healthcare provider immediately'
    ],
    helplineNumbers: [
      'Emergency: 911',
      'Labor & Delivery: 555-123-4567',
      'Nurse Line: 555-789-0123'
    ]
  },
  {
    id: 'reduced-movement',
    title: 'Reduced Baby Movement',
    symptoms: [
      'Noticeable decrease in typical movement patterns',
      'Fewer than 10 movements in 2 hours (after 28 weeks)',
      'No movement for several hours'
    ],
    whenToCall: [
      'Less than 10 movements in 2 hours during kick counts',
      'Significant change in movement pattern',
      'No movement for 2 hours or more'
    ],
    emergencySteps: [
      'Lie on your left side in a quiet room',
      'Drink something cold and sweet',
      'Focus on feeling for movements for 2 hours',
      'If fewer than 10 movements in 2 hours, call your provider'
    ],
    helplineNumbers: [
      'Emergency: 911',
      'Labor & Delivery: 555-123-4567',
      'Nurse Line: 555-789-0123'
    ]
  }
];

// Tab options
const categories = [
  { id: 'all', label: 'All Concerns' },
  { id: 'pregnancy', label: 'Pregnancy' },
  { id: 'labor', label: 'Labor' },
  { id: 'postpartum', label: 'Postpartum' }
];

/**
 * A component that provides emergency guidance and one-tap access to critical resources
 */
export function CrisisSupport() {
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [activeCrisis, setActiveCrisis] = useState<Crisis | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleCrisisSelect = (crisis: Crisis) => {
    setActiveCrisis(crisis);
  };

  const handleClose = () => {
    setShowCrisisModal(false);
    setTimeout(() => setActiveCrisis(null), 300);
  };

  const handleCall = (number: string) => {
    // In a real implementation, this would use platform-specific approaches
    // For web, we can use tel: links
    const actualNumber = number.split(': ')[1];
    window.location.href = `tel:${actualNumber.replace(/[^0-9]/g, '')}`;
  };

  // Crisis Button that is always visible
  const CrisisButton = () => (
    <Button 
      variant="destructive" 
      size="icon" 
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center"
      onClick={() => setShowCrisisModal(true)}
    >
      <AlertTriangle className="h-6 w-6" />
    </Button>
  );

  // Modal content when viewing a specific crisis
  const CrisisDetailView = () => {
    if (!activeCrisis) return null;
    
    return (
      <div className="p-6 pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2 -ml-2" 
          onClick={() => setActiveCrisis(null)}
        >
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to all
        </Button>
        
        <Card className="border-red-500">
          <CardHeader className="pb-2">
            <CardTitle>{activeCrisis.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Symptoms to watch for:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {activeCrisis.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1 text-red-500">When to call immediately:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {activeCrisis.whenToCall.map((when, i) => (
                    <li key={i} className="text-red-500">{when}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">What to do:</h4>
                <ol className="list-decimal pl-5 text-sm">
                  {activeCrisis.emergencySteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <h4 className="text-sm font-medium mb-1 w-full">Quick Contacts:</h4>
            <div className="grid grid-cols-1 gap-2 w-full">
              {activeCrisis.helplineNumbers.map((number, i) => (
                <Button 
                  key={i} 
                  className="justify-start"
                  onClick={() => handleCall(number)}
                  variant={i === 0 ? "destructive" : "outline"}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {number}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Crisis list view
  const CrisisListView = () => (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="px-6">
        <TabsList className="w-full">
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex-1"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      <TabsContent value="all" className="m-0">
        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-2 py-4">
            {crisisData.map(crisis => (
              <Button 
                key={crisis.id}
                variant="outline"
                className="w-full justify-between h-auto py-3 px-4"
                onClick={() => handleCrisisSelect(crisis)}
              >
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">{crisis.title}</span>
                  <span className="text-sm text-muted-foreground">{crisis.symptoms[0]}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      {/* Other tabs would filter the crisis data by category */}
      {['pregnancy', 'labor', 'postpartum'].map(tab => (
        <TabsContent key={tab} value={tab} className="m-0">
          <div className="p-6 pt-4 text-center text-muted-foreground">
            <p>Filtered crisis guidance will appear here</p>
          </div>
        </TabsContent>
      ))}
      
      <div className="p-6 pt-0">
        <Button variant="destructive" className="w-full" onClick={() => handleCall('Emergency: 911')}>
          <Phone className="mr-2 h-4 w-4" />
          Call Emergency Services (911)
        </Button>
      </div>
    </Tabs>
  );
  
  // Render emergency button, and conditionally render the modal
  return (
    <>
      <CrisisButton />
      
      {showCrisisModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-lg border shadow-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-2 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Emergency Guidance
                </h2>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Quick access to critical information for pregnancy concerns
              </p>
            </div>
            
            <div className="flex-1 overflow-auto">
              {activeCrisis ? <CrisisDetailView /> : <CrisisListView />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CrisisSupport; 