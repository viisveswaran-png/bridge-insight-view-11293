-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Update profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update news_articles table
ALTER TABLE public.news_articles 
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Rename published_date to match if needed, or copy data
UPDATE public.news_articles SET published_at = published_date::timestamp WHERE published_at IS NULL;

-- Add trigger for news_articles
DROP TRIGGER IF EXISTS update_news_articles_updated_at ON public.news_articles;
ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
CREATE TRIGGER update_news_articles_updated_at
BEFORE UPDATE ON public.news_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update gallery_images table
ALTER TABLE public.gallery_images 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Copy created_at to uploaded_at if needed
UPDATE public.gallery_images SET uploaded_at = created_at WHERE uploaded_at IS NULL;

-- Add trigger for gallery_images
DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON public.gallery_images;
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();