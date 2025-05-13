// src/components/sections/team-section.tsx
import Image from 'next/image';

export function TeamSection() {
  const teamMembers = [
    {
      name: 'Josh Slone',
      title: 'Founder & Narration Director',
      imageUrl: '/images/profiles/josh-slone.jpg', 
      bio: 'Alex brings years of bestselling author experience to ensure your story\'s essence is perfectly captured.',
    },
    {
      name: 'Ella Hartwood',
      title: 'Voice Artist and Marketing Lead',
      imageUrl: '/images/profiles/ella-hartwood.jpg', 
      bio: 'With a voice that captivates and an ear for perfection, Brenda leads our vocal talent and quality assurance.',
    },
    {
      name: 'Carlos Diaz',
      title: 'Marketing & Outreach Strategist',
      imageUrl: 'https://via.placeholder.com/200/DDDDDD/555555?Text=Carlos', // Placeholder
      bio: 'Carlos connects compelling narratives with eager listeners through innovative marketing strategies.',
    },
  ];

  return (
    <section id="team" className="py-12 md:py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Meet Our Team
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We are a passionate team of seasoned authors, dedicated voice professionals, and innovative marketing specialists, united by our love for storytelling. We combine our diverse expertise to bring your book to life with a voice that resonates and a strategy that reaches your audience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center p-6 bg-background dark:bg-slate-700 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden mb-6 shadow-md">
                <Image
                  src={member.imageUrl}
                  alt={`Profile picture of ${member.name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 128px, 160px"
                  data-ai-hint={member.name === 'Josh Slone' ? 'man director' : member.name === 'Ella Hartwood' ? 'woman voice' : 'man marketing'}
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-accent dark:text-accent-foreground font-medium">{member.title}</p>
              {/* Optional: Add a short bio if desired */}
              {/* <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
