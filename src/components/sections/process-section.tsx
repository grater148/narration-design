
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  BookMarked,
  UsersRound,
  Award,
  ShieldCheck,
  Rocket,
  UploadCloud,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const processSteps = [
  {
    id: "manuscript-submission",
    title: "Manuscript Submission",
    icon: <BookMarked className="h-10 w-10 text-primary" />,
    description: "Securely submit your manuscript through our easy-to-use portal.",
    modalContent: "We'll review your manuscript to ensure it's a good fit for our services. We specialize in a wide range of genres but may not take on projects with certain subject matter. This initial check helps us align expectations and prepare for a successful collaboration."
  },
  {
    id: "voice-selection",
    title: "Voice Selection",
    icon: <UsersRound className="h-10 w-10 text-primary" />,
    description: "Choose from our diverse pool of talented human narrators or opt for a high-quality AI voice.",
    modalContent: "Finding the perfect voice is key. You can opt for a single narrator for the entire book (narration only) or a full cast where every character gets a unique voice. We typically have voice options for you within a few days, but it may take longer, depending on the number of characters in your book."
  },
  {
    id: "first-chapter-milestone",
    title: "First Chapter Milestone",
    icon: <Award className="h-10 w-10 text-primary" />,
    description: "Review and approve the first chapter to ensure the narration meets your expectations.",
    modalContent: "This is a crucial checkpoint. You'll receive the first narrated chapter, typically within 10 business days of finalizing voice selection. Your feedback ensures we're perfectly aligned with your vision before proceeding with the full narration."
  },
  {
    id: "full-transparency",
    title: "Full Transparency Throughout",
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    description: "Stay informed with regular updates and access to our project tracking system.",
    modalContent: "We believe in full transparency. Clients get access to our custom dashboard that shows which step of the process their audiobook is on at any given time. You'll always know the status of your project."
  },
  {
    id: "delivery",
    title: "Delivery!",
    icon: <Rocket className="h-10 w-10 text-primary" />,
    description: "Receive your professionally produced, ready-to-publish audiobook files.",
    modalContent: "Your completed audiobook, professionally edited and mastered, will be delivered. Delivery is typically within 45 days after character and voice selection is finalized. You'll receive high-quality audio files ready for distribution."
  },
  {
    id: "publishing-assistance",
    title: "Publishing Assistance (Optional)",
    icon: <UploadCloud className="h-10 w-10 text-primary" />,
    description: "Optionally, get expert help to navigate submission for platforms like Findaway Voices.",
    modalContent: "If you opt for publishing assistance, we'll help get your audiobook published on all platforms that approve AI Narration. This includes a growing list of distributors, and we'll guide you through the submission process for maximum reach.",
    isOptional: true,
  },
];

const DashedLineHorizontal = () => (
  <div className="flex-grow flex items-center justify-center px-1 sm:px-2" aria-hidden="true">
    <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" className="text-accent">
      <path d="M0,10 C 30,0 70,20 100,10" stroke="currentColor" strokeWidth="8" strokeDasharray="30, 15" fill="none" />
    </svg>
  </div>
);

const ProcessStepCard = ({ step, stepNumber, isOptional }: { step: typeof processSteps[0]; stepNumber?: number; isOptional?: boolean }) => (
  <Dialog>
    <DialogTrigger asChild>
      <div className="w-full h-auto md:h-full cursor-pointer">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full w-full relative">
          <div className="absolute top-0 left-0 p-2 z-10">
            {isOptional ? (
              <div className="flex items-center justify-center bg-accent text-accent-foreground rounded-full font-bold
                              h-10 w-10
                              sm:h-12 sm:w-12
                              md:h-14 md:w-14">
                <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-accent-foreground" />
              </div>
            ) : (
              stepNumber && (
                <div className="flex items-center justify-center bg-accent text-accent-foreground rounded-full font-bold
                                h-10 w-10 text-xl
                                sm:h-12 sm:w-12 sm:text-2xl
                                md:h-14 md:w-14 md:text-3xl">
                  {stepNumber}
                </div>
              )
            )}
          </div>
          <CardHeader className="items-center text-center pt-10 sm:pt-12 md:pt-14 pb-1 sm:pb-1.5 md:pb-2 flex-shrink-0">
            {React.cloneElement(step.icon, { className: "h-8 w-8 md:h-10 md:w-10 text-primary mb-1.5 md:mb-2" })}
            <CardTitle className="text-base lg:text-lg text-primary leading-tight px-1">
              {step.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-foreground/75 flex flex-col flex-1 px-2 md:px-3 pt-0 pb-3 md:pb-4 leading-tight min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0"> 
              <p>{step.description}</p>
            </div>
            <div className="flex-shrink-0 mt-auto pt-3 flex items-center justify-center"> 
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm leading-snug py-1.5 px-4">
                Find out more
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-primary flex items-center">
          {React.cloneElement(step.icon, { className: "h-6 w-6 mr-2" })}
          {step.title}
        </DialogTitle>
        <DialogDescription className="pt-2 text-foreground/80">
          {step.modalContent}
        </DialogDescription>
      </DialogHeader>
      <DialogClose asChild>
        <Button type="button" variant="outline" className="mt-4">
          Close
        </Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);


export function ProcessSection() {
  const firstRowSteps = processSteps.slice(0, 3);
  const secondRowSteps = processSteps.slice(3);

  return (
    <section id="process" className="pt-8 sm:pt-12 pb-16 sm:pb-24 bg-secondary/10 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Our Audiobook Creation Process
          </h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            A clear path from your manuscript to a captivating audiobook, ensuring quality and collaboration at every step.
          </p>
        </div>

        {/* Desktop View - 3x2 Grid */}
        <div className="hidden md:flex flex-col items-center space-y-8 lg:space-y-10">
          {/* First Row */}
          <div className="flex flex-row items-stretch justify-center w-full gap-x-4 sm:gap-x-6 lg:gap-x-8">
            {firstRowSteps.map((step, index) => (
              <React.Fragment key={step.id + "-desktop-row1"}>
                <div className="flex-1 min-w-0">
                  <ProcessStepCard step={step} stepNumber={index + 1} />
                </div>
                {index < firstRowSteps.length - 1 && (
                  <div className="flex-shrink-0 flex items-center justify-center w-10 sm:w-12 md:w-16 self-center">
                    <DashedLineHorizontal />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Second Row */}
          {secondRowSteps.length > 0 && (
            <div className="flex flex-row items-stretch justify-center w-full gap-x-4 sm:gap-x-6 lg:gap-x-8">
              {secondRowSteps.map((step, index) => (
                <React.Fragment key={step.id + "-desktop-row2"}>
                  <div className="flex-1 min-w-0">
                     <ProcessStepCard
                        step={step}
                        stepNumber={!step.isOptional ? (index + 1 + firstRowSteps.length) : undefined}
                        isOptional={step.isOptional}
                      />
                  </div>
                  {index < secondRowSteps.length - 1 && (
                     <div className="flex-shrink-0 flex items-center justify-center w-10 sm:w-12 md:w-16 self-center">
                       <DashedLineHorizontal />
                     </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Mobile View - Stacked */}
        <div className="md:hidden flex flex-col items-center">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.id + "-mobile"}>
              <div className="w-full max-w-xs sm:max-w-sm mb-6">
                <ProcessStepCard
                  step={step}
                  stepNumber={!step.isOptional ? (index + 1) : undefined}
                  isOptional={step.isOptional}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform transition-transform hover:scale-105">
            <Link href="#cost-estimation-tool">
              Use Narration Cost Estimation Tool
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

