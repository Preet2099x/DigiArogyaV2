import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorApi } from '../../../services/api';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchPatients = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorApi.getMyPatients(page, 10);
      setPatients(data.patients || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        pageSize: data.pageSize,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      });
    } catch (err) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePageChange = (newPage) => {
    fetchPatients(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getAccessStatus = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { text: 'Expired', color: 'bg-red-100 text-red-800', expired: true };
    } else if (daysLeft <= 7) {
      return { text: `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`, color: 'bg-yellow-100 text-yellow-800', expired: false };
    } else {
      return { text: `Expires ${formatDate(expiresAt)}`, color: 'bg-green-100 text-green-800', expired: false };
    }
  };

  if (loading && patients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600 mt-1">Manage patients who have entrusted you with their care</p>
        </div>
        {patients.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-xl font-bold text-gray-900">{pagination.totalElements}</p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
          <button
            onClick={() => fetchPatients(pagination.currentPage)}
            className="ml-auto text-red-700 hover:text-red-900 underline text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Patients list */}
      {patients.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
          <p className="text-gray-500">
            Ask your patients to grant access using your email address.
          </p>
        </div>
      ) : (
        <>
          {/* Patients grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => {
              const accessStatus = getAccessStatus(patient.expiresAt);
              return (
                <div
                  key={patient.patientId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 font-semibold text-lg">
                        {patient.patientName?.charAt(0)?.toUpperCase() || 'P'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {patient.patientName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{patient.patientEmail}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${accessStatus.color}`}>
                        {accessStatus.text}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Link
                      to={`/dashboard/patient/${patient.patientId}/records`}
                      className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        accessStatus.expired
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                      onClick={(e) => accessStatus.expired && e.preventDefault()}
                    >
                      View Records
                    </Link>
                    <Link
                      to={`/dashboard/add-record?patientId=${patient.patientId}`}
                      className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        accessStatus.expired
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                      onClick={(e) => accessStatus.expired && e.preventDefault()}
                    >
                      Add Record
                    </Link>
                  </div>
                </div>
              );
            })}
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

export default MyPatients;
