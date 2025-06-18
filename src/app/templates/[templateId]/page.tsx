
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

  // Dynamically build Zod schema and default values
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
            zodType = z.coerce.number(); // Use coerce for string input from forms
            break;
          default:
            zodType = z.string();
        }
        if (field.required) {
          zodType = zodType.min(1, { message: `${field.label} is required` });
        } else {
          zodType = zodType.optional();
        }
        shape[field.id] = zodType;
        defaults[field.id] = field.defaultValue || (field.type === 'number' ? undefined : '');
      });
      
      setFormSchema(z.object(shape));
      setDefaultValues(defaults);
      setIsLoading(false);
    } else {
      router.push('/templates'); // Redirect if template not found
    }
  }, [templateId, router]);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  
  // Update defaultValues when they change (e.g., after template load)
   useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);


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
           // Update form field or a dedicated state for AI content
          form.setValue(template.formFields.find(f => f.id === 'outline')?.id || 'generatedContent', aiResultText); // Example, adjust target field
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
        
        // A specific field that AI should primarily focus on enhancing, e.g., 'letterBody'
        const mainAiContentFieldId = template.formFields.find(f => f.id === 'letterBody' || f.id === 'servicesDescription')?.id;

        const result = await generateDocumentText({ documentType: template.name, userInput });
        aiResultText = result.generatedText;

        if (mainAiContentFieldId && form.getValues(mainAiContentFieldId)) {
             form.setValue(mainAiContentFieldId, aiResultText);
        } else if (mainAiContentFieldId) {
            form.setValue(mainAiContentFieldId, aiResultText);
        } else {
             // Fallback: if no specific field, add to a general generated content field or a relevant textarea
            const firstTextArea = template.formFields.find(f => f.type === 'textarea');
            if (firstTextArea) {
                form.setValue(firstTextArea.id, aiResultText);
            } else {
                // Or show in a dedicated preview area
                form.setValue('generatedContent', aiResultText); // Assuming a field exists or state for this
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
        <CardHeader className="bg-muted/30 relative">
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
                    defaultValue={field.defaultValue || (field.type === 'number' ? undefined : '')}
                    render={({ field: controllerField, fieldState: { error } }) => (
                      <>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.id}
                            placeholder={field.placeholder}
                            rows={field.rows || 3}
                            {...controllerField}
                            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
                          />
                        ) : field.type === 'select' && field.options ? (
                           <Select onValueChange={controllerField.onChange} defaultValue={controllerField.value}>
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
              <CardFooter className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 p-6 border-t">
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
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Advertisements</CardTitle>
            </CardHeader>
            <CardContent className="h-32 bg-muted flex items-center justify-center rounded-md">
              <p className="text-muted-foreground">Ad placeholder - Support FormFlow AI!</p>
            </CardContent>
          </Card>
        )}

      {/* Print-specific styles */}
      <style jsx global>{\`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px; /* Adjust as needed */
            box-shadow: none !important;
            border: none !important;
          }
           header, footer, button, .non-printable {
            display: none !important;
          }
        }
      \`}</style>
    </div>
  );
}
    
    
