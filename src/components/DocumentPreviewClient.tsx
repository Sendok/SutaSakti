'use client';

import type { GeneratedDocument } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentPreviewClientProps {
  document: GeneratedDocument;
}

export default function DocumentPreviewClient({ document }: DocumentPreviewClientProps) {
  // This component is needed because dangerouslySetInnerHTML can only be used in client components.
  // The actual preview logic is handled by template.renderPreview, this just displays it.
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-center mb-6 font-headline">{document.title} Preview</h2>
      <div 
        className="printable-area bg-white p-4 md:p-8 rounded-lg shadow-lg border border-gray-200 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: document.content }}
      />
      <div className="mt-4 p-4 bg-secondary/50 rounded-md non-printable">
        <h3 className="font-semibold text-sm mb-2">Developer Debug Info (Form Data):</h3>
        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
          {JSON.stringify(document.formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
