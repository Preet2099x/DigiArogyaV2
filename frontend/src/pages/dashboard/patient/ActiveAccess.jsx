import React, { useState, useEffect } from 'react';
import { recordsApi } from '../../../services/api';


const ActiveAccess = () => {
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revokingId, setRevokingId] = useState(null);
  const [extendingId, setExtendingId] = useState(null);
  const [showExtendDropdown, setShowExtendDropdown] = useState(null);
  const [customDays, setCustomDays] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(null);

  useEffect(() => {
    fetchAccesses();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExtendDropdown && !event.target.closest('.extend-dropdown-container')) {
        setShowExtendDropdown(null);
        setShowCustomInput(null);
        setCustomDays('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExtendDropdown]);

  const fetchAccesses = async () => {
    try {
      const data = await recordsApi.getActiveAccesses();
      setAccesses(data);
    } catch (err) {
      setError('Failed to load active accesses');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke access for this user?')) {
      return;
    }

    setRevokingId(id);
    try {
      await recordsApi.revokeAccess(id);
      setAccesses(accesses.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to revoke access');
    } finally {
      setRevokingId(null);
    }
  };

  const handleExtend = async (id, days) => {
    setExtendingId(id);
    setShowExtendDropdown(null);
    setShowCustomInput(null);
    try {
      await recordsApi.extendAccess(id, days);
      await fetchAccesses();
      alert(`Access extended by ${days} day(s) successfully!`);
    } catch (err) {
      alert(err.message || 'Failed to extend access');
    } finally {
      setExtendingId(null);
      setCustomDays('');
    }
  };

  const handleCustomExtend = (id) => {
    const days = parseInt(customDays);
    if (!days || days <= 0 || days > 365) {
      alert('Please enter a valid number of days (1-365)');
      return;
    }
    handleExtend(id, days);
  };

  const toggleExtendDropdown = (id) => {
    if (showExtendDropdown === id) {
      setShowExtendDropdown(null);
      setShowCustomInput(null);
    } else {
      setShowExtendDropdown(id);
      setShowCustomInput(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Active Access Grants</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {accesses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No active grants</h3>
          <p className="mt-1 text-sm text-gray-500">
            No doctors or medical staff currently have access to your records.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {accesses.map((access) => (
              <li key={access.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-blue-600 truncate">{access.granteeName}</p>
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          ({access.granteeEmail})
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>
                            Expires on {new Date(access.expiresAt).toLocaleDateString()} at {new Date(access.expiresAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex gap-2">
                    <div className="relative extend-dropdown-container">
                      <button
                        onClick={() => toggleExtendDropdown(access.id)}
                        disabled={extendingId === access.id}
                        className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {extendingId === access.id ? 'Extending...' : 'Extend'}
                        <svg className={`ml-2 -mr-0.5 h-4 w-4 transition-transform duration-200 ${showExtendDropdown === access.id ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {showExtendDropdown === access.id && (
                        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-gray-900 ring-opacity-5 z-50 overflow-hidden animate-fadeIn">
                          <div className="py-1" role="menu">
                            <button
                              onClick={() => handleExtend(access.id, 1)}
                              className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                              role="menuitem"
                            >
                              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="flex-1 text-left">
                                <div className="font-medium">1 Day</div>
                                <div className="text-xs text-gray-500">Extend for 24 hours</div>
                              </div>
                            </button>
                            <button
                              onClick={() => handleExtend(access.id, 7)}
                              className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                              role="menuitem"
                            >
                              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div className="flex-1 text-left">
                                <div className="font-medium">7 Days</div>
                                <div className="text-xs text-gray-500">Extend for 1 week</div>
                              </div>
                            </button>
                            <button
                              onClick={() => handleExtend(access.id, 30)}
                              className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                              role="menuitem"
                            >
                              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div className="flex-1 text-left">
                                <div className="font-medium">30 Days</div>
                                <div className="text-xs text-gray-500">Extend for 1 month</div>
                              </div>
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                              onClick={() => setShowCustomInput(access.id)}
                              className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                              role="menuitem"
                            >
                              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <div className="flex-1 text-left">
                                <div className="font-medium">Custom Duration</div>
                                <div className="text-xs text-gray-500">Set your own days</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {showCustomInput === access.id && (
                        <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl bg-white ring-1 ring-gray-900 ring-opacity-5 z-50 p-5 animate-fadeIn">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="block text-sm font-semibold text-gray-900">
                                Custom Duration
                              </label>
                              <button
                                onClick={() => {
                                  setShowCustomInput(null);
                                  setCustomDays('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-2">
                                Enter number of days (1-365)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="365"
                                value={customDays}
                                onChange={(e) => setCustomDays(e.target.value)}
                                placeholder="e.g., 15"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                autoFocus
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleCustomExtend(access.id)}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                              >
                                Extend Access
                              </button>
                              <button
                                onClick={() => {
                                  setShowCustomInput(null);
                                  setCustomDays('');
                                }}
                                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleRevoke(access.id)}
                      disabled={revokingId === access.id}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {revokingId === access.id ? 'Revoking...' : 'Revoke'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActiveAccess;
