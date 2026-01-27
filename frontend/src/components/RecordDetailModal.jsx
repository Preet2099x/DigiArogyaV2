import { useState, useEffect } from 'react';
import { fileApi } from '../services/api';

const RecordDetailModal = ({ record, isOpen, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen && record?.id) {
      fetchAttachments();
    }
  }, [isOpen, record?.id]);

  const fetchAttachments = async () => {
    setLoadingAttachments(true);
    try {
      const data = await fileApi.getRecordAttachments(record.id);
      setAttachments(data || []);
    } catch (err) {
      console.error('Failed to load attachments:', err);
      setAttachments([]);
    } finally {
      setLoadingAttachments(false);
    }
  };

  const handleDownload = async (attachment) => {
    setLoadingDownload(attachment.id);
    try {
      const { downloadUrl, fileName } = await fileApi.getDownloadUrl(attachment.id);
      
      // Open in new tab for images, download for others
      if (attachment.fileType?.startsWith('image/')) {
        setPreviewImage({ url: downloadUrl, name: fileName });
      } else {
        window.open(downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to get download URL:', err);
      alert('Failed to download file');
    } finally {
      setLoadingDownload(null);
    }
  };

  const handleViewImage = async (attachment) => {
    setLoadingDownload(attachment.id);
    try {
      const { downloadUrl, fileName } = await fileApi.getDownloadUrl(attachment.id);
      setPreviewImage({ url: downloadUrl, name: fileName });
    } catch (err) {
      console.error('Failed to load image:', err);
      alert('Failed to load image');
    } finally {
      setLoadingDownload(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type?.includes('word')) return '📝';
    return '📎';
  };

  const getTypeColor = (type) => {
    const colors = {
      NOTE: 'bg-gray-100 text-gray-800',
      DIAGNOSIS: 'bg-orange-100 text-orange-800',
      PRESCRIPTION: 'bg-blue-100 text-blue-800',
      LAB_RESULT: 'bg-purple-100 text-purple-800',
      IMAGING: 'bg-pink-100 text-pink-800',
      VITALS: 'bg-red-100 text-red-800',
      PROCEDURE: 'bg-green-100 text-green-800',
    };
    return colors[type] || colors.NOTE;
  };

  const getTypeIcon = (type) => {
    const icons = {
      NOTE: '📝',
      DIAGNOSIS: '🩺',
      PRESCRIPTION: '💊',
      LAB_RESULT: '🔬',
      IMAGING: '📷',
      VITALS: '❤️',
      PROCEDURE: '⚕️',
    };
    return icons[type] || icons.NOTE;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          ></div>

          {/* Modal Content */}
          <div className="relative inline-block w-full max-w-3xl p-6 my-8 text-left align-middle bg-white rounded-2xl shadow-xl transform transition-all">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-6 pr-10">
              <div className="text-4xl">{getTypeIcon(record.type)}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{record.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(record.type)}`}>
                    {record.type?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Dr. {record.createdByDoctorName || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(record.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            {record.diagnosis && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="text-sm font-semibold text-orange-800 mb-1">Diagnosis</h3>
                <p className="text-orange-900">{record.diagnosis}</p>
              </div>
            )}

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Details</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{record.content}</p>
              </div>
            </div>

            {/* Attachments Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attachments
              </h3>

              {loadingAttachments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : attachments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <span className="text-4xl mb-2 block">📭</span>
                  <p className="text-gray-500">No attachments for this record</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getFileIcon(attachment.fileType)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{attachment.fileName}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {attachment.fileType?.startsWith('image/') && (
                          <button
                            onClick={() => handleViewImage(attachment)}
                            disabled={loadingDownload === attachment.id}
                            className="px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors disabled:opacity-50"
                          >
                            {loadingDownload === attachment.id ? (
                              <span className="flex items-center gap-1">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Loading...
                              </span>
                            ) : (
                              <>👁️ View</>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(attachment)}
                          disabled={loadingDownload === attachment.id}
                          className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                          {loadingDownload === attachment.id && !attachment.fileType?.startsWith('image/') ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              ...
                            </span>
                          ) : (
                            <>⬇️ Download</>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-5xl max-h-[90vh] p-4">
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <p className="text-center text-white mt-2">{previewImage.name}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RecordDetailModal;
