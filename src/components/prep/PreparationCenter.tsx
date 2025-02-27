'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useJourney } from '@/context/JourneyContext';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, PlusCircle, Heart, Home, Car, Stethoscope, Baby, Clipboard, User, CheckSquare } from 'lucide-react';

/**
 * PreparationCenter component - Centralized hub for all preparation tasks and planning
 * Includes birth plan, hospital bag checklist, nursery readiness, etc.
 */
export default function PreparationCenter() {
  const { currentWeek, stage, journeyState } = useJourney();
  const [activeTab, setActiveTab] = useState('birth-plan');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Preparation Center</h1>
        <p className="text-muted-foreground">
          Everything you need to prepare for baby's arrival
        </p>
      </div>
      
      {/* Progress overview */}
      <ProgressiveDisclosure minWeek={20} stages={['pregnancy']}>
        <Card>
          <CardHeader>
            <CardTitle>Your Preparation Progress</CardTitle>
            <CardDescription>
              {stage === 'pregnancy' 
                ? currentWeek < 30 
                  ? "Start early to reduce stress in your final weeks" 
                  : "Focus on completing these key preparation tasks"
                : "Track postpartum preparation tasks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <PreparationProgressItem
                title="Birth Plan"
                description="Document your preferences for labor and delivery"
                progress={60}
                dueWeek={36}
                currentWeek={currentWeek}
                onClick={() => setActiveTab('birth-plan')}
              />
              
              <PreparationProgressItem
                title="Hospital Bag"
                description="Pack essentials for your hospital stay"
                progress={40}
                dueWeek={37}
                currentWeek={currentWeek}
                onClick={() => setActiveTab('hospital-bag')}
              />
              
              <PreparationProgressItem
                title="Nursery Setup"
                description="Prepare a safe sleep space for baby"
                progress={25}
                dueWeek={35}
                currentWeek={currentWeek}
                onClick={() => setActiveTab('nursery')}
              />
              
              <PreparationProgressItem
                title="Newborn Essentials"
                description="Gather supplies for baby's first weeks"
                progress={70}
                dueWeek={38}
                currentWeek={currentWeek}
                onClick={() => setActiveTab('essentials')}
              />
            </div>
          </CardContent>
        </Card>
      </ProgressiveDisclosure>
      
      {/* Main preparation tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 h-auto gap-2">
          <TabsTrigger value="birth-plan" className="py-2 flex flex-col items-center">
            <Clipboard className="h-4 w-4 mb-1" />
            <span>Birth Plan</span>
          </TabsTrigger>
          <TabsTrigger value="hospital-bag" className="py-2 flex flex-col items-center">
            <Heart className="h-4 w-4 mb-1" />
            <span>Hospital Bag</span>
          </TabsTrigger>
          <TabsTrigger value="nursery" className="py-2 flex flex-col items-center">
            <Home className="h-4 w-4 mb-1" />
            <span>Nursery</span>
          </TabsTrigger>
          <TabsTrigger value="essentials" className="py-2 flex flex-col items-center">
            <Baby className="h-4 w-4 mb-1" />
            <span>Essentials</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Birth Plan */}
        <TabsContent value="birth-plan">
          <Card>
            <CardHeader>
              <CardTitle>Birth Plan Builder</CardTitle>
              <CardDescription>
                Document your preferences for labor, delivery, and postpartum care
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your birth plan helps communicate your preferences to your healthcare team. 
                Remember that flexibility is important as circumstances may require adjustments.
              </p>
              
              <div className="space-y-6">
                <BirthPlanSection
                  title="Labor Preferences"
                  icon={<User className="h-5 w-5" />}
                  items={[
                    { id: '1', title: 'Freedom to move around during labor', selected: true },
                    { id: '2', title: 'Dim lighting and quiet environment', selected: true },
                    { id: '3', title: 'Use of birthing ball or other props', selected: false },
                    { id: '4', title: 'Limited vaginal exams', selected: false },
                    { id: '5', title: 'Play my own music', selected: true },
                  ]}
                />
                
                <BirthPlanSection
                  title="Pain Management"
                  icon={<Heart className="h-5 w-5" />}
                  items={[
                    { id: '6', title: 'Prefer to avoid pain medication if possible', selected: true },
                    { id: '7', title: 'Open to epidural if needed', selected: true },
                    { id: '8', title: 'Would like access to nitrous oxide', selected: false },
                    { id: '9', title: 'Use breathing techniques and coaching', selected: true },
                  ]}
                />
                
                <BirthPlanSection
                  title="Medical Interventions"
                  icon={<Stethoscope className="h-5 w-5" />}
                  items={[
                    { id: '10', title: 'Avoid episiotomy unless necessary', selected: true },
                    { id: '11', title: 'Prefer no routine IV', selected: false },
                    { id: '12', title: 'Prefer intermittent monitoring', selected: true },
                    { id: '13', title: 'Avoid artificial rupture of membranes', selected: false },
                  ]}
                />
                
                <BirthPlanSection
                  title="After Birth"
                  icon={<Baby className="h-5 w-5" />}
                  items={[
                    { id: '14', title: 'Immediate skin-to-skin contact', selected: true },
                    { id: '15', title: 'Delay cord clamping', selected: true },
                    { id: '16', title: 'Partner to cut the cord', selected: true },
                    { id: '17', title: 'Breastfeed as soon as possible', selected: true },
                    { id: '18', title: 'Keep baby in room at all times', selected: true },
                  ]}
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline">Add New Preference</Button>
                <div className="space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Export PDF</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Hospital Bag */}
        <TabsContent value="hospital-bag">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Bag Checklist</CardTitle>
              <CardDescription>
                Pack these essentials for your labor, delivery, and hospital stay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ChecklistCategory
                  title="For Mother"
                  icon={<User className="h-5 w-5" />}
                  items={[
                    { id: '1', title: 'Photo ID and insurance card', completed: true },
                    { id: '2', title: 'Birth plan copies (3)', completed: true },
                    { id: '3', title: 'Comfortable nightgown/robe', completed: false },
                    { id: '4', title: 'Nursing bras (2)', completed: false },
                    { id: '5', title: 'Toiletries and personal care items', completed: false },
                    { id: '6', title: 'Going home outfit (loose fitting)', completed: false },
                    { id: '7', title: 'Phone charger', completed: true },
                    { id: '8', title: 'Comfortable pillow', completed: false },
                  ]}
                />
                
                <ChecklistCategory
                  title="For Baby"
                  icon={<Baby className="h-5 w-5" />}
                  items={[
                    { id: '9', title: 'Car seat (properly installed)', completed: false },
                    { id: '10', title: 'Going home outfit', completed: true },
                    { id: '11', title: 'Receiving blankets (2)', completed: true },
                    { id: '12', title: 'Newborn hat and socks', completed: true },
                    { id: '13', title: 'Newborn diapers', completed: false },
                  ]}
                />
                
                <ChecklistCategory
                  title="For Partner"
                  icon={<Heart className="h-5 w-5" />}
                  items={[
                    { id: '14', title: 'Snacks and water bottle', completed: false },
                    { id: '15', title: 'Change of clothes', completed: false },
                    { id: '16', title: 'Toiletries', completed: false },
                    { id: '17', title: 'Camera/Phone charger', completed: true },
                    { id: '18', title: 'Pillow and blanket', completed: false },
                  ]}
                />
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Item</span>
                </Button>
                <Button>Print Checklist</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Nursery Setup */}
        <TabsContent value="nursery">
          <Card>
            <CardHeader>
              <CardTitle>Nursery Setup Guide</CardTitle>
              <CardDescription>
                Create a safe, functional space for your baby
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Safe Sleep Essentials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ChecklistItem title="Firm crib mattress" isCompleted={true} />
                    <ChecklistItem title="Fitted sheet" isCompleted={true} />
                    <ChecklistItem title="No pillows, blankets or toys in crib" isCompleted={false} />
                    <ChecklistItem title="Baby monitor" isCompleted={false} />
                    <ChecklistItem title="Room-darkening curtains" isCompleted={false} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Changing Area</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ChecklistItem title="Changing table or pad" isCompleted={true} />
                    <ChecklistItem title="Diaper pail" isCompleted={false} />
                    <ChecklistItem title="Diaper caddy with supplies" isCompleted={false} />
                    <ChecklistItem title="Wipes and creams" isCompleted={true} />
                    <ChecklistItem title="Storage for clothes" isCompleted={false} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Feeding Station</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ChecklistItem title="Comfortable chair" isCompleted={false} />
                    <ChecklistItem title="Side table" isCompleted={false} />
                    <ChecklistItem title="Nursing pillow" isCompleted={true} />
                    <ChecklistItem title="Burp cloths" isCompleted={true} />
                    <ChecklistItem title="Water bottle station" isCompleted={false} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Safety Measures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ChecklistItem title="Outlet covers" isCompleted={false} />
                    <ChecklistItem title="Furniture anchored to wall" isCompleted={false} />
                    <ChecklistItem title="Cord management" isCompleted={false} />
                    <ChecklistItem title="Smoke and carbon monoxide detectors" isCompleted={true} />
                    <ChecklistItem title="Baby-proofing kit" isCompleted={false} />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Nursery Setup Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        7 of 20 items completed
                      </p>
                    </div>
                    <Button variant="outline">View All Items</Button>
                  </div>
                  <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Newborn Essentials */}
        <TabsContent value="essentials">
          <Card>
            <CardHeader>
              <CardTitle>Newborn Essentials Registry</CardTitle>
              <CardDescription>
                Track must-have items for baby's first months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="must-have" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="must-have">Must Have</TabsTrigger>
                  <TabsTrigger value="nice-to-have">Nice to Have</TabsTrigger>
                  <TabsTrigger value="luxury">Luxury</TabsTrigger>
                </TabsList>
                
                <TabsContent value="must-have" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RegistryItem
                      title="Car Seat"
                      category="Safety"
                      price="$150-300"
                      priority="High"
                      purchased={true}
                      notes="Ensure it meets safety standards and fits your car"
                    />
                    
                    <RegistryItem
                      title="Crib or Bassinet"
                      category="Furniture"
                      price="$100-500"
                      priority="High"
                      purchased={true}
                      notes="Must meet current safety standards"
                    />
                    
                    <RegistryItem
                      title="Diapers (Newborn)"
                      category="Changing"
                      price="$40-60"
                      priority="High"
                      purchased={false}
                      notes="Start with small pack as baby may outgrow quickly"
                    />
                    
                    <RegistryItem
                      title="Baby Clothes (0-3 months)"
                      category="Clothing"
                      price="$100-200"
                      priority="High"
                      purchased={true}
                      notes="Onesies, sleepers, hats, and socks"
                    />
                    
                    <RegistryItem
                      title="Baby Monitor"
                      category="Safety"
                      price="$40-300"
                      priority="High"
                      purchased={false}
                      notes="Audio or video based on preference"
                    />
                    
                    <RegistryItem
                      title="Breast Pump (if breastfeeding)"
                      category="Feeding"
                      price="$100-400"
                      priority="High"
                      purchased={false}
                      notes="May be covered by insurance"
                    />
                  </div>
                  
                  <div className="text-center pt-2">
                    <Button variant="outline">View All Must-Have Items</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="nice-to-have">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RegistryItem
                      title="Diaper Bag"
                      category="Out & About"
                      price="$40-150"
                      priority="Medium"
                      purchased={true}
                      notes="Look for one with changing pad and many pockets"
                    />
                    
                    <RegistryItem
                      title="Baby Carrier"
                      category="Out & About"
                      price="$40-180"
                      priority="Medium"
                      purchased={false}
                      notes="Soft structured carrier or wrap"
                    />
                    
                    <RegistryItem
                      title="Nursing Pillow"
                      category="Feeding"
                      price="$30-60"
                      priority="Medium"
                      purchased={true}
                      notes="Helps position baby during feeds"
                    />
                    
                    <RegistryItem
                      title="Bottle Warmer"
                      category="Feeding"
                      price="$20-50"
                      priority="Medium"
                      purchased={false}
                      notes="Not essential but convenient"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="luxury">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RegistryItem
                      title="Fancy Baby Swing"
                      category="Entertainment"
                      price="$180-300"
                      priority="Low"
                      purchased={false}
                      notes="Some babies love them, others don't"
                    />
                    
                    <RegistryItem
                      title="Wipe Warmer"
                      category="Changing"
                      price="$25-40"
                      priority="Low"
                      purchased={false}
                      notes="Nice but not necessary"
                    />
                    
                    <RegistryItem
                      title="Diaper Disposal System"
                      category="Changing"
                      price="$40-80"
                      priority="Low"
                      purchased={false}
                      notes="Regular trash can works too"
                    />
                    
                    <RegistryItem
                      title="Baby Food Maker"
                      category="Feeding"
                      price="$100-200"
                      priority="Low"
                      purchased={false}
                      notes="Won't need until 6+ months"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Registry Item</span>
                </Button>
                <Button>Share Registry</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Progress item component
function PreparationProgressItem({ 
  title, 
  description, 
  progress, 
  dueWeek, 
  currentWeek,
  onClick
}: { 
  title: string; 
  description: string; 
  progress: number; 
  dueWeek: number;
  currentWeek: number;
  onClick: () => void;
}) {
  const weeksRemaining = dueWeek - currentWeek;
  const isUrgent = weeksRemaining <= 4 && progress < 80;
  
  return (
    <motion.div 
      className={`p-4 rounded-lg border ${isUrgent ? 'border-red-200 bg-red-50' : 'border-border'}`}
      whileHover={{ y: -2 }}
      onClick={onClick}
      role="button"
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {isUrgent && (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Urgent
          </span>
        )}
      </div>
      
      <div className="mt-2 mb-1 h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            progress >= 80 ? 'bg-green-500' : 
            progress >= 50 ? 'bg-blue-500' : 
            isUrgent ? 'bg-red-500' : 'bg-amber-500'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs font-medium">{progress}% complete</span>
        <span className="text-xs text-muted-foreground">
          {weeksRemaining <= 0
            ? 'Due now!'
            : `Due in ${weeksRemaining} ${weeksRemaining === 1 ? 'week' : 'weeks'}`
          }
        </span>
      </div>
    </motion.div>
  );
}

// Birth plan section component
function BirthPlanSection({ title, icon, items }: { 
  title: string; 
  icon: React.ReactNode;
  items: {
    id: string;
    title: string;
    selected: boolean;
  }[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="text-base font-medium">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-10">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <div className={`h-5 w-5 flex-shrink-0 ${item.selected ? 'text-primary' : 'text-muted-foreground'}`}>
              {item.selected ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </div>
            <span className="text-sm">{item.title}</span>
          </div>
        ))}
        
        <div className="flex items-center gap-1 text-primary cursor-pointer md:col-span-2">
          <PlusCircle className="h-4 w-4" />
          <span className="text-sm">Add custom preference</span>
        </div>
      </div>
    </div>
  );
}

// Checklist category component
function ChecklistCategory({ title, icon, items }: { 
  title: string; 
  icon: React.ReactNode;
  items: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}) {
  const completedCount = items.filter(item => item.completed).length;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{items.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <div className="mt-0.5">
              <CheckSquare className={`h-4 w-4 ${
                item.completed ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            <span className={`text-sm ${
              item.completed ? 'line-through text-muted-foreground' : ''
            }`}>
              {item.title}
            </span>
          </div>
        ))}
        
        <div className="flex items-center gap-1 text-primary cursor-pointer pt-1">
          <PlusCircle className="h-4 w-4" />
          <span className="text-xs">Add item</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Checklist item component
function ChecklistItem({ title, isCompleted }: { title: string; isCompleted: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
      }`}>
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : null}
      </div>
      <p className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
        {title}
      </p>
    </div>
  );
}

// Registry item component
function RegistryItem({ 
  title, 
  category, 
  price, 
  priority, 
  purchased, 
  notes 
}: { 
  title: string; 
  category: string;
  price: string;
  priority: string;
  purchased: boolean;
  notes: string;
}) {
  return (
    <Card className={purchased ? 'bg-muted/50' : ''}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-medium ${purchased ? 'line-through text-muted-foreground' : ''}`}>{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {category}
              </span>
              <span className="text-xs text-muted-foreground">{price}</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            priority === 'High' 
              ? 'bg-red-100 text-red-800' 
              : priority === 'Medium'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {priority} Priority
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">{notes}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1">
            <input 
              type="checkbox" 
              checked={purchased} 
              readOnly 
              className="h-4 w-4 rounded border-muted-foreground/30"
            />
            <span className="text-xs font-medium">Purchased</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 