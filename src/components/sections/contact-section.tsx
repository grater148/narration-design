
// src/components/sections/contact-section.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveContactMessage, type SaveContactMessageResult } from "@/app/actions/saveContactMessage";
import { Loader2 } from "lucide-react";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    const result: SaveContactMessageResult = await saveContactMessage({ name, email, message });
    console.log(result);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Message Sent!",
        description: result.message,
        variant: "default",
      });
      // Clear form
      setName("");
      setEmail("");
      setMessage("");
    } else {
      toast({
        title: "Error Sending Message",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const isFormValid = name.trim() !== "" && email.trim() !== "" && message.trim().length >= 10;

  return (
    <section id="contact" className="py-12 md:py-20 bg-background dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              Get in Touch!
            </h2>
            <p className="text-lg text-muted-foreground">
              Have a question, a project idea, or just want to say hello? We'd love to hear from you.
            </p>
            <p className="text-lg text-muted-foreground">
              Fill out the form, and we'll get back to you as soon as possible. Or, book a consultation below.
            </p>
            <a 
              href="https://narration-design.agiled.app/event/4b29fa4efe4fb7bc667c7b301b74d52d" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-3 px-6 mt-4"
              >
                Book a Narration Consult
              </Button>
            </a>
          </div>
          <div className="space-y-6 p-6 md:p-8 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-lg">
            <div>
              <Label htmlFor="name" className="text-lg font-medium text-primary mb-2 block">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-base"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-lg font-medium text-primary mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-base"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-lg font-medium text-primary mb-2 block">Message (min. 10 characters)</Label>
              <Textarea
                id="message"
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="text-base"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleSubmit} 
              className="w-full text-lg py-3"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Removed the Agiled embed script and related useEffect/global type definitions
