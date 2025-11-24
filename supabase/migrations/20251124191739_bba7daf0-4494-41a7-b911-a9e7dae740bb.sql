-- Create storage bucket for knowledge documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-documents', 'knowledge-documents', false);

-- Allow authenticated users to upload their own documents
CREATE POLICY "Users can upload their own knowledge documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'knowledge-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to read their own documents
CREATE POLICY "Users can read their own knowledge documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'knowledge-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own documents
CREATE POLICY "Users can delete their own knowledge documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'knowledge-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);