// src/components/sections/team-section.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TeamSection() {
  const teamMembers = [
    {
      name: 'Josh Slone',
      title: 'Founder & Narration Director',
      imageUrl: '/images/profiles/josh-slone.jpg', // Updated to local image
      bio: "Josh is the visionary founder of Narration.Design, combining his passion for storytelling with expertise in audio production to direct captivating narrations.",
      fallback: 'JS',
      aiHint: 'male portrait',
    },
    {
      name: 'Ella Hartwood',
      title: 'Voice Artist and Marketing Lead',
      imageUrl: '/images/profiles/ella-hartwood.jpg', // Updated to local image
      bio: "Ella's exceptional vocal talent and keen ear for quality make her an invaluable voice artist and marketing lead, ensuring every audiobook shines.",
      fallback: 'EH',
      aiHint: 'female portrait',
    },
    {
      name: 'You?',
      title: 'Looking for Tech Savvy Vocalists!',
      imageUrl: 'https://via.placeholder.com/200/CCCCCC/FFFFFF?Text=You%3F',
      bio: "Passionate about voice and technology? We're looking for innovative individuals to join our team.",
      fallback: "Y?",
      aiHint: "question mark",
    },
  ];

  return (
    <section id="team" className="py-12 md:py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Meet Our Team
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We are a passionate team of seasoned authors, dedicated voice professionals, and innovative marketing specialists, united by our love for storytelling. We combine our diverse expertise to bring your book to life with a voice that resonates and a strategy that reaches your audience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center p-6 bg-background dark:bg-slate-700 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 shadow-md">
                <AvatarImage 
                  src={member.imageUrl} 
                  alt={`Profile picture of ${member.name}`} 
                  data-ai-hint={member.aiHint}
                />
                <AvatarFallback>{member.fallback || member.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1 text-primary">{member.name}</h3>
              <p className="text-accent dark:text-accent-foreground font-medium">{member.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
