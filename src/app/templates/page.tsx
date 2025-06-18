import { documentTemplates } from '@/lib/documentTemplates';
import TemplateCard from '@/components/TemplateCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function TemplatesPage() {
  // Basic filtering can be added here later
  // For now, just display all templates
  const categories = Array.from(new Set(documentTemplates.map(t => t.category)));

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline mb-4">Choose Your Document Template</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select from our professionally designed templates to get started. Whether it's for business, academic, or personal use, we have you covered.
        </p>
        <div className="mt-8 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search templates (e.g., invoice, cover letter...)" 
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </section>

      {categories.map(category => (
        <section key={category}>
          <h2 className="text-3xl font-semibold tracking-tight font-headline mb-6 pb-2 border-b-2 border-primary">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documentTemplates.filter(t => t.category === category).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
