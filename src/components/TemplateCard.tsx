import Link from 'next/link';
import type { DocumentTemplate } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  template: DocumentTemplate;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <template.icon className="w-10 h-10 text-primary mb-3" />
          {template.premium && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">Premium</Badge>
          )}
        </div>
        <CardTitle className="text-xl font-headline">{template.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground min-h-[40px]">{template.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-0">
        <Button asChild className="w-full" variant={template.premium ? "outline" : "default"}>
          <Link href={`/templates/${template.id}`}>
            {template.premium ? "Unlock Template" : "Use Template"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
