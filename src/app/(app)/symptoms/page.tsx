import React from 'react'
import SymptomTracker from '@/components/pregnancy/symptom-tracker'
import SymptomHistory from '@/components/pregnancy/symptom-history'

// Sample symptoms data - in a real app, these would be fetched from the database
const MOCK_SYMPTOMS = [
  {
    id: '1',
    user_id: 'user123',
    date: '2023-05-10',
    symptom_type: 'Nausea',
    severity: 4,
    duration: 2,
    notes: 'Felt sick in the morning, especially after breakfast',
    created_at: '2023-05-10T08:30:00Z'
  },
  {
    id: '2',
    user_id: 'user123',
    date: '2023-05-09',
    symptom_type: 'Fatigue',
    severity: 3,
    duration: 8,
    notes: 'Tired all day, needed to take a nap after lunch',
    created_at: '2023-05-09T19:15:00Z'
  },
  {
    id: '3',
    user_id: 'user123',
    date: '2023-05-07',
    symptom_type: 'Backache',
    severity: 2,
    duration: 3,
    notes: 'Lower back pain, improved after rest',
    created_at: '2023-05-07T21:45:00Z'
  },
  {
    id: '4',
    user_id: 'user123',
    date: '2023-04-28',
    symptom_type: 'Headache',
    severity: 3,
    duration: 4,
    notes: 'Frontal headache, subsided after taking acetaminophen',
    created_at: '2023-04-28T16:20:00Z'
  },
  {
    id: '5',
    user_id: 'user123',
    date: '2023-04-25',
    symptom_type: 'Heartburn',
    severity: 3,
    duration: 1,
    notes: 'After dinner, especially when lying down',
    created_at: '2023-04-25T22:10:00Z'
  }
]

export default function SymptomsPage() {
  // In a real app, these handlers would interact with a database
  const handleSubmitSymptom = async (symptom: {
    symptomType: string
    date: Date
    severity: number
    duration: number
    notes: string
  }) => {
    console.log('Submitted symptom:', symptom)
    // In a real app, we would add the symptom to the database
    // await db.symptom.create({ data: symptom })
  }

  const handleDeleteSymptom = async (id: string) => {
    console.log('Deleting symptom:', id)
    // In a real app, we would delete the symptom from the database
    // await db.symptom.delete({ where: { id } })
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Symptom Tracker</h1>
          <p className="text-muted-foreground">
            Keep track of your pregnancy symptoms to share with your healthcare provider
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <SymptomTracker onSubmit={handleSubmitSymptom} />
        <SymptomHistory 
          symptoms={MOCK_SYMPTOMS} 
          onDelete={handleDeleteSymptom} 
        />
      </div>
    </div>
  )
} 