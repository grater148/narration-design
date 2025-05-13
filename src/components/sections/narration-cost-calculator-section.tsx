
"use client";

import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Speaker } from 'lucide-react';

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
];


export const NarrationCostCalculatorSection: NextPage = () => {
  const [wordCount, setWordCount] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [genre, setGenre] = useState('');
  const [email, setEmail] = useState('');

  const [estimatedHours, setEstimatedHours] = useState<number | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showCostDisplay, setShowCostDisplay] = useState(false);

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
      setEmail('');
      setShowCostDisplay(false);
    }
  }, [wordCount, selectedService]);

  useEffect(() => {
    const isEmailValid = email && email.includes('@') && email.split('@')[1]?.includes('.');
    if (isEmailValid && showAdditionalFields && genre) {
      setShowCostDisplay(true);
    } else {
      setShowCostDisplay(false);
    }
  }, [email, genre, showAdditionalFields]);

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };
  
  return (
    <section id="cost-calculator" className="py-16 sm:py-24 bg-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Narration Cost Calculator
          </h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Estimate the cost of your audiobook production. Results are shown after providing word count, service type, genre and email.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <Label htmlFor="wordCount" className="text-lg font-medium text-primary mb-1 block">
              1. Your manuscript&apos;s word count:
            </Label>
            <Input
              id="wordCount"
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              placeholder="e.g., 90000"
              className="mt-1 text-base"
              min="0"
            />
            {estimatedHours !== null && (
              <p className="mt-2 text-sm text-muted-foreground">
                Calculated audio length: {estimatedHours.toFixed(2)} hours.
              </p>
            )}
          </div>

          <div>
            <Label className="text-lg font-medium text-primary mb-1 block">
              2. Select service level:
            </Label>
            <RadioGroup
              value={selectedService ?? undefined}
              onValueChange={handleServiceChange}
              className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {Object.values(SERVICE_DETAILS).map((service) => {
                const Icon = service.icon;
                return (
                  <React.Fragment key={service.id}>
                    <RadioGroupItem value={service.id} id={`service-${service.id}`} className="sr-only" />
                    <Label
                      htmlFor={`service-${service.id}`}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                        transition-all duration-200 ease-in-out h-full
                        hover:shadow-md
                        ${selectedService === service.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:border-primary/40'}
                      `}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${selectedService === service.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-semibold text-center text-sm ${selectedService === service.id ? 'text-primary' : 'text-card-foreground'}`}>
                        {service.label}
                      </span>
                      {/* Cost per hour removed as per request */}
                      {/* 
                      <span className="text-xs text-muted-foreground mt-1">
                        ${service.price}/audio hour
                      </span>
                      */}
                    </Label>
                  </React.Fragment>
                );
              })}
            </RadioGroup>
          </div>

          {showAdditionalFields && (
            <div className="space-y-8 pt-6 border-t border-border/50">
              <div>
                <Label htmlFor="genre" className="text-lg font-medium text-primary mb-1 block">
                  3. Select Genre:
                </Label>
                <Select value={genre} onValueChange={setGenre}>
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
                     <SelectItem value="other-genre">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email" className="text-lg font-medium text-primary mb-1 block">
                  4. Your Email Address:
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 text-base"
                />
                 <p className="mt-1 text-xs text-muted-foreground">
                  Enter your email to see the estimate! We respect your privacy and DO NOT share your email.
                </p>
              </div>
            </div>
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
                  This is a preliminary estimate. Actual costs may vary based on script complexity, number of distinct voices (for Full Cast), and specific sound design requirements (for Immersive Audio).
                </p>
                <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 text-sm">
                  Request a Detailed Quote
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default NarrationCostCalculatorSection;

