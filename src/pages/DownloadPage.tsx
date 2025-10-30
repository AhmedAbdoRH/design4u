import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_size: number;
  download_count: number;
  created_at: string;
}

export default function DownloadPage() {
  const [files, setFiles] = useState<DownloadItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch downloads
  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setError(null);
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('الرجاء اختيار ملف أولاً');
      return;
    }
    setUploading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('الرجاء تسجيل الدخول قبل رفع الملفات');
        return;
      }

      // Sanitize filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to storage bucket
      const { error: uploadError } = await supabase.storage
        .from('downloads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('downloads')
        .getPublicUrl(fileName);

      // Insert record in downloads table
      const { error: insertError } = await supabase
        .from('downloads')
        .insert({
          title: file.name,
          file_name: fileName,
          file_url: publicUrl,
          file_size: file.size,
          download_count: 0,
          uploaded_by: user.id
        });

      if (insertError) throw insertError;

      // Refresh downloads list
      fetchDownloads();
      setFile(null);

      // Clear the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (item: DownloadItem) => {
    try {
      // Create anchor element
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count
      const { error: updateError } = await supabase
        .from('downloads')
        .update({ download_count: (item.download_count || 0) + 1 })
        .eq('id', item.id);

      if (updateError) throw updateError;

      // Refresh the list
      fetchDownloads();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>صفحة التحميل - Design4U</title>
        <meta name="description" content="قم بتحميل ورفع الملفات" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">صفحة التحميل</h1>
          <p className="mt-2 text-gray-600">قم بتحميل ورفع الملفات هنا</p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">رفع ملف جديد</h2>
            
            <div className="space-y-4">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />

              {file && (
                <div className="text-sm text-gray-600">
                  الملف المختار: <span className="font-medium">{file.name}</span>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'جارٍ الرفع...' : 'رفع الملف'}
              </button>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">الملفات المتاحة للتحميل</h2>
          
          {files.length === 0 ? (
            <p className="text-center text-gray-500 py-8">لا توجد ملفات متاحة للتحميل حالياً</p>
          ) : (
            <div className="space-y-4">
              {files.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{(item.file_size / 1024 / 1024) > 1 
                        ? `${(item.file_size / 1024 / 1024).toFixed(2)} MB`
                        : `${(item.file_size / 1024).toFixed(2)} KB`
                      }</span>
                      <span>•</span>
                      <span>عدد التحميلات: {item.download_count}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>تحميل</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
