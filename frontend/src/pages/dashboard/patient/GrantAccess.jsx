import { useState } from 'react';
import { recordsApi } from '../../../services/api';

const GrantAccess = () => {
  const [doctorEmail, setDoctorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!doctorEmail.trim()) {
      setError('Please enter a doctor\'s email address');
      return;
    }

    if (!validateEmail(doctorEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await recordsApi.grantAccess(doctorEmail);
      setSuccess(true);
      setDoctorEmail('');
    } catch (err) {
      setError(err.message || 'Failed to grant access. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Grant Access</h1>
        <p className="text-gray-600 mt-1">
          Allow a doctor to view your health records by entering their email address
        </p>
      </div>

      {/* Main content - Centered */}
      <div className="max-w-xl mx-auto">
        {/* Form card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Info banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="text-2xl">🔐</div>
              <div>
                <h3 className="font-medium text-emerald-800 mb-1">Your data is secure</h3>
                <p className="text-sm text-emerald-700">
                  Only the doctor you specify will be able to view your records. You can revoke
                  access at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Success message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Access granted successfully! The doctor can now view your records.
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="doctorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Doctor's Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="doctorEmail"
                  value={doctorEmail}
                  onChange={(e) => {
                    setDoctorEmail(e.target.value);
                    setError('');
                    setSuccess(false);
                  }}
                  placeholder="doctor@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter the email address of the registered doctor you want to share your records with.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Granting Access...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Grant Access
                </>
              )}
            </button>
          </form>
        </div>

        {/* How it works - Below form */}
        <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h3 className="font-medium text-gray-900 mb-4 text-base">How it works</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">1</span>
              <p className="text-base text-gray-600">Enter the email address of your doctor</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">2</span>
              <p className="text-base text-gray-600">Doctor must be registered on DigiArogya</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">3</span>
              <p className="text-base text-gray-600">Doctor can then view your medical records</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GrantAccess;
