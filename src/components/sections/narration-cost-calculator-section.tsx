
"use client";

import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Users, Speaker, Loader2 } from 'lucide-react'; // Added Loader2
import { useToast } from "@/hooks/use-toast";
import { saveLead } from '@/app/actions/saveEmail';


const WORDS_PER_HOUR = 9000;

const SERVICE_DETAILS = {
  narrationOnly: { id: 'narrationOnly', label: 'Narration Only', price: 75, icon: User },
  fullCast: { id: 'fullCast', label: 'Full Cast', price: 150, icon: Users },
  immersiveAudio: { id: 'immersiveAudio', label: 'Immersive Audio', price: 250, icon: Speaker },
};

const fictionGenreOptions = [
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'science-fiction', label: 'Science Fiction' },
  { value: 'romance', label: 'Romance' },
  { value: 'thriller-mystery', label: 'Thriller/Mystery' },
  { value: 'historical-fiction', label: 'Historical Fiction' },
  { value: 'contemporary-fiction', label: 'Contemporary Fiction' },
  { value: 'childrens-fiction', label: "Children's Fiction"},
  { value: 'young-adult-fiction', label: "Young Adult (YA) Fiction"},
  { value: 'other-fiction', label: 'Other (Fiction)'},
];
const nonFictionGenreOptions = [
  { value: 'biography-memoir', label: 'Biography/Memoir' },
  { value: 'self-help-personal-development', label: 'Self-Help/Personal Development' },
  { value: 'history-nonfic', label: 'History' },
  { value: 'business-economics', label: 'Business/Economics' },
  { value: 'science-technology-nonfic', label: 'Science/Technology' },
  { value: 'education-nonfic', label: 'Education' },
  { value: 'true-crime', label: 'True Crime'},
  { value: 'essays', label: 'Essays'},
  { value: 'spirituality-religion', label: 'Spirituality/Religion'},
  { value: 'other-non-fiction', label: 'Other (Non-Fiction)'},
];


export const NarrationCostCalculatorSection: NextPage = () => {
  const [wordCount, setWordCount] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [genre, setGenre] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state

  const [estimatedHours, setEstimatedHours] = useState<number | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showCostDisplay, setShowCostDisplay] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const wc = parseInt(wordCount);
    if (wc > 0) {
      setEstimatedHours(wc / WORDS_PER_HOUR);
    } else {
      setEstimatedHours(null);
    }
  }, [wordCount]);

  useEffect(() => {
    if (estimatedHours !== null && selectedService && SERVICE_DETAILS[selectedService as keyof typeof SERVICE_DETAILS]) {
      const servicePrice = SERVICE_DETAILS[selectedService as keyof typeof SERVICE_DETAILS].price;
      setEstimatedCost(estimatedHours * servicePrice);
    } else {
      setEstimatedCost(null);
    }
  }, [estimatedHours, selectedService]);

  useEffect(() => {
    if (parseInt(wordCount) > 0 && selectedService) {
      setShowAdditionalFields(true);
    } else {
      setShowAdditionalFields(false);
      setGenre('');
      setFirstName('');
      setEmail('');
      setShowCostDisplay(false);
    }
  }, [wordCount, selectedService]);

  const handleGetEstimate = async () => {
    console.log("CLIENT: handleGetEstimate function called");
    setIsLoading(true); // Set loading to true
    const wc = parseInt(wordCount);
    const isEmailValid = email && email.includes('@') && email.split('@')[1]?.includes('.');
    const isFirstNameValid = firstName.trim() !== '';

    if (wc > 0 && genre && isFirstNameValid && isEmailValid && selectedService) {
      try {
        const result = await saveLead({ firstName: firstName.trim(), email, wordCount: wc, genre });
        if (result.success) {
          setShowCostDisplay(true);
          toast({
            title: "Estimate Saved",
            description: "Your estimated cost is displayed and your details have been saved.",
            variant: "default",
          });
        } else {
           setShowCostDisplay(false); // Keep form visible to correct errors
          toast({
            title: "Save Error",
            description: result.message || "An unknown error occurred while saving your estimate.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error calling saveLead action from client:", error);
        setShowCostDisplay(false); // Keep form visible
        toast({
          title: "System Error",
          description: error instanceof Error ? error.message : "Could not save your estimate. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setShowCostDisplay(false);
      let errorMessages: string[] = [];
      if (!(wc > 0)) errorMessages.push("- Valid word count is required.");
      if (!selectedService) errorMessages.push("- Service level must be selected.");
      if (!genre) errorMessages.push("- Genre must be selected.");
      if (!isFirstNameValid) errorMessages.push("- First name is required.");
      if (!isEmailValid) errorMessages.push("- A valid email is required.");
      
      toast({
        title: "Missing Information",
        description: `Please ensure all fields are correctly filled:\n${errorMessages.join("\n")}`,
        variant: "destructive",
      });
    }
    setIsLoading(false); // Set loading to false
  };
  

  return (
    <section id="cost-estimation-tool" className="py-16 sm:py-24 bg-secondary/5 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-3xl mx-auto shadow-xl bg-card">
          <CardHeader className="text-center px-6 pt-8 sm:px-8 sm:pt-10">
            <CardTitle className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Narration Cost Estimation Tool
            </CardTitle>
            <CardDescription className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Estimate the cost of your audiobook production. Fill in the details below to see your estimate and log your interest.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-8">
            <div>
              <Label htmlFor="wordCount" className="text-lg font-medium text-primary mb-2 block">
                1. Your manuscript&apos;s word count:
              </Label>
              <Input
                id="wordCount"
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                placeholder="e.g., 90000"
                className="text-base"
                min="0"
                disabled={isLoading}
              />
              {estimatedHours !== null && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Calculated audio length: {estimatedHours.toFixed(2)} hours.
                </p>
              )}
            </div>

            <div>
              <Label className="text-lg font-medium text-primary mb-2 block">
                2. Select service level:
              </Label>
              <RadioGroup
                value={selectedService ?? undefined}
                onValueChange={(value) => !isLoading && setSelectedService(value)}
                className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {Object.values(SERVICE_DETAILS).map((service) => {
                  const Icon = service.icon;
                  return (
                    <React.Fragment key={service.id}>
                      <RadioGroupItem value={service.id} id={`service-${service.id}`} className="sr-only" disabled={isLoading} />
                      <Label
                        htmlFor={`service-${service.id}`}
                        className={`
                          flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                          transition-all duration-200 ease-in-out h-full
                          hover:shadow-md
                          ${selectedService === service.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:border-primary/40'}
                          ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
                        `}
                      >
                        <Icon className={`h-8 w-8 mb-2 ${selectedService === service.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`font-semibold text-center text-sm ${selectedService === service.id ? 'text-primary' : 'text-card-foreground'}`}>
                          {service.label}
                        </span>
                      </Label>
                    </React.Fragment>
                  );
                })}
              </RadioGroup>
            </div>

            {showAdditionalFields && (
              <div className="space-y-8 pt-6 border-t border-border/50">
                <div>
                  <Label htmlFor="genre" className="text-lg font-medium text-primary mb-2 block">
                    3. Select Genre:
                  </Label>
                  <Select value={genre} onValueChange={(value) => !isLoading && setGenre(value)} disabled={isLoading}>
                    <SelectTrigger id="genre" className="mt-1 w-full text-base">
                      <SelectValue placeholder="Choose a genre..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fiction</SelectLabel>
                        {fictionGenreOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Non-Fiction</SelectLabel>
                        {nonFictionGenreOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="firstName" className="text-lg font-medium text-primary mb-2 block">
                    4. Your First Name:
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g., Alex"
                    className="text-base"
                    required
                    disabled={isLoading}
                  />
                   <p className="mt-1 text-xs text-muted-foreground">
                    Your first name is required.
                  </p>
                </div>

                <div>
                  <Label htmlFor="email" className="text-lg font-medium text-primary mb-2 block">
                    5. Your Email Address:
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="text-base"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your email is required to see the estimate and for our records. We respect your privacy.
                  </p>
                </div>
              </div>
            )}

            {showAdditionalFields && !showCostDisplay && (
                 <Button 
                    onClick={handleGetEstimate} 
                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold"
                    disabled={!wordCount || !selectedService || !genre || !firstName || !email || isLoading}
                  >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                   "Calculate & Save Estimate"
                  )}
                 </Button>
            )}

            {showCostDisplay && estimatedCost !== null && (
              <Card className="mt-6 p-6 bg-accent/5 border-accent shadow-lg">
                <CardHeader className="p-0 pb-3 text-center">
                  <CardTitle className="text-xl text-accent">
                    Estimated Project Cost
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-primary">
                    ${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
                    This is a preliminary estimate. Actual costs may vary. We have saved your estimate details.
                  </p>
                  <Button 
                    onClick={() => { 
                        setShowCostDisplay(false); 
                        setWordCount('');
                        setSelectedService(null);
                        setGenre('');
                        setFirstName('');
                        setEmail('');
                        setShowAdditionalFields(false); 
                        toast({title: "Form Cleared", description: "You can enter new details for another estimate."}) 
                    }}
                    className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 text-sm"
                    disabled={isLoading}
                  >
                    Start New Estimate
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NarrationCostCalculatorSection;

