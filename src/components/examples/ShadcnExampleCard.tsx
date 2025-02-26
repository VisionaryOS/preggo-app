"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/lib/providers/theme-provider";

export function ShadcnExampleCard() {
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    toast({
      title: "Success!",
      description: "Your settings have been saved.",
      variant: "default",
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Account Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and settings
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <CardContent className="space-y-4 pt-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" placeholder="Your name" defaultValue="Jane Smith" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" defaultValue="jane@example.com" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-switch">Dark Mode</Label>
                  <Switch 
                    id="theme-switch"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </div>
              
              <CardFooter className="flex justify-end px-0 pt-5">
                <Button variant="outline" type="button" className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="notifications">
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifs" className="block">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about account activity
                  </p>
                </div>
                <Switch id="email-notifs" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifs" className="block">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text messages for important alerts
                  </p>
                </div>
                <Switch id="sms-notifs" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing" className="block">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and promotions
                  </p>
                </div>
                <Switch id="marketing" />
              </div>
            </div>
            
            <CardFooter className="flex justify-end px-0 pt-5">
              <Button variant="outline" type="button" className="mr-2">
                Cancel
              </Button>
              <Button type="button" onClick={() => {
                toast({
                  title: "Preferences Updated",
                  description: "Your notification settings have been saved.",
                });
              }}>
                Save Preferences
              </Button>
            </CardFooter>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 