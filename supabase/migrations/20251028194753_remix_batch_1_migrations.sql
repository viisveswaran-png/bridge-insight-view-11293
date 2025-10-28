
-- Migration: 20251027051550
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create news_articles table
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on news_articles
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- News articles policies (public read, authenticated write)
CREATE POLICY "News articles are viewable by everyone"
  ON public.news_articles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create news articles"
  ON public.news_articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own articles"
  ON public.news_articles FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own articles"
  ON public.news_articles FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on gallery_images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Gallery images policies (public read, authenticated write)
CREATE POLICY "Gallery images are viewable by everyone"
  ON public.gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload gallery images"
  ON public.gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own images"
  ON public.gallery_images FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own images"
  ON public.gallery_images FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Contact messages policies (anyone can submit, only authenticated can view)
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample news articles
INSERT INTO public.news_articles (title, description, image_url, published_date) VALUES
  ('Verstappen Dominates Monaco GP', 'Max Verstappen showcased an incredible performance to take the checkered flag in Monaco, thrilling fans worldwide.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800', '2024-06-10'),
  ('New Aero Package Revealed', 'Teams unveil cutting-edge aerodynamic upgrades ahead of the upcoming race, promising faster lap times.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', '2024-06-08'),
  ('Exclusive Interview with Lewis Hamilton', 'Lewis Hamilton shares insights on his training regimen and goals for the rest of the season.', 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800', '2024-06-05');

-- Insert sample gallery images
INSERT INTO public.gallery_images (image_url, caption, display_order) VALUES
  ('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800', 'Sleek Formula 1 car on track', 1),
  ('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Pit crew during fast pit stop', 2),
  ('https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800', 'Close-up of F1 front wing', 3),
  ('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800', 'Podium celebration', 4);
