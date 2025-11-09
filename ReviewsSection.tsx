import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Verified } from "lucide-react";

// TODO: remove mock functionality
const reviews = [
  {
    id: 1,
    model: "Camry",
    author: "Michael R.",
    rating: 5,
    date: "2 weeks ago",
    excerpt: "Outstanding fuel efficiency and the hybrid system is incredibly smooth. Perfect for my daily commute and the reliability has been flawless.",
    verified: true
  },
  {
    id: 2,
    model: "RAV4",
    author: "Sarah K.",
    rating: 5,
    date: "1 month ago",
    excerpt: "Best SUV I've ever owned. The space is perfect for my family, and the safety features give me peace of mind. Worth every penny.",
    verified: true
  },
  {
    id: 3,
    model: "Corolla",
    author: "James T.",
    rating: 4,
    date: "3 weeks ago",
    excerpt: "Excellent value for money. Gets amazing gas mileage and has been incredibly reliable for the past 6 months. Very satisfied with this purchase.",
    verified: true
  },
  {
    id: 4,
    model: "Highlander",
    author: "Jennifer M.",
    rating: 5,
    date: "2 months ago",
    excerpt: "Perfect family vehicle with third-row seating. The technology package is intuitive and the ride is exceptionally comfortable even on long trips.",
    verified: true
  }
];

export default function ReviewsSection() {
  return (
    <div className="w-full py-24 bg-accent/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-[Lexend] mb-4">
            What Owners Are Saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real reviews from verified Toyota owners on CarGurus
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6 hover-elevate">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{review.author}</h4>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        <Verified className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.model} Owner • {review.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">
                "{review.excerpt}"
              </p>
              <Button variant="ghost" size="sm" className="text-xs" data-testid={`button-read-review-${review.id}`}>
                Read Full Review
                <ExternalLink className="ml-2 w-3 h-3" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Reviews sourced from CarGurus • Updated daily
          </p>
          <Button variant="outline" data-testid="button-view-all-reviews">
            View All Reviews
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
