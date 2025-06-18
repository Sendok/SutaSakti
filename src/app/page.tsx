import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, Edit3, DownloadCloud } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: 'Versatile Templates',
      description: 'Choose from a variety of document types like cover letters, invoices, contracts, and academic papers.',
    },
    {
      icon: Edit3,
      title: 'AI-Powered Content',
      description: 'Leverage Gemini AI to generate text, summarize outlines, and help you craft the perfect document.',
    },
    {
      icon: DownloadCloud,
      title: 'Easy PDF Export',
      description: 'Preview your document and download it as a PDF with a single click.',
    },
  ];

  return (
    <div className="flex flex-col items-center text-center">
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4 text-left">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                  FormFlow AI: Your Smart Document Assistant
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Effortlessly create professional documents. Select a template, fill in the details, let AI assist, and download your PDF. Perfect for job seekers, students, and businesses in Asia and beyond.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/templates">Get Started Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="documents workspace"
              width="600"
              height="400"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
            />
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Simplify Your Document Workflow
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              FormFlow AI provides all the tools you need to generate high-quality documents quickly and efficiently.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-20 lg:py-28 bg-secondary/50">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Ready to Streamline Your Document Creation?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stop struggling with complex formatting. Start creating professional documents with FormFlow AI today.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
             <Button size="lg" asChild className="w-full">
                <Link href="/templates">Explore Templates</Link>
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
