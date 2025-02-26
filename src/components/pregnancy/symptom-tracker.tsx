import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { CalendarIcon, Plus } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// Common pregnancy symptoms
const COMMON_SYMPTOMS = [
  'Nausea',
  'Fatigue',
  'Backache',
  'Headache',
  'Heartburn',
  'Swelling',
  'Insomnia',
  'Cramping',
  'Mood swings',
  'Constipation',
  'Food cravings',
  'Breast tenderness',
  'Shortness of breath',
]

interface SymptomTrackerProps {
  onSubmit: (symptom: {
    symptomType: string
    date: Date
    severity: number
    duration: number
    notes: string
  }) => Promise<void>
  isLoading?: boolean
}

export function SymptomTracker({ onSubmit, isLoading = false }: SymptomTrackerProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [symptomType, setSymptomType] = useState<string>('')
  const [customSymptom, setCustomSymptom] = useState<string>('')
  const [severity, setSeverity] = useState<number>(3)
  const [duration, setDuration] = useState<number>(1)
  const [notes, setNotes] = useState<string>('')
  const [showCustomSymptom, setShowCustomSymptom] = useState<boolean>(false)

  const handleSelectSymptom = (value: string) => {
    if (value === 'custom') {
      setShowCustomSymptom(true)
      setSymptomType('')
    } else {
      setShowCustomSymptom(false)
      setSymptomType(value)
      setCustomSymptom('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use either the selected symptom or the custom symptom
    const finalSymptomType = symptomType || customSymptom
    
    if (!finalSymptomType) {
      toast({
        title: 'Error',
        description: 'Please select or enter a symptom',
        variant: 'destructive',
      })
      return
    }
    
    try {
      await onSubmit({
        symptomType: finalSymptomType,
        date,
        severity,
        duration,
        notes,
      })
      
      // Reset form after successful submission
      setSymptomType('')
      setCustomSymptom('')
      setShowCustomSymptom(false)
      setSeverity(3)
      setDuration(1)
      setNotes('')
      
      toast({
        title: 'Success',
        description: 'Symptom logged successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log symptom. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log a Symptom</CardTitle>
        <CardDescription>
          Track your pregnancy symptoms to share with your healthcare provider
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptom">Symptom</Label>
            <Select value={symptomType} onValueChange={handleSelectSymptom}>
              <SelectTrigger id="symptom">
                <SelectValue placeholder="Select a symptom" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_SYMPTOMS.map((symptom) => (
                  <SelectItem key={symptom} value={symptom}>
                    {symptom}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Enter custom symptom...</SelectItem>
              </SelectContent>
            </Select>
            
            {showCustomSymptom && (
              <div className="mt-2">
                <Input
                  placeholder="Enter symptom"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Severity (1-5)</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">Mild</span>
              <Slider
                value={[severity]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setSeverity(value[0])}
                className="flex-1"
              />
              <span className="text-sm">Severe</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {severity}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Duration (hours)</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details about this symptom"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? 'Logging...' : 'Log Symptom'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default SymptomTracker 