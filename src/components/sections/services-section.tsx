
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioPlayer } from '@/components/ui/audio-player';
import { MicVocal, Brain, Blend } from 'lucide-react';

const services = [
  {
    icon: <MicVocal className="h-10 w-10 text-primary mb-4" />,
    title: 'Human Narration',
    description: 'Experience the rich, emotive power of professional human narrators. Perfect for character-driven stories and expressive content.',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
    aiHint: 'microphone studio'
  },
  {
    icon: <Brain className="h-10 w-10 text-primary mb-4" />,
    title: 'AI Narration',
    description: 'Leverage cutting-edge AI voice technology for clear, consistent, and cost-effective audiobook production. Ideal for non-fiction and rapid turnarounds.',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', // Placeholder audio
    aiHint: 'ai technology'
  },
  {
    icon: <Blend className="h-10 w-10 text-primary mb-4" />,
    title: 'Hybrid Narration',
    description: 'The best of both worlds. Combine AI precision for bulk narration with human touch for key sections, dialogues, or quality assurance.',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', // Placeholder audio
    aiHint: 'team collaboration'
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Our Narration Services
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Tailored solutions to bring your stories to life.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center text-center">
                {service.icon}
                <CardTitle className="text-2xl text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <CardDescription className="text-center mb-6 text-foreground/75 flex-grow">
                  {service.description}
                </CardDescription>
                <div className="mt-auto">
                  <AudioPlayer audioSrc={service.audioSrc} trackTitle={service.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
