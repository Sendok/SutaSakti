import type { DocumentTemplate } from '@/types';
import { FileText, Receipt, FileSignature, GraduationCap, Mail, Briefcase } from 'lucide-react';

const commonUserDetailsFields = [
  { id: 'fullName', label: 'Full Name', type: 'text' as const, placeholder: 'John Doe', required: true, aiRelevant: true },
  { id: 'email', label: 'Email', type: 'email' as const, placeholder: 'john.doe@example.com', aiRelevant: true },
  { id: 'phone', label: 'Phone Number', type: 'text' as const, placeholder: '+1234567890', aiRelevant: true },
  { id: 'address', label: 'Address', type: 'textarea' as const, placeholder: '123 Main St, Anytown, USA', rows: 2, aiRelevant: true },
];

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'cover-letter',
    name: 'Cover Letter (Surat Lamaran)',
    description: 'Create a professional cover letter for job applications.',
    icon: Mail,
    category: 'Professional',
    formFields: [
      ...commonUserDetailsFields,
      { id: 'recipientName', label: 'Recipient Name', type: 'text', placeholder: 'Mr. Hiring Manager', required: true, aiRelevant: true },
      { id: 'recipientCompany', label: 'Company Name', type: 'text', placeholder: 'Acme Corp', required: true, aiRelevant: true },
      { id: 'jobTitle', label: 'Job Title Applied For', type: 'text', placeholder: 'Software Engineer', required: true, aiRelevant: true },
      { id: 'letterBody', label: 'Letter Body / Key Points for AI', type: 'textarea', placeholder: 'Highlight your skills in X, Y, Z. Mention your enthusiasm for the company mission...', required: true, rows: 6, aiRelevant: true },
      { id: 'closing', label: 'Closing', type: 'text', placeholder: 'Sincerely', defaultValue: 'Sincerely', aiRelevant: true },
    ],
    aiFlow: 'generateDocumentText',
    aiPromptInstruction: "Write a compelling cover letter based on the following details. Focus on professionalism and clarity.",
    renderPreview: (data) => `
      <div class="p-8 font-serif max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-2">${data.fullName || 'Your Name'}</h1>
        <p>${data.address || 'Your Address'}</p>
        <p>${data.email || 'Your Email'} | ${data.phone || 'Your Phone'}</p>
        <br />
        <p>${new Date().toLocaleDateString()}</p>
        <br />
        <p>${data.recipientName || 'Recipient Name'}</p>
        <p>${data.recipientCompany || 'Recipient Company'}</p>
        <br />
        <h2 class="text-xl font-semibold mb-4">Regarding: Application for ${data.jobTitle || 'Job Title'}</h2>
        <div class="whitespace-pre-wrap">${data.letterBody || 'Letter body content goes here...'}</div>
        <br />
        <p>${data.closing || 'Sincerely'},</p>
        <p class="mt-4">${data.fullName || 'Your Name'}</p>
      </div>
    `,
  },
  {
    id: 'invoice',
    name: 'Invoice (Faktur)',
    description: 'Generate simple invoices for your services or products.',
    icon: Receipt,
    category: 'Business',
    premium: true,
    formFields: [
      { id: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV-2024-001', required: true },
      { id: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { id: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { id: 'billedToName', label: 'Billed To (Name)', type: 'text', placeholder: 'Client Company Inc.', required: true, aiRelevant: true },
      { id: 'billedToAddress', label: 'Billed To (Address)', type: 'textarea', placeholder: '456 Client Ave, Client City', rows: 2, aiRelevant: true },
      { id: 'itemName', label: 'Item/Service Description', type: 'text', placeholder: 'Web Development Services', required: true, aiRelevant: true },
      { id: 'itemQuantity', label: 'Quantity', type: 'number', placeholder: '1', required: true, defaultValue: '1' },
      { id: 'itemPrice', label: 'Unit Price', type: 'number', placeholder: '1000', required: true },
      { id: 'notes', label: 'Notes/Terms', type: 'textarea', placeholder: 'Payment due within 30 days.', rows: 3, aiRelevant: true },
    ],
    aiFlow: 'none', // Invoices are typically data-driven, AI might be less useful or for notes only
    renderPreview: (data) => {
      const quantity = parseFloat(data.itemQuantity || 0);
      const price = parseFloat(data.itemPrice || 0);
      const total = (quantity * price).toFixed(2);
      return `
        <div class="p-8 border rounded-lg shadow-lg max-w-3xl mx-auto bg-white">
          <div class="flex justify-between items-start mb-8">
            <div>
              <h1 class="text-3xl font-bold text-primary">INVOICE</h1>
              <p class="text-gray-600">Invoice #: ${data.invoiceNumber || 'N/A'}</p>
            </div>
            <div class="text-right">
              <p><strong>Issue Date:</strong> ${data.issueDate ? new Date(data.issueDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Due Date:</strong> ${data.dueDate ? new Date(data.dueDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-2">Billed To:</h2>
            <p>${data.billedToName || 'Client Name'}</p>
            <p class="whitespace-pre-wrap">${data.billedToAddress || 'Client Address'}</p>
          </div>
          <table class="w-full mb-8 border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2 text-left">Description</th>
                <th class="border p-2 text-right">Quantity</th>
                <th class="border p-2 text-right">Unit Price</th>
                <th class="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border p-2">${data.itemName || 'Item/Service'}</td>
                <td class="border p-2 text-right">${data.itemQuantity || '0'}</td>
                <td class="border p-2 text-right">$${data.itemPrice || '0.00'}</td>
                <td class="border p-2 text-right">$${total}</td>
              </tr>
            </tbody>
          </table>
          <div class="text-right mb-8">
            <p class="text-2xl font-bold">Total: $${total}</p>
          </div>
          ${data.notes ? `<div class="mb-8 p-4 bg-gray-50 rounded"><h3 class="font-semibold mb-1">Notes/Terms:</h3><p class="whitespace-pre-wrap text-sm">${data.notes}</p></div>` : ''}
          <p class="text-center text-sm text-gray-500">Thank you for your business!</p>
        </div>
      `;
    },
  },
  {
    id: 'contract',
    name: 'Simple Contract (Kontrak Sederhana)',
    description: 'Generate a basic contract agreement.',
    icon: FileSignature,
    category: 'Legal',
    premium: true,
    formFields: [
      { id: 'contractTitle', label: 'Contract Title', type: 'text', placeholder: 'Service Agreement', required: true, aiRelevant: true },
      { id: 'partyOneName', label: 'Party One Name', type: 'text', placeholder: 'Provider Inc.', required: true, aiRelevant: true },
      { id: 'partyTwoName', label: 'Party Two Name', type: 'text', placeholder: 'Client LLC', required: true, aiRelevant: true },
      { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, aiRelevant: true },
      { id: 'servicesDescription', label: 'Services/Scope of Work', type: 'textarea', placeholder: 'Describe the services to be provided or the scope of work.', required: true, rows: 5, aiRelevant: true },
      { id: 'paymentTerms', label: 'Payment Terms', type: 'textarea', placeholder: 'e.g., $500 upon signing, $500 upon completion.', required: true, rows: 3, aiRelevant: true },
      { id: 'termLength', label: 'Term Length (if applicable)', type: 'text', placeholder: 'e.g., 12 months, until project completion', aiRelevant: true },
    ],
    aiFlow: 'generateDocumentText',
    aiPromptInstruction: "Generate a simple contract agreement based on the details. Ensure it covers the key aspects like parties involved, services, payment, and effective date. Use formal legal language.",
    renderPreview: (data) => `
      <div class="p-8 font-serif max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-6">${data.contractTitle || 'Agreement'}</h1>
        <p class="mb-4">This Agreement (the "Agreement") is made and entered into as of ${data.effectiveDate ? new Date(data.effectiveDate).toLocaleDateString() : '[Effective Date]'} (the "Effective Date"), by and between:</p>
        <p class="mb-2"><strong>${data.partyOneName || '[Party One Name]'}</strong> ("Party One"),</p>
        <p class="mb-4">and</p>
        <p class="mb-6"><strong>${data.partyTwoName || '[Party Two Name]'}</strong> ("Party Two").</p>
        
        <h2 class="text-xl font-semibold mt-6 mb-2">1. Services</h2>
        <p class="mb-4 whitespace-pre-wrap">${data.servicesDescription || '[Description of Services]'}</p>
        
        <h2 class="text-xl font-semibold mt-6 mb-2">2. Payment Terms</h2>
        <p class="mb-4 whitespace-pre-wrap">${data.paymentTerms || '[Payment Terms]'}</p>
        
        ${data.termLength ? `<h2 class="text-xl font-semibold mt-6 mb-2">3. Term</h2><p class="mb-4">${data.termLength}</p>` : ''}

        <div class="mt-12 grid grid-cols-2 gap-16">
          <div>
            <p><strong>Party One:</strong></p>
            <p class="mt-8 border-b border-gray-400"></p>
            <p>${data.partyOneName || '[Party One Name]'}</p>
          </div>
          <div>
            <p><strong>Party Two:</strong></p>
            <p class="mt-8 border-b border-gray-400"></p>
            <p>${data.partyTwoName || '[Party Two Name]'}</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'academic-paper',
    name: 'Academic Paper (Makalah)',
    description: 'Draft an academic paper from an outline using AI.',
    icon: GraduationCap,
    category: 'Academic',
    formFields: [
      { id: 'paperTitle', label: 'Paper Title', type: 'text', placeholder: 'The Impact of AI on Modern Society', required: true, aiRelevant: true },
      { id: 'authorName', label: 'Author Name', type: 'text', placeholder: 'Dr. Jane Smith', required: true, aiRelevant: true },
      { id: 'abstract', label: 'Abstract (Optional, AI can help generate)', type: 'textarea', placeholder: 'Brief summary of the paper...', rows: 4, aiRelevant: true },
      { id: 'outline', label: 'Paper Outline', type: 'textarea', placeholder: '1. Introduction\n   a. Background\n   b. Thesis statement\n2. Literature Review\n...', required: true, rows: 10, aiRelevant: true, aiFieldMap: 'outline' },
    ],
    aiFlow: 'summarizeEssayOutline', // This uses the summarizeEssayOutline flow
    renderPreview: (data) => `
      <div class="p-8 font-serif max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-2">${data.paperTitle || 'Academic Paper Title'}</h1>
        <p class="text-center text-lg mb-6">${data.authorName || 'Author Name'}</p>
        
        ${data.abstract ? `<div class="mb-6 p-4 border-l-4 border-primary bg-secondary"><h2 class="text-xl font-semibold mb-2">Abstract</h2><p class="whitespace-pre-wrap">${data.abstract}</p></div>` : ''}
        
        <h2 class="text-2xl font-semibold mt-6 mb-3">Introduction</h2>
        <div class="whitespace-pre-wrap mb-4">${data.generatedContent || data.outline || 'Paper content generated from outline will appear here...'}</div>
        
        ${!data.generatedContent && data.outline ? `<p class="text-sm text-muted-foreground">Note: This is the outline. Use AI generation to create the full paper.</p>` : ''}
      </div>
    `,
  },
];
