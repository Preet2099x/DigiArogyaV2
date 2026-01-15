import { useState, useEffect } from 'react';
import { recordsApi } from '../../../services/api';

const MyRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchRecords = async (page = 0, type = filterType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsApi.getMyRecords(page, 10, type);
      setRecords(data.records || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        pageSize: data.pageSize,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      });
    } catch (err) {
      setError(err.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(0, filterType);
  }, [filterType]);

  const handlePageChange = (newPage) => {
    fetchRecords(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (loading && records.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Total Records */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Health Records</h1>
          <p className="text-gray-600 mt-1">Your secure timeline of medical history</p>
        </div>
        {records.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-xl font-bold text-gray-900">{pagination.totalElements}</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Record Type
        </label>
        <select
          id="type-filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
        >
          <option value="ALL">All Types</option>
          <option value="NOTE">📝 Note</option>
          <option value="DIAGNOSIS">🩺 Diagnosis</option>
          <option value="PRESCRIPTION">💊 Prescription</option>
          <option value="LAB_RESULT">🔬 Lab Result</option>
          <option value="IMAGING">📷 Imaging</option>
          <option value="VITALS">❤️ Vitals</option>
          <option value="PROCEDURE">⚕️ Procedure</option>
        </select>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
          <button
            onClick={() => fetchRecords(pagination.currentPage)}
            className="ml-auto text-red-700 hover:text-red-900 underline text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Records list */}
      {records.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterType === 'ALL' ? 'No records yet' : 'No records found'}
          </h3>
          <p className="text-gray-500">
            {filterType === 'ALL' 
              ? 'Your secured health records will appear here once a doctor adds them.'
              : `No ${filterType.toLowerCase().replace('_', ' ')} records found. Try a different filter.`
            }
          </p>
        </div>
      ) : (
        <>
          {/* Records grid */}
          <div className="grid gap-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getTypeIcon(record.type)}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                          {record.type?.replace('_', ' ')}
                        </span>
                      </div>
                      {record.diagnosis && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{record.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
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
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevious}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyRecords;
