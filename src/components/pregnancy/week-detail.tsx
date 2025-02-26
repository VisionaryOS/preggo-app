import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WeekData } from '@/types/pregnancy'

interface WeekDetailProps {
  weekData: WeekData
}

export function WeekDetail({ weekData }: WeekDetailProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Week {weekData.week}</CardTitle>
        <CardDescription>
          Your baby is about the size of a {weekData.babySize.fruit} ({weekData.babySize.lengthCm} cm, {weekData.babySize.weightG} g)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="baby">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="baby">Baby</TabsTrigger>
            <TabsTrigger value="mom">Your Body</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="baby" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Baby's Development</h3>
            <ul className="space-y-2 ml-5 list-disc">
              {weekData.babyDevelopment.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="mom" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Changes in Your Body</h3>
            <ul className="space-y-2 ml-5 list-disc">
              {weekData.motherChanges.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="symptoms" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Common Symptoms</h3>
            <ul className="space-y-2 ml-5 list-disc">
              {weekData.commonSymptoms.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Nutrition Tips</h3>
            <ul className="space-y-2 ml-5 list-disc">
              {weekData.nutritionTips.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h3 className="text-lg font-semibold mt-6">Preparation Tasks</h3>
            <ul className="space-y-2 ml-5 list-disc">
              {weekData.preparationTasks.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default WeekDetail 