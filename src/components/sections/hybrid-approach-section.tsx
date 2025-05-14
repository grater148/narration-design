
import { AudioPlayer } from '@/components/ui/audio-player';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones, Bot } from 'lucide-react'; // Changed Wand2 to Bot

export function HybridApproachSection() {
  return (
    <section id="hybrid-approach" className="pt-8 sm:pt-12 pb-16 sm:pb-24 bg-secondary/5 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Our Hybrid Approach
          </h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">
            We combine the best of human artistry and AI efficiency to produce high-quality audiobooks at fair prices, ensuring your story resonates with listeners. Take a listen to the difference for yourself!
          </p>
        </div>

        {/* Row 1: Audio Players side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-10 sm:mb-14">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <Bot className="h-8 w-8 text-primary mb-2" /> {/* Changed Wand2 to Bot */}
              <CardTitle className="text-xl text-primary">Before (AI-only)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-muted-foreground mb-4">
                Listen to a raw AI-generated sample. Notice the clarity, but also areas where human nuance could enhance the delivery.
              </p>
              <AudioPlayer 
                audioSrc="/audio/Before Audio.mp3" // Placeholder
                trackTitle="Before (AI-only) Sample"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <Headphones className="h-8 w-8 text-accent mb-2" /> {/* Using accent color to differentiate from Human Touch section icon */}
              <CardTitle className="text-xl text-primary">After Our Human Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-muted-foreground mb-4">
                Hear the difference after our experts have refined the AI narration, adding depth, emotion, and polish.
              </p>
              <AudioPlayer 
                audioSrc="/audio/After Audio.mp3" // Placeholder
                trackTitle="After Our Human Touch Sample"
              />
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Text and "Why Hybrid Works" Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Human Touch Text */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Headphones className="h-10 w-10 text-accent" />
              <h3 className="text-2xl font-semibold text-primary">
                Listening with Human Ears
              </h3>
            </div>
            <p className="text-foreground/80 text-justify">
              While AI provides a consistent and scalable foundation, our human experts meticulously review and refine every AI-narrated segment. This crucial step involves correcting mispronunciations, adjusting pacing for emotional impact, and ensuring the narrative flows naturally. 
            </p>
            <p className="text-foreground/80 text-justify">
              Our team focuses on the nuances that AI might miss—subtle inflections, character-specific tones, and the overall emotional arc of your story. This 'human touch' elevates the final product from a mere reading to a truly engaging auditory experience.
            </p>
          </div>

          {/* Right Column: "Why Hybrid Works" Card */}
          <div>
            <Card className="bg-card shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Why Hybrid Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground/75">
                <p><strong>Quality Assurance:</strong> Human oversight guarantees a polished, error-free audiobook.</p>
                <p><strong>Emotional Depth:</strong> Experts ensure narration captures the intended tone and feeling.</p>
                <p><strong>Cost-Effectiveness:</strong> AI handles the bulk narration, reducing costs without sacrificing quality.</p>
                <p><strong>Consistency:</strong> AI maintains consistent voice characteristics, enhanced by human fine-tuning.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

