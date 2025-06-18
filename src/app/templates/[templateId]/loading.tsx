import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function LoadingTemplateForm() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end space-x-3 p-6 border-t">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
       <div className="flex justify-center items-center min-h-[20vh] mt-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading template details...</p>
      </div>
    </div>
  );
}
