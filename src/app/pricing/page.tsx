import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    frequency: '/month',
    description: 'Get started with basic document generation.',
    features: [
      { text: 'Access to standard templates', included: true },
      { text: 'AI-assisted text generation (limited)', included: true },
      { text: 'PDF Download', included: true },
      { text: 'Custom Templates', included: false },
      { text: 'Unlimited AI Generations', included: false },
      { text: 'Save Documents to Cloud', included: false },
      { text: 'Auto-translate to English', included: false },
    ],
    cta: 'Get Started for Free',
    href: '/templates',
  },
  {
    name: 'Pro',
    price: '$9.99',
    frequency: '/month',
    description: 'Unlock premium features for power users.',
    features: [
      { text: 'Access to ALL templates (including premium)', included: true },
      { text: 'Unlimited AI-assisted text generation', included: true },
      { text: 'PDF Download', included: true },
      { text: 'Custom Templates', included: true },
      { text: 'Save Documents to Cloud', included: true },
      { text: 'Auto-translate to English (Coming Soon)', included: true },
      { text: 'Priority Support', included: true },
    ],
    cta: 'Upgrade to Pro',
    href: '/login?plan=pro', // Example link, would go to signup/payment
    isFeatured: true,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold font-headline mb-4">Flexible Pricing for Everyone</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. Start for free or unlock powerful features with our Pro plan.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.isFeatured ? 'border-primary shadow-2xl ring-2 ring-primary' : 'shadow-lg'}`}>
            {plan.isFeatured && (
              <div className="py-2 px-4 bg-primary text-primary-foreground text-center font-semibold rounded-t-lg">
                Most Popular
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-headline">{plan.name}</CardTitle>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.frequency}</span>
              </div>
              <CardDescription className="pt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center">
                    {feature.included ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                    )}
                    <span className={!feature.included ? 'text-muted-foreground' : ''}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button size="lg" className={`w-full ${plan.isFeatured ? '' : 'bg-accent hover:bg-accent/90'}`} variant={plan.isFeatured ? 'default' : 'secondary'} asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <p className="text-center text-muted-foreground mt-12">
        All prices are in USD. Features and pricing are subject to change.
      </p>
    </div>
  );
}
