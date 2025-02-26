import React from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Activity, Clock, CalendarDays, FileText } from 'lucide-react'
import { Symptom } from '@/types/pregnancy'

interface SymptomHistoryProps {
  symptoms: Symptom[]
  onDelete?: (id: string) => Promise<void>
}

export function SymptomHistory({ symptoms, onDelete }: SymptomHistoryProps) {
  // Group symptoms by month
  const groupedByMonth: Record<string, Symptom[]> = {}
  
  symptoms.forEach(symptom => {
    const date = new Date(symptom.date)
    const monthYear = format(date, 'MMMM yyyy')
    
    if (!groupedByMonth[monthYear]) {
      groupedByMonth[monthYear] = []
    }
    
    groupedByMonth[monthYear].push(symptom)
  })
  
  const months = Object.keys(groupedByMonth).sort((a, b) => {
    // Sort months in reverse chronological order
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom History</CardTitle>
        <CardDescription>
          Track your symptoms over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {symptoms.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No symptoms logged yet</p>
            <p className="text-sm">Start tracking symptoms to see your history here</p>
          </div>
        ) : (
          <Tabs defaultValue={months[0]}>
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
              {months.map(month => (
                <TabsTrigger key={month} value={month}>
                  {month}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {months.map(month => (
              <TabsContent key={month} value={month} className="space-y-4">
                {groupedByMonth[month]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(symptom => (
                    <div key={symptom.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{symptom.symptom_type}</h3>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {format(new Date(symptom.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span>Severity: {symptom.severity}</span>
                        </div>
                        {symptom.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Duration: {symptom.duration} hours</span>
                          </div>
                        )}
                      </div>
                      
                      {symptom.notes && (
                        <div className="text-sm mt-2">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>Notes:</span>
                          </div>
                          <p className="mt-1 pl-5">{symptom.notes}</p>
                        </div>
                      )}
                      
                      {onDelete && (
                        <div className="mt-2 text-right">
                          <button
                            onClick={() => onDelete(symptom.id)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

export default SymptomHistory 