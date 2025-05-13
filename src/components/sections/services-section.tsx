
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioPlayer } from '@/components/ui/audio-player';
import { User, Users, Speaker } from 'lucide-react';

const services = [
  {
    icon: <User className="h-10 w-10 text-primary mb-4" />,
    title: 'Narration Only',
    description: 'A single, captivating voice narrates your entire book, perfect for straightforward storytelling and non-fiction.',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder audio
    aiHint: 'audiobook recording'
  },
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: 'Full Cast',
    description: 'Bring your characters to life with unique voices for each role, creating a dynamic and engaging listening experience.',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', // Placeholder audio
    aiHint: 'voice actors'
  },
  {
    icon: <Speaker className="h-10 w-10 text-primary mb-4" />,
    title: 'Immersive Audio',
    description: 'Go beyond narration with a full cast and rich sound effects, enveloping your listener in the world of your story.',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', // Placeholder audio
    aiHint: 'sound design'
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

