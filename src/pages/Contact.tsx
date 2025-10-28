import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RacingBackground from "@/components/RacingBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

const Contact = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);

      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message,
        }]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <RacingBackground />
      <Navigation user={user} />
      
      <main className="flex-grow max-w-3xl mx-auto px-6 py-12">
        <h1 
          className="text-4xl md:text-5xl font-bold text-primary mb-12 border-b-4 border-primary inline-block pb-2"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="bg-card/50 backdrop-blur-sm rounded-lg p-8 shadow-lg space-y-6 border border-border">
          <div>
            <Label htmlFor="name" className="text-foreground font-semibold">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-2 bg-input border-border focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-2 bg-input border-border focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-foreground font-semibold">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              className="mt-2 bg-input border-border focus:border-primary"
            />
          </div>

          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-primary/50 transition-all"
          >
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;