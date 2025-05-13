// src/components/sections/contact-section.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const mailtoLink = `mailto:success@narration.design?subject=Contact Form Submission from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AReply to: ${encodeURIComponent(email)}`;
    window.location.href = mailtoLink;
  };

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
              Fill out the form, and we'll get back to you as soon as possible.
            </p>
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
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-lg font-medium text-primary mb-2 block">Message</Label>
              <Textarea
                id="message"
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="text-base"
              />
            </div>
            <Button onClick={handleSubmit} className="w-full text-lg py-3">
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
