import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Newspaper, Play, Podcast, Building } from "lucide-react";
import type { EducationalResource } from "@shared/schema";

export default function Resources() {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: resources, isLoading } = useQuery<EducationalResource[]>({
    queryKey: ["/api/resources"],
  });

  const filteredResources = resources?.filter(resource => 
    activeFilter === "all" || resource.type === activeFilter
  ) || [];

  const filters = [
    { key: "all", label: "All Resources", count: resources?.length || 0 },
    { key: "article", label: "Articles", count: resources?.filter(r => r.type === "article").length || 0 },
    { key: "video", label: "Videos", count: resources?.filter(r => r.type === "video").length || 0 },
    { key: "podcast", label: "Podcasts", count: resources?.filter(r => r.type === "podcast").length || 0 },
    { key: "organization", label: "Organizations", count: resources?.filter(r => r.type === "organization").length || 0 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return Newspaper;
      case "video": return Play;
      case "podcast": return Podcast;
      case "organization": return Building;
      default: return Newspaper;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article": return "bg-blue-100 text-blue-800";
      case "video": return "bg-red-100 text-red-800";
      case "podcast": return "bg-purple-100 text-purple-800";
      case "organization": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Educational Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated content to help you continue your journey toward greater awareness and inclusivity
          </p>
        </div>

        {/* Resource Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.key)}
              className="px-6 py-3 rounded-xl font-medium"
            >
              {filter.label}
              {filter.count > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filter.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            
            return (
              <Card key={resource.id} className="overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                {resource.imageUrl && (
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getTypeColor(resource.type)}>
                      <TypeIcon className="mr-2 h-3 w-3" />
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </Badge>
                    {resource.duration && (
                      <span className="text-sm text-gray-500">{resource.duration}</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  
                  {resource.source && (
                    <p className="text-xs text-gray-500 mb-4">
                      Source: {resource.source}
                    </p>
                  )}
                  
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    {resource.type === "video" ? "Watch Video" :
                     resource.type === "podcast" ? "Listen Now" :
                     resource.type === "organization" ? "Visit Website" :
                     "Read Newspaper"}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredResources.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No resources found for the selected filter.</p>
            <Button onClick={() => setActiveFilter("all")}>
              Show All Resources
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
