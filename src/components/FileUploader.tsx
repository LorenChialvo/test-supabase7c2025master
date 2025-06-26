import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface FileUploaderProps {
  userId: string;
}

const FileUploader = ({ userId }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Llamar a la función de Supabase para subir el archivo
      const { data, error } = await supabase.functions.invoke('upload-file', {
        body: { 
          fileName: file.name,
          contentType: file.type,
          userId
        },
        method: 'POST',
        file: file,
      });

      if (error) {
        setError(error.message || 'Error al subir el archivo');
        return;
      }

      setSuccess(true);
      setFile(null);
      
      // Limpiar el input de archivo
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (err) {
      setError('Ocurrió un error inesperado');
      console.error('Error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-uploader">
      <h2>Subir archivo</h2>
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="file-upload">Seleccionar archivo</label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">¡Archivo subido correctamente!</div>}
        
        <button 
          type="submit" 
          disabled={!file || uploading}
          className="upload-button"
        >
          {uploading ? 'Subiendo...' : 'Subir archivo'}
        </button>
      </form>
    </div>
  );
};

export default FileUploader;
