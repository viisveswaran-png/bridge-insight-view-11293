import { Link } from "react-router-dom";
import { Trophy, Car, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import RacingBackground from "@/components/RacingBackground";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <RacingBackground />
      <Navigation user={user} />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 
            className="text-5xl md:text-6xl font-extrabold text-primary drop-shadow-lg"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Welcome to Hybrutos Racing
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
            Join the ultimate community for Formula 1 car enthusiasts. Stay updated with the latest news, events, and exclusive content.
          </p>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button size="lg" className="mt-6 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-primary/50 transition-all">
              {user ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Link>
        </section>

        {/* About Section */}
        <section className="max-w-4xl mx-auto space-y-8" id="about">
          <h2 
            className="text-4xl font-bold text-primary border-b-4 border-primary inline-block pb-2"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            About Us
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Hybrutos Racing is a passionate community dedicated to everything Formula 1. From the history of the sport to the latest races, we bring fans together to share their love for speed, technology, and competition.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-primary/20 transition-all border border-border">
              <Trophy className="text-primary w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exclusive Events</h3>
              <p className="text-muted-foreground">
                Attend meetups, watch parties, and track days with fellow members.
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-primary/20 transition-all border border-border">
              <Car className="text-primary w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Car Showcases</h3>
              <p className="text-muted-foreground">
                Explore detailed showcases of iconic F1 cars and their engineering marvels.
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-primary/20 transition-all border border-border">
              <Users className="text-primary w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Connect with fans worldwide and share your passion for Formula 1.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 bg-card/30 backdrop-blur-sm rounded-lg p-12 border border-border">
          <h2 
            className="text-3xl font-bold text-primary"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Ready to Join the Community?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the latest F1 news, browse our gallery, and connect with fellow racing enthusiasts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/news">
              <Button variant="default" size="lg">Latest News</Button>
            </Link>
            <Link to="/gallery">
              <Button variant="outline" size="lg">View Gallery</Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="lg">Contact Us</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;