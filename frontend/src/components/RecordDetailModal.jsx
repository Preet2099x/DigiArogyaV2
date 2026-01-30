import { useState, useEffect } from 'react';
import { fileApi } from '../services/api';

const RecordDetailModal = ({ record, isOpen, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    if (isOpen && record?.id) {
      fetchAttachments();
    }
  }, [isOpen, record?.id]);

  const fetchAttachments = async () => {
    setLoadingAttachments(true);
    setThumbnails({}); // Reset thumbnails
    try {
      const data = await fileApi.getRecordAttachments(record.id);
      setAttachments(data || []);
      
      // Load thumbnails for images - wait for all to load
      if (data && data.length > 0) {
        const imageAttachments = data.filter(a => a.fileType?.startsWith('image/'));
        for (const attachment of imageAttachments) {
          try {
            const { downloadUrl } = await fileApi.getDownloadUrl(attachment.id);
            setThumbnails((prev) => ({
              ...prev,
              [attachment.id]: downloadUrl,
            }));
          } catch (err) {
            console.error('Failed to load thumbnail for:', attachment.fileName, err);
          }
        }
      }
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
                <div>
                  {/* Image thumbnails grid */}
                  {attachments.some(a => a.fileType?.startsWith('image/')) && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Images</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {attachments.map((attachment) => (
                          attachment.fileType?.startsWith('image/') && (
                            <button
                              key={attachment.id}
                              onClick={() => handleViewImage(attachment)}
                              disabled={loadingDownload === attachment.id}
                              className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-400 transition-all disabled:opacity-50 bg-gray-100"
                            >
                              {thumbnails[attachment.id] ? (
                                <>
                                  <img
                                    src={thumbnails[attachment.id]}
                                    alt={attachment.fileName}
                                    crossOrigin="anonymous"
                                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                                    onLoad={(e) => {
                                      e.target.style.backgroundColor = 'transparent';
                                    }}
                                    onError={(e) => {
                                      console.error('Image load error:', attachment.fileName, thumbnails[attachment.id]);
                                      // Try with blobUrl as fallback
                                      if (attachment.blobUrl && e.target.src !== attachment.blobUrl) {
                                        e.target.src = attachment.blobUrl;
                                      } else {
                                        e.target.style.display = 'none';
                                      }
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                                    {loadingDownload === attachment.id ? (
                                      <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                      </svg>
                                    ) : (
                                      <svg className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-24 flex flex-col items-center justify-center bg-gray-100">
                                  <svg className="animate-spin h-6 w-6 text-emerald-500 mb-1" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  <span className="text-xs text-gray-500">Loading...</span>
                                </div>
                              )}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PDF thumbnails grid */}
                  {attachments.some(a => a.fileType === 'application/pdf') && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">PDFs</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {attachments.map((attachment) => (
                          attachment.fileType === 'application/pdf' && (
                            <button
                              key={attachment.id}
                              onClick={() => handleDownload(attachment)}
                              disabled={loadingDownload === attachment.id}
                              className="relative group rounded-lg overflow-hidden border border-red-200 hover:border-red-400 transition-all disabled:opacity-50 bg-gradient-to-br from-red-50 to-red-100"
                            >
                              <div className="w-full h-24 flex flex-col items-center justify-center p-2 text-center">
                                <span className="text-3xl mb-1">📄</span>
                                <p className="text-xs font-medium text-red-700 truncate px-1 line-clamp-2">{attachment.fileName.substring(0, 20)}</p>
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                                {loadingDownload === attachment.id ? (
                                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : (
                                  <svg className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other non-image, non-PDF files list */}
                  {attachments.some(a => !a.fileType?.startsWith('image/') && a.fileType !== 'application/pdf') && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Other Files</p>
                      <div className="space-y-2">
                        {attachments.map((attachment) => (
                          !attachment.fileType?.startsWith('image/') && attachment.fileType !== 'application/pdf' && (
                            <div
                              key={attachment.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-3xl">{getFileIcon(attachment.fileType)}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{attachment.fileName}</p>
                                  <p className="text-sm text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownload(attachment)}
                                disabled={loadingDownload === attachment.id}
                                className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 flex-shrink-0"
                              >
                                {loadingDownload === attachment.id ? (
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
                          )
                        ))}
                      </div>
                    </div>
                  )}
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
              crossOrigin="anonymous"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onError={(e) => {
                console.error('Preview image load error:', previewImage.url);
              }}
            />
            <p className="text-center text-white mt-2">{previewImage.name}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RecordDetailModal;
