
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import type { DocumentTemplate, GeneratedDocument } from '@/types';
import { documentTemplates } from '@/lib/documentTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Eye, Printer, Edit } from 'lucide-react';
import DocumentPreviewClient from '@/components/DocumentPreviewClient';

// AI Flow Imports
import { summarizeEssayOutline } from '@/ai/flows/summarize-essay-outline';
import { generateDocumentText } from '@/ai/flows/generate-document-text';

export default function TemplateFormPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const templateId = params.templateId as string;

  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formSchema, setFormSchema] = useState<z.ZodObject<any>>(z.object({}));
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const currentTemplate = documentTemplates.find((t) => t.id === templateId);
    if (currentTemplate) {
      setTemplate(currentTemplate);

      const shape: Record<string, z.ZodTypeAny> = {};
      const defaults: Record<string, any> = {};
      currentTemplate.formFields.forEach((field) => {
        let zodType: z.ZodTypeAny;
        switch (field.type) {
          case 'email':
            zodType = z.string().email({ message: "Invalid email address" });
            break;
          case 'number':
            zodType = z.coerce.number(); // Use coerce for numbers
            break;
          default:
            zodType = z.string();
        }
        if (field.required) {
          // For numbers, min(1) might not be appropriate if 0 is allowed.
          // For strings, min(1) is fine for "required".
          if (field.type === 'number') {
            // If you want to ensure it's not empty, you might need a refine or a specific check
            // For now, required for number means it must be a number.
            // If 0 is a valid required number, this is fine.
          } else {
            zodType = zodType.min(1, { message: `${field.label} is required` });
          }
        } else {
          zodType = zodType.optional();
        }
        shape[field.id] = zodType;
        defaults[field.id] = field.defaultValue || (field.type === 'number' ? '' : ''); // Default to empty string for uncontrolled -> controlled
      });

      setFormSchema(z.object(shape));
      setDefaultValues(defaults);
      setIsLoading(false);
    } else {
      router.push('/templates');
    }
  }, [templateId, router]);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

   useEffect(() => {
    if (template) {
      const newDefaults: Record<string, any> = {};
      template.formFields.forEach(field => {
        newDefaults[field.id] = field.defaultValue || (field.type === 'number' ? '' : '');
      });
      // Only reset if the calculated newDefaults are different from current form values
      // This is a shallow comparison, might need deep if structure is complex
      if (JSON.stringify(newDefaults) !== JSON.stringify(form.getValues())) {
        form.reset(newDefaults);
      }
      // It might be better to just update defaultValues state and let useForm handle it if needed
      // setDefaultValues(newDefaults); // This line might be redundant if form.reset does the job
    }
  }, [template, form]); // form.reset is stable, form.getValues is not. Adding form as dep.


  const handleAiGenerate: SubmitHandler<Record<string, any>> = async (data) => {
    if (!template || !template.aiFlow || template.aiFlow === 'none') {
      toast({ title: "AI Not Applicable", description: "This template does not use AI generation or specific AI fields are missing.", variant: "destructive" });
      return;
    }
    setIsAiLoading(true);
    try {
      let aiResultText = '';
      if (template.aiFlow === 'summarizeEssayOutline') {
        const outlineField = template.formFields.find(f => f.aiFieldMap === 'outline');
        if (outlineField && data[outlineField.id]) {
          const result = await summarizeEssayOutline({ outline: data[outlineField.id] });
          aiResultText = result.essayDraft;
          // Update the 'generatedContent' field or a primary textarea
          const targetContentField = template.formFields.find(f => f.id === 'generatedContent') || 
                                     template.formFields.find(f => f.type === 'textarea' && f.aiFieldMap !== 'outline');
          if (targetContentField) {
            form.setValue(targetContentField.id, aiResultText);
          } else {
            // If this template specifically uses 'outline' to generate into itself or another field
            form.setValue(outlineField.id, aiResultText); // Example: update outline field directly
          }

        } else {
          throw new Error("Outline field is missing or empty for academic paper AI generation.");
        }
      } else if (template.aiFlow === 'generateDocumentText') {
        let userInput = template.aiPromptInstruction || `Generate a ${template.name} with the following information:\n`;
        template.formFields.filter(f => f.aiRelevant).forEach(field => {
          if (data[field.id]) {
            userInput += `${field.label}: ${data[field.id]}\n`;
          }
        });

        const mainAiContentFieldId = template.formFields.find(f => f.id === 'letterBody' || f.id === 'servicesDescription')?.id;

        const result = await generateDocumentText({ documentType: template.name, userInput });
        aiResultText = result.generatedText;

        if (mainAiContentFieldId) {
             form.setValue(mainAiContentFieldId, aiResultText);
        } else {
            const targetField = template.formFields.find(f => f.type === 'textarea' && f.id !== (template.formFields.find(fld => fld.aiFieldMap === 'outline')?.id))
                                || template.formFields.find(f => f.id === 'generatedContent');
            if (targetField) {
                form.setValue(targetField.id, aiResultText);
            } else {
                 console.warn("No designated field to place AI generated content for this template type without a primary content field.");
                 form.setValue('generatedContent', aiResultText); 
            }
        }
      }

      toast({ title: "AI Generation Successful", description: "Content has been generated and updated.", variant: "default", className: "bg-green-500 text-white" });
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast({ title: "AI Generation Failed", description: (error as Error).message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSubmit: SubmitHandler<Record<string, any>> = (data) => {
    if (!template) return;
    const htmlContent = template.renderPreview(data);
    setGeneratedDocument({
      title: template.name,
      content: htmlContent,
      formData: data,
      templateId: template.id,
    });
    setShowPreview(true);
    toast({ title: "Document Ready for Preview", description: "Scroll down to see your document.", className: "bg-primary text-primary-foreground" });
  };

  if (isLoading || !template) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading template...</p>
      </div>
    );
  }

  const Icon = template.icon;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8 shadow-xl">
        <CardHeader className="bg-muted/30 relative p-6">
          <div className="flex items-center space-x-3">
            <Icon className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-headline">{template.name}</CardTitle>
              <CardDescription className="text-md">{template.description}</CardDescription>
            </div>
          </div>
           {template.premium && <Badge variant="secondary" className="absolute top-4 right-4 bg-accent text-accent-foreground">Premium</Badge>}
        </CardHeader>

        {!showPreview ? (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6 space-y-6">
              {template.formFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label htmlFor={field.id} className="text-base">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  <Controller
                    name={field.id}
                    control={form.control}
                    defaultValue={defaultValues[field.id] ?? ''} // Use processed defaultValues
                    render={({ field: controllerField, fieldState: { error } }) => (
                      <>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.id}
                            placeholder={field.placeholder}
                            rows={field.rows || 3}
                            {...controllerField}
                            value={controllerField.value ?? ''}
                            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
                          />
                        ) : field.type === 'select' && field.options ? (
                           <Select
                              onValueChange={controllerField.onChange}
                              value={controllerField.value ?? ''}
                              defaultValue={controllerField.value ?? ''}
                            >
                            <SelectTrigger id={field.id} className={error ? 'border-destructive focus-visible:ring-destructive' : ''}>
                              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            {...controllerField}
                            value={controllerField.value ?? ''}
                            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
                          />
                        )}
                        {error && <p className="text-sm text-destructive font-medium">{error.message}</p>}
                      </>
                    )}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 p-6 border-t">
              {template.aiFlow && template.aiFlow !== 'none' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={form.handleSubmit(handleAiGenerate)}
                  disabled={isAiLoading}
                  className="w-full sm:w-auto"
                >
                  {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Generate with AI
                </Button>
              )}
              <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90">
                <Eye className="mr-2 h-4 w-4" />
                Preview Document
              </Button>
            </CardFooter>
          </form>
        ) : (
          generatedDocument && (
            <>
              <CardContent className="p-0">
                 <DocumentPreviewClient document={generatedDocument} />
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 p-6 border-t non-printable">
                <Button variant="outline" onClick={() => setShowPreview(false)} className="w-full sm:w-auto">
                  <Edit className="mr-2 h-4 w-4" /> Edit Form
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto"
                  aria-label="Print or Save as PDF"
                >
                  <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
                </Button>
              </CardFooter>
            </>
          )
        )}
      </Card>

      {showPreview && (
          <Card className="mt-8 non-printable">
            <CardHeader>
              <CardTitle>Advertisements</CardTitle>
            </CardHeader>
            <CardContent className="h-32 bg-muted flex items-center justify-center rounded-md">
              <p className="text-muted-foreground">Ad placeholder - Support FormFlow AI!</p>
            </CardContent>
          </Card>
        )}

      <style jsx global>{`
        @media print {
          html, body {
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          .printable-area, .printable-area * {
            visibility: visible !important;
            animation: none !important; /* Disable animations for printing */
            transition: none !important; /* Disable transitions for printing */
          }
          .printable-area {
            display: block !important;
            position: fixed !important; /* Changed to fixed for better full page behavior */
            left: 0 !important;
            top: 0 !important;
            right: 0 !important; /* Added right for full width */
            bottom: 0 !important; /* Added bottom for full height if content is short */
            width: 100vw !important; /* Use viewport width */
            min-height: 100vh !important; /* Use viewport height */
            height: auto !important; /* Allow content to dictate height if longer */
            margin: 0 !important;
            padding: 15mm !important; /* Standard A4 padding, adjust as needed */
            box-shadow: none !important;
            border: none !important;
            font-size: 11pt !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            overflow: visible !important; /* Ensure content isn't clipped */
            page-break-inside: auto !important; /* Let browser handle page breaks for main area */
          }
          header, footer, button, .non-printable, [class*="non-printable"], nav, aside, form, [role="dialog"], [role="alertdialog"], [role="tooltip"] {
            display: none !important;
            visibility: hidden !important; /* Double ensure */
          }
          .printable-area .prose {
             max-width: 100% !important;
             font-size: inherit !important; /* Ensure prose uses the 11pt font size */
          }
          .printable-area h1, .printable-area h2, .printable-area h3, .printable-area h4, .printable-area h5, .printable-area h6,
          .printable-area p, .printable-area li, .printable-area blockquote, .printable-area table {
            margin-top: 0.5em !important;
            margin-bottom: 0.5em !important;
            color: black !important; /* Ensure text is black */
            font-size: inherit !important;
          }
          .printable-area table, .printable-area th, .printable-area td {
             border: 1px solid #ccc !important; /* Ensure table borders are visible */
          }
          .printable-area div, .printable-area section, .printable-area article, .printable-area p, .printable-area li {
             page-break-inside: avoid !important; /* Avoid breaking these elements across pages */
          }
          .printable-area pre, .printable-area code {
            page-break-inside: avoid !important;
            background-color: #f5f5f5 !important; /* Light background for code blocks */
            border: 1px solid #ddd !important;
            padding: 0.5em !important;
          }
          a {
            text-decoration: underline !important;
            color: #0000EE !important; /* Standard blue for links */
            page-break-inside: avoid !important;
          }
          a[href^="/"]:after, a[href^="http"]:after, a[href^="https"]:after {
             content: "" !important; /* Remove URL printing for internal/external links if not desired */
          }
          img {
            max-width: 100% !important;
            height: auto !important;
            page-break-inside: avoid !important;
            border: none !important; /* Remove borders from images */
          }
           /* Hide scrollbars specifically for print if any appear */
          ::-webkit-scrollbar {
            display: none !important;
          }
          /* Ensure no fixed elements other than .printable-area interfere */
          body > *:not(.printable-area) {
             display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
