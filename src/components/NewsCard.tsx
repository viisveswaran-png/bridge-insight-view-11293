import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  publishedDate: string;
}

const NewsCard = ({ title, description, imageUrl, publishedDate }: NewsCardProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg hover:shadow-primary/20 transition-all overflow-hidden flex flex-col h-full">
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <CardHeader>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <time className="text-sm text-primary">
          {formatDistanceToNow(new Date(publishedDate), { addSuffix: true })}
        </time>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;