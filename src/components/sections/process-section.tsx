
'use client';

import React from 'react';
import {
  BookMarked,
  UsersRound,
  Award,
  ShieldCheck,
  Rocket,
  UploadCloud,
  Lightbulb, // Added for optional step
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const processSteps = [
  {
    title: "Manuscript Submission",
    icon: <BookMarked className="h-10 w-10 text-primary" />,
    description: "Securely submit your manuscript through our easy-to-use portal.",
  },
  {
    title: "Voice Selection",
    icon: <UsersRound className="h-10 w-10 text-primary" />,
    description: "Choose from our diverse pool of talented human narrators or opt for a high-quality AI voice.",
  },
  {
    title: "First Chapter Milestone",
    icon: <Award className="h-10 w-10 text-primary" />,
    description: "Review and approve the first chapter to ensure the narration meets your expectations.",
  },
  {
    title: "Full Transparency Throughout",
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    description: "Stay informed with regular updates and access to our project tracking system.",
  },
  {
    title: "Delivery!",
    icon: <Rocket className="h-10 w-10 text-primary" />,
    description: "Receive your professionally produced, ready-to-publish audiobook files.",
  },
  {
    title: "Publishing Assistance (Optional)",
    icon: <UploadCloud className="h-10 w-10 text-primary" />, // Main icon
    description: "Optionally, get expert help to navigate submission for platforms like Findaway Voices.",
    isOptional: true,
  },
];

const DashedLineHorizontal = () => (
  <div className="flex-grow flex items-center justify-center px-1 sm:px-2" aria-hidden="true">
    <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" className="text-accent">
      <path d="M0,10 C 30,0 70,20 100,10" stroke="currentColor" strokeWidth="3" strokeDasharray="6,6" fill="none" />
    </svg>
  </div>
);

const DashedLineVertical = () => (
 <div className="w-full md:w-auto md:h-full flex items-center justify-center py-2 md:py-0" aria-hidden="true">
    <svg width="20" height="100%" viewBox="0 0 20 100" preserveAspectRatio="none" className="text-accent">
      <path d="M10,0 C 0,30 20,70 10,100" stroke="currentColor" strokeWidth="3" strokeDasharray="6,6" fill="none" />
    </svg>
  </div>
);

const ProcessStepCard = ({ step, stepNumber, isOptional }: { step: typeof processSteps[0]; stepNumber?: number; isOptional?: boolean }) => (
  <div className="aspect-square w-full h-full">
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full w-full relative overflow-hidden">
      <div className="absolute top-0 left-0 p-2 z-10">
        {isOptional ? (
          <Lightbulb className="h-6 w-6 sm:h-7 md:h-8 text-accent" />
        ) : (
          stepNumber && (
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent">
              {stepNumber}
            </span>
          )
        )}
      </div>
      <CardHeader className="items-center text-center pt-10 sm:pt-12 md:pt-14 pb-1 sm:pb-1.5 md:pb-2 flex-shrink-0"> {/* Increased top padding */}
        {React.cloneElement(step.icon, { className: "h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary mb-1 sm:mb-1.5 md:mb-2" })}
        <CardTitle className="text-xs sm:text-sm md:text-base lg:text-lg text-primary leading-tight px-1">
          {step.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center text-[0.65rem] sm:text-xs md:text-sm text-foreground/75 pb-2 sm:pb-3 md:pb-4 flex-grow overflow-y-auto px-1.5 sm:px-2 md:px-3 scrollbar-thin">
        <p>{step.description}</p>
      </CardContent>
    </Card>
  </div>
);


export function ProcessSection() {
  const firstRowSteps = processSteps.slice(0, 3);
  const secondRowSteps = processSteps.slice(3);

  return (
    <section id="process" className="py-16 sm:py-24 bg-secondary/10">
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
        <div className="hidden md:flex flex-col items-center space-y-6 lg:space-y-8">
          {/* First Row */}
          <div className="flex flex-row items-stretch justify-center w-full gap-x-4 sm:gap-x-6 lg:gap-x-8">
            {firstRowSteps.map((step, index) => (
              <React.Fragment key={step.title + "-desktop-row1"}>
                <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-xs">
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

          {/* Connecting Line (Vertical) */}
          {secondRowSteps.length > 0 && (
            <div className="flex justify-center w-full h-12 sm:h-16 lg:h-20">
                <DashedLineVertical />
            </div>
          )}

          {/* Second Row */}
          {secondRowSteps.length > 0 && (
            <div className="flex flex-row items-stretch justify-center w-full gap-x-4 sm:gap-x-6 lg:gap-x-8">
              {secondRowSteps.map((step, index) => (
                <React.Fragment key={step.title + "-desktop-row2"}>
                  <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-xs">
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
            <React.Fragment key={step.title + "-mobile"}>
              <div className="w-full max-w-xs sm:max-w-sm mb-3">
                <ProcessStepCard
                  step={step}
                  stepNumber={!step.isOptional ? (index + 1) : undefined}
                  isOptional={step.isOptional}
                />
              </div>
              {index < processSteps.length - 1 && (
                <div className="w-full max-w-xs flex justify-center h-12 sm:h-16 my-1">
                    <DashedLineVertical />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
