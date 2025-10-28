import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RacingBackground from "@/components/RacingBackground";
import { Loader2 } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

const Gallery = () => {
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching gallery images:', error);
      } else {
        setImages(data || []);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <RacingBackground />
      <Navigation user={user} />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12">
        <h1 
          className="text-4xl md:text-5xl font-bold text-primary mb-12 border-b-4 border-primary inline-block pb-2"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Gallery
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div 
                key={image.id}
                className="rounded-lg overflow-hidden shadow-lg hover:scale-105 hover:shadow-primary/30 transition-transform cursor-pointer border border-border"
              >
                <img 
                  src={image.image_url} 
                  alt={image.caption || 'F1 Gallery Image'}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;