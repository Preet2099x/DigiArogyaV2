const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Your Health Records,
                <span className="text-emerald-600 block sm:inline"> Your Control</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                DigiArogya is a secure, consent-driven digital health records system. 
                Store your medical history safely and share it only with doctors you trust.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                  Get Started Free
                </button>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-all duration-200 cursor-pointer">
                  Learn More
                </button>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                {/* Background blobs - hidden on mobile for performance */}
                <div className="hidden sm:block absolute top-0 -left-4 w-48 md:w-72 h-48 md:h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                <div className="hidden sm:block absolute top-0 -right-4 w-48 md:w-72 h-48 md:h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                <div className="hidden sm:block absolute -bottom-8 left-20 w-48 md:w-72 h-48 md:h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                
                {/* Dashboard Card */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl sm:text-2xl">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Patient Dashboard</p>
                      <p className="text-xs sm:text-sm text-gray-500">Secure Health Portal</p>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Medical Records</span>
                        <span className="text-emerald-600 font-semibold text-sm sm:text-base">12</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Authorized Doctors</span>
                        <span className="text-emerald-600 font-semibold text-sm sm:text-base">3</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Last Update</span>
                        <span className="text-gray-500 text-xs sm:text-sm">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose DigiArogya?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              We put patients first with privacy-focused features designed for modern healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Feature Cards */}
            {[
              { icon: "🔒", title: "Privacy by Default", desc: "Your medical data is private by default. No one can access it without your explicit permission.", color: "emerald" },
              { icon: "✅", title: "Consent-Driven Access", desc: "Grant time-limited access to specific doctors. Revoke anytime. You're always in control.", color: "teal" },
              { icon: "📋", title: "Complete Medical History", desc: "Store prescriptions, lab results, diagnoses, imaging reports, and more in one secure place.", color: "cyan" },
              { icon: "👨‍⚕️", title: "Doctor Collaboration", desc: "Doctors can create and update your records securely when you grant them access.", color: "emerald" },
              { icon: "⏰", title: "Auto-Expiring Access", desc: "Access grants expire automatically after 30 days. No forgotten permissions lying around.", color: "teal" },
              { icon: "🛡️", title: "Enterprise Security", desc: "JWT authentication, BCrypt encryption, and role-based access control protect your data.", color: "cyan" },
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-${feature.color}-50 to-white p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-${feature.color}-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <span className="text-2xl sm:text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and patient-centered workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: 1, title: "Create Your Account", desc: "Sign up as a Patient or Doctor. Your account is secured with industry-standard encryption." },
              { step: 2, title: "Grant Access", desc: "Patients can grant specific doctors access to their records using the doctor's email." },
              { step: 3, title: "Manage Records", desc: "View your complete history. Doctors can add records when authorized by you." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="absolute -top-3 sm:-top-4 left-6 sm:left-8 w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                    {item.step}
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center lg:text-left">
                Security You Can Trust
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 text-center lg:text-left">
                Your health data deserves the highest level of protection. We've built DigiArogya 
                with security at its core.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  { title: "JWT Authentication", desc: "Secure, stateless token-based authentication" },
                  { title: "BCrypt Password Hashing", desc: "Your passwords are never stored in plain text" },
                  { title: "Role-Based Access Control", desc: "Strict permissions based on your role" },
                  { title: "Consent-Based Data Sharing", desc: "Data is never shared without explicit patient approval" },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-semibold text-sm sm:text-base">{item.title}</span>
                      <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
              <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <pre className="text-xs sm:text-sm text-gray-300 overflow-x-auto">
{`// Access Control Flow
if (role === "DOCTOR") {
  const hasAccess = await checkAccess(
    patientId, 
    doctorId
  );
  
  if (!hasAccess) {
    throw new AccessDeniedException(
      "Patient consent required"
    );
  }
}

// Patient always owns their data
return getRecords(patientId);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Take Control of Your Health Records?
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join DigiArogya today and experience healthcare data management the way it should be - 
            secure, private, and patient-controlled.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer">
              Create Free Account
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 cursor-pointer">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
