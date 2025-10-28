import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RacingBackground from "@/components/RacingBackground";
import NewsCard from "@/components/NewsCard";
import { Loader2 } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image_url: string;
  published_date: string;
}

const News = () => {
  const [user, setUser] = useState<User | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
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
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
      } else {
        setNews(data || []);
      }
      setLoading(false);
    };

    fetchNews();
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
          Latest News
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                description={article.description}
                imageUrl={article.image_url}
                publishedDate={article.published_date}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default News;