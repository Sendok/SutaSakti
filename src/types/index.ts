import type { LucideIcon } from 'lucide-react';

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'date' | 'number' | 'select';
  placeholder?: string;
  required?: boolean;
  aiRelevant?: boolean; 
  aiFieldMap?: string; 
  defaultValue?: string;
  options?: { value: string; label: string }[]; // For select type
  rows?: number; // For textarea
}

export type AiFlowType = 'summarizeEssayOutline' | 'generateDocumentText' | 'none';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string; 
  premium?: boolean;
  formFields: FormFieldDefinition[];
  aiFlow?: AiFlowType;
  aiPromptInstruction?: string; // General instruction for AI if using generateDocumentText
  renderPreview: (data: Record<string, any>) => string; 
}

export interface GeneratedDocument {
  title: string;
  content: string; // HTML content
  formData: Record<string, any>;
  templateId: string;
}
