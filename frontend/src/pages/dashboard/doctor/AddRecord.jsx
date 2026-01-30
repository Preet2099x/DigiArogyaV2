import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doctorApi, fileApi } from '../../../services/api';

const AddRecord = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patientIdFromUrl = searchParams.get('patientId');
  const fileInputRef = useRef(null);
  
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    patientId: patientIdFromUrl || '',
    type: 'NOTE',
    title: '',
    diagnosis: '',
    content: '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [loadingPreviews, setLoadingPreviews] = useState({});
  const [previewModal, setPreviewModal] = useState({ isOpen: false, index: 0 });

  const recordTypes = [
    { value: 'NOTE', label: 'Note', icon: '📝', description: 'General clinical notes' },
    { value: 'DIAGNOSIS', label: 'Diagnosis', icon: '🩺', description: 'Medical diagnosis' },
    { value: 'PRESCRIPTION', label: 'Prescription', icon: '💊', description: 'Medication prescription' },
    { value: 'LAB_RESULT', label: 'Lab Result', icon: '🔬', description: 'Laboratory test results' },
    { value: 'IMAGING', label: 'Imaging', icon: '📷', description: 'X-rays, MRI, CT scans' },
    { value: 'VITALS', label: 'Vitals', icon: '❤️', description: 'Blood pressure, heart rate, etc.' },
    { value: 'PROCEDURE', label: 'Procedure', icon: '🏥', description: 'Surgical or medical procedures' },
  ];

  const allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await doctorApi.getMyPatients(0, 100);
        setPatients(data.patients || []);
      } catch (err) {
        console.error('Failed to load patients:', err);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess(false);
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
      } else if (file.size > maxFileSize) {
        errors.push(`${file.name}: File too large (max 50MB)`);
      } else {
        validFiles.push(file);
        
        // Generate preview for images and PDFs
        if (file.type.startsWith('image/')) {
          setLoadingPreviews((prev) => ({
            ...prev,
            [file.name]: true,
          }));
          
          const reader = new FileReader();
          reader.onload = (event) => {
            setFilePreviews((prev) => ({
              ...prev,
              [file.name]: event.target.result,
            }));
            setLoadingPreviews((prev) => ({
              ...prev,
              [file.name]: false,
            }));
          };
          reader.onerror = () => {
            setLoadingPreviews((prev) => ({
              ...prev,
              [file.name]: false,
            }));
          };
          reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
          // Generate PDF preview as blob URL
          setLoadingPreviews((prev) => ({
            ...prev,
            [file.name]: true,
          }));
          
          const reader = new FileReader();
          reader.onload = (event) => {
            setFilePreviews((prev) => ({
              ...prev,
              [file.name]: event.target.result,
            }));
            setLoadingPreviews((prev) => ({
              ...prev,
              [file.name]: false,
            }));
          };
          reader.onerror = () => {
            setLoadingPreviews((prev) => ({
              ...prev,
              [file.name]: false,
            }));
          };
          reader.readAsDataURL(file);
        }
      }
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    const fileName = selectedFiles[index]?.name;
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileName) {
      setFilePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[fileName];
        return newPreviews;
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.patientId) {
      setError('Please select a patient');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!formData.content.trim()) {
      setError('Please enter content');
      return;
    }

    setLoading(true);

    try {
      // First, create the record
      const recordResponse = await doctorApi.addRecord(formData.patientId, {
        type: formData.type,
        title: formData.title,
        diagnosis: formData.diagnosis,
        content: formData.content,
      });

      // If there are files to upload and we have a record ID
      if (selectedFiles.length > 0 && recordResponse?.recordId) {
        setUploadingFiles(true);
        try {
          await fileApi.uploadFiles(recordResponse.recordId, selectedFiles);
        } catch (uploadErr) {
          console.error('File upload failed:', uploadErr);
          // Record was created but files failed - show partial success
          setError('Record created but some files failed to upload: ' + uploadErr.message);
          setLoading(false);
          setUploadingFiles(false);
          return;
        }
        setUploadingFiles(false);
      }

      setSuccess(true);
      setFormData({
        patientId: patientIdFromUrl || '',
        type: 'NOTE',
        title: '',
        diagnosis: '',
        content: '',
      });
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message || 'Failed to add record. Please try again.');
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Medical Record</h1>
        <p className="text-gray-600 mt-1">Create a new medical record for a patient</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Success message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Record added successfully!
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Patient Selection */}
            <div className="mb-6">
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient
              </label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                disabled={loadingPatients}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Choose a patient...</option>
                {patients.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.patientName} ({patient.patientEmail})
                  </option>
                ))}
              </select>
            </div>

            {/* Record Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {recordTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeSelect(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.type === type.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Annual Checkup Results"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Diagnosis (optional) */}
            <div className="mb-6">
              <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="e.g., Type 2 Diabetes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                placeholder="Enter detailed information about the record..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              
              {/* Drop zone / Upload button */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold text-emerald-600">Click to upload</span> or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PDF, Images, Word documents up to 50MB each
                </p>
              </div>

              {/* Selected files carousel */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {selectedFiles.length}
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedFiles.length === 1 ? 'File Ready' : 'Files Ready'} to Upload
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFiles([]);
                        setFilePreviews({});
                        setLoadingPreviews({});
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Horizontal scrollable carousel */}
                  <div className="relative">
                    <div className="overflow-x-auto pb-2 -mx-2 px-2">
                      <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
                        {selectedFiles.map((file, index) => {
                          const isImage = file.type.startsWith('image/');
                          const isPDF = file.type === 'application/pdf';
                          
                          return (
                            <div
                              key={`${file.name}-${index}`}
                              className="relative flex-shrink-0 w-36"
                            >
                              <div 
                                className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-transparent hover:border-emerald-400 transition-all group cursor-pointer"
                                onClick={() => setPreviewModal({ isOpen: true, index })}
                              >
                                {/* File preview */}
                                <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  {isImage ? (
                                    loadingPreviews[file.name] ? (
                                      <div className="flex flex-col items-center gap-2">
                                        <svg className="animate-spin h-8 w-8 text-emerald-500" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span className="text-xs text-gray-500">Loading...</span>
                                      </div>
                                    ) : filePreviews[file.name] ? (
                                      <>
                                        <img
                                          src={filePreviews[file.name]}
                                          alt={file.name}
                                          className="w-full h-full object-cover"
                                        />
                                        {/* View overlay on hover */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                          <svg className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                          </svg>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-4xl">🖼️</span>
                                        <span className="text-xs text-gray-500">Image</span>
                                      </div>
                                    )
                                  ) : isPDF ? (
                                    <>
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-4xl">📄</span>
                                        <span className="text-xs font-medium text-red-600">PDF</span>
                                      </div>
                                      {/* View overlay on hover */}
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                        <svg className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-4xl">{getFileIcon(file.type)}</span>
                                        <span className="text-xs text-gray-600">Document</span>
                                      </div>
                                      {/* View overlay on hover */}
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                        <svg className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                      </div>
                                    </>
                                  )}
                                  
                                  {/* Remove button - top right corner */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFile(index);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                    title="Remove file"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>

                                  {/* File type badge */}
                                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                                    <span className="text-xs font-medium text-gray-700">
                                      {isImage ? '🖼️ IMG' : isPDF ? '📄 PDF' : '📎 DOC'}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* File info */}
                                <div className="p-2 bg-white">
                                  <p className="text-xs font-medium text-gray-800 truncate mb-0.5" title={file.name}>
                                    {file.name}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                                    <span className="text-xs text-emerald-600 font-medium">✓ Ready</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Scroll hint */}
                    {selectedFiles.length > 3 && (
                      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none flex items-center justify-end pr-1">
                        <svg className="h-5 w-5 text-emerald-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {uploadingFiles ? 'Uploading Files...' : 'Adding Record...'}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Record
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewModal.isOpen && selectedFiles[previewModal.index] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          {/* Close button */}
          <button
            onClick={() => setPreviewModal({ isOpen: false, index: 0 })}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation - Previous */}
          {previewModal.index > 0 && (
            <button
              onClick={() => setPreviewModal(prev => ({ ...prev, index: prev.index - 1 }))}
              className="absolute left-4 p-3 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Navigation - Next */}
          {previewModal.index < selectedFiles.length - 1 && (
            <button
              onClick={() => setPreviewModal(prev => ({ ...prev, index: prev.index + 1 }))}
              className="absolute right-4 p-3 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* File preview content */}
          <div className="max-w-5xl max-h-[90vh] p-4 w-full">
            {(() => {
              const file = selectedFiles[previewModal.index];
              const isImage = file.type.startsWith('image/');
              const isPDF = file.type === 'application/pdf';

              return (
                <div className="bg-white rounded-lg overflow-hidden">
                  {isImage ? (
                    <div className="flex items-center justify-center bg-gray-100">
                      <img
                        src={filePreviews[file.name]}
                        alt={file.name}
                        className="max-w-full max-h-[80vh] object-contain"
                      />
                    </div>
                  ) : isPDF ? (
                    <div className="p-12 text-center bg-gradient-to-br from-red-50 to-red-100">
                      {filePreviews[file.name] ? (
                        <iframe
                          src={filePreviews[file.name]}
                          className="w-full h-[70vh] border-0 rounded-lg shadow-lg"
                          title={file.name}
                        />
                      ) : (
                        <>
                          <span className="text-8xl mb-4 block">📄</span>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">PDF Document</h3>
                          <p className="text-gray-600 mb-1">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          <p className="text-sm text-gray-600 mt-4">Loading PDF preview...</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-gray-50">
                      <span className="text-8xl mb-4 block">{getFileIcon(file.type)}</span>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Document</h3>
                      <p className="text-gray-600 mb-1">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  )}
                  
                  {/* File info bar */}
                  <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-300">
                        {formatFileSize(file.size)} • File {previewModal.index + 1} of {selectedFiles.length}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeFile(previewModal.index);
                        if (previewModal.index >= selectedFiles.length - 1) {
                          setPreviewModal({ isOpen: false, index: 0 });
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecord;
