
'use client';

import React from 'react';
import {
  BookMarked,
  UsersRound,
  Award,
  ShieldCheck,
  Rocket,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const processSteps = [
  {
    title: "Manuscript Submission",
    icon: <BookMarked className="h-10 w-10 text-primary mb-3" />,
    description: "Securely submit your manuscript through our easy-to-use portal.",
  },
  {
    title: "Voice Selection",
    icon: <UsersRound className="h-10 w-10 text-primary mb-3" />,
    description: "Choose from our diverse pool of talented human narrators or opt for a high-quality AI voice.",
  },
  {
    title: "First Chapter Milestone",
    icon: <Award className="h-10 w-10 text-primary mb-3" />,
    description: "Review and approve the first chapter to ensure the narration meets your expectations.",
  },
  {
    title: "Full Transparency Throughout",
    icon: <ShieldCheck className="h-10 w-10 text-primary mb-3" />,
    description: "Stay informed with regular updates and access to our project tracking system.",
  },
  {
    title: "Delivery!",
    icon: <Rocket className="h-10 w-10 text-primary mb-3" />,
    description: "Receive your professionally produced, ready-to-publish audiobook files.",
  },
];

const DashedArrow = () => (
  <div className="flex-grow flex items-center justify-center px-1 sm:px-2" aria-hidden="true">
    <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" className="text-accent">
      <line x1="0" y1="10" x2="90" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="85,5 100,10 85,15" fill="currentColor" />
    </svg>
  </div>
);

const DashedArrowVertical = () => (
 <div className="w-full flex items-center justify-center py-4 h-20" aria-hidden="true">
    <svg width="20" height="100%" viewBox="0 0 20 100" preserveAspectRatio="none" className="text-accent">
      <line x1="10" y1="0" x2="10" y2="90" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="5,85 10,100 15,85" fill="currentColor" />
    </svg>
  </div>
);

export function ProcessSection() {
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

        {/* Desktop View */}
        <div className="hidden md:flex flex-row items-stretch justify-center">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="flex-1 min-w-0 px-1 lg:px-2"> {/* Card container */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader className="items-center text-center pt-6">
                    {step.icon}
                    <CardTitle className="text-xl lg:text-2xl text-primary">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm lg:text-base text-foreground/75 pb-6 flex-grow">
                    <p>{step.description}</p>
                  </CardContent>
                </Card>
              </div>
              {index < processSteps.length - 1 && (
                <div className="flex-shrink-0 flex items-center justify-center w-12 lg:w-20 xl:w-24"> {/* Arrow container */}
                  <DashedArrow />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col items-center space-y-0">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="w-full max-w-md p-2">
                <Card className="shadow-lg">
                  <CardHeader className="items-center text-center pt-6">
                    {step.icon}
                    <CardTitle className="text-xl text-primary">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-foreground/75 pb-6">
                    <p>{step.description}</p>
                  </CardContent>
                </Card>
              </div>
              {index < processSteps.length - 1 && (
                <DashedArrowVertical />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
