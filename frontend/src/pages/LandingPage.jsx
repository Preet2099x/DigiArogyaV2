const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6 animate-fade-in-up">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Now available for all healthcare providers
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                Connected Healthcare for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 block sm:inline"> Patients & Doctors</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                DigiArogya bridges the gap between you and your healthcare providers. 
                A secure, consent-driven system for seamless patient-doctor collaboration.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1">
                  Get Started Free
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200">
                  View Demo
                </button>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  </div>
                  <span>Free for Patients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-full text-blue-600">
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 10.043c.85-5.434 5.38-9.599 10.834-9.599 6.004 0 10.872 4.868 10.872 10.872 0 6.003-4.868 10.872-10.872 10.872-5.454 0-9.984-4.165-10.834-9.599l3.968-.535c.571 3.298 3.447 5.8 6.866 5.8 3.868 0 7.005-3.137 7.005-7.005s-3.137-7.005-7.005-7.005c-3.419 0-6.295 2.502-6.866 5.8l-3.968-.535z" clipRule="evenodd"></path></svg>
                  </div>
                  <span>End-to-End Encrypted</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="w-full lg:w-1/2 mt-12 lg:mt-0 relative">
               {/* Floating Elements */}
               <div className="absolute top-10 -right-8 w-20 h-20 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
               <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
               
              <div className="relative max-w-md mx-auto lg:max-w-none transform hover:scale-[1.02] transition-transform duration-500">
                {/* Background blobs */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-30"></div>
                
                {/* Dashboard Card */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                  <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                     <div>
                        <p className="text-xs font-bold text-gray-900">Access Granted</p>
                        <p className="text-[10px] text-gray-500">Dr. Sarah updated records</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <span className="text-2xl">🏥</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Unified Health Portal</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-sm text-gray-500">System Online</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="group bg-gray-50 rounded-xl p-4 hover:bg-emerald-50 transition-colors cursor-default border border-transparent hover:border-emerald-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <span className="text-xl p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">📋</span>
                           <span className="text-sm font-semibold text-gray-700">Medical Records</span>
                        </div>
                        <span className="text-emerald-600 font-bold bg-white px-3 py-1 rounded-full text-sm shadow-sm">12 Files</span>
                      </div>
                    </div>
                    <div className="group bg-gray-50 rounded-xl p-4 hover:bg-emerald-50 transition-colors cursor-default border border-transparent hover:border-emerald-100">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                           <span className="text-xl p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">👨‍⚕️</span>
                           <span className="text-sm font-semibold text-gray-700">Active Doctors</span>
                        </div>
                        <span className="text-emerald-600 font-bold bg-white px-3 py-1 rounded-full text-sm shadow-sm">3 Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
                     <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Security Level</p>
                        <p className="text-emerald-600 font-bold flex items-center gap-1">
                           <span className="text-lg">🛡️</span> Enterprise Grade
                        </p>
                     </div>
                     <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">+2k</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-emerald-900 py-10 border-y border-emerald-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-emerald-800/50">
               <div>
                  <p className="text-3xl font-bold text-white mb-1">10k+</p>
                  <p className="text-emerald-200 text-sm">Records Secured</p>
               </div>
               <div>
                  <p className="text-3xl font-bold text-white mb-1">99.9%</p>
                  <p className="text-emerald-200 text-sm">Uptime Guarantee</p>
               </div>
               <div>
                  <p className="text-3xl font-bold text-white mb-1">24/7</p>
                  <p className="text-emerald-200 text-sm">System Access</p>
               </div>
               <div>
                  <p className="text-3xl font-bold text-white mb-1">ISO</p>
                  <p className="text-emerald-200 text-sm">Compliant Security</p>
               </div>
            </div>
         </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Features</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
              One Platform, Two Perspectives
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're managing your own health or caring for patients, DigiArogya provides the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            {/* For Patients */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
               <div className="bg-emerald-600 p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-4 mb-4">
                     <span className="text-4xl">👤</span>
                     <h3 className="text-2xl font-bold">For Patients</h3>
                  </div>
                  <p className="text-emerald-100">Take control of your medical history with complete privacy and ownership.</p>
               </div>
               <div className="p-6 sm:p-8 grid gap-6">
                  {[
                     { icon: "🔒", title: "Private by Default", desc: "Your data is encrypted and invisible to everyone until you share it." },
                     { icon: "✅", title: "Consent Control", desc: "Grant temporary access to doctors via email. Revoke anytime with one click." },
                     { icon: "📂", title: "Centralized Records", desc: "Prescriptions, labs, and imaging in one timeline. No more lost paper files." },
                  ].map((feature, i) => (
                     <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">
                           {feature.icon}
                        </div>
                        <div>
                           <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                           <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* For Doctors */}
             <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
               <div className="bg-teal-700 p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-4 mb-4">
                     <span className="text-4xl">👨‍⚕️</span>
                     <h3 className="text-2xl font-bold">For Doctors</h3>
                  </div>
                  <p className="text-teal-100">Streamline patient care with instant access to comprehensive medical histories.</p>
               </div>
               <div className="p-6 sm:p-8 grid gap-6">
                  {[
                     { icon: "⚡", title: "Instant Access", desc: "View a patient's full history immediately upon access grant. No waiting." },
                     { icon: "📝", title: "Digital Prescriptions", desc: "Create and sign records digitally. They are instantly added to the patient's file." },
                     { icon: "👥", title: "Simple Patient Management", desc: "Track all your active patient accesses in one organized dashboard." },
                  ].map((feature, i) => (
                     <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-xl">
                           {feature.icon}
                        </div>
                        <div>
                           <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                           <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, secure workflow connecting patients and doctors
            </p>
          </div>

          <div className="relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-emerald-100 -translate-y-1/2 z-0"></div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
               {[
                 { step: 1, title: "Create Your Account", desc: "Sign up as a Patient or Doctor. Verify your identity and join the secure healthcare network.", icon: "📝" },
                 { step: 2, title: "Connect & Grant", desc: "Patients strictly control access. Grant time-limited viewing rights to your doctor using their email.", icon: "🔐" },
                 { step: 3, title: "Collaborate on Care", desc: "Doctors view history and append new records. Patients see updates instantly in their portal.", icon: "🤝" },
               ].map((item) => (
                 <div key={item.step} className="relative group">
                   <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full hover:-translate-y-2 transition-transform duration-300">
                     <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-3xl text-white shadow-lg mb-6 group-hover:scale-110 transition-transform">
                       {item.icon}
                     </div>
                     <div className="text-center">
                       <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-3">
                          STEP {item.step}
                       </div>
                       <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                       <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 lg:py-24 bg-gray-900 text-white overflow-hidden relative">
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2">
              <div className="inline-block px-4 py-2 bg-emerald-900/50 rounded-lg text-emerald-400 font-bold text-sm mb-6 border border-emerald-800">
                 ENTERPRISE GRADE SECURITY
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Your Health Data,<br />
                <span className="text-emerald-400">Fort Knox Level Protection.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                We don't just store your data; we protect it with the same encryption standards used by banks and government agencies.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                 {[
                  { title: "JWT Auth", desc: "Stateless, secure sessions" },
                  { title: "BCrypt", desc: "Military-grade hashing" },
                  { title: "RBAC", desc: "Role-based access control" },
                  { title: "Audit Logs", desc: "Track every single view" },
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                       <div>
                          <h4 className="font-bold text-white text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-400">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
               {/* Terminal Window */}
              <div className="rounded-xl overflow-hidden bg-[#1E1E1E] shadow-2xl border border-gray-700 font-mono text-sm relative group">
                 <div className="bg-[#2D2D2D] px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                       <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                       <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <div className="ml-4 text-gray-400 text-xs">security_check.js — Node</div>
                 </div>
                 <div className="p-6 text-gray-300 space-y-2">
                    <div className="flex">
                       <span className="text-emerald-500 mr-2">➜</span>
                       <span>initiating_security_protocol()</span>
                    </div>
                    <div className="text-gray-500">... verifying encryption keys</div>
                    <div className="text-gray-500">... authenticating session token</div>
                    <div className="flex text-blue-400">
                       <span className="mr-2">ℹ</span>
                       <span>Role Detected: DOCTOR</span>
                    </div>
                    <div>
                       <span className="text-purple-400">const</span> hasConsent = <span className="text-yellow-400">await</span> checkAccess(patientId);
                    </div>
                     <div className="pl-4 border-l-2 border-gray-700 my-2 py-1">
                        <span className="text-gray-500">// If no explicit consent exists</span><br/>
                        <span className="text-purple-400">if</span> (!hasConsent) <span className="text-red-400">throw</span> <span className="text-orange-400">new</span> AccessDeniedException();
                     </div>
                    <div className="flex mt-4 animate-pulse">
                       <span className="text-emerald-500 mr-2">✔</span>
                       <span className="text-emerald-500">Access Granted: Secure Channel Established</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Trusted by Healthcare Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  { name: "Dr. Anjali Sharma", role: "Cardiologist", text: "DigiArogya has completely transformed how I access patient history. It's fast, secure, and my patients love the transparency.", initial: "A" },
                  { name: "Rajesh Kumar", role: "Patient", text: "Finally, I don't have to carry a thick file of papers to every appointment. I just grant access on my phone. Pure peace of mind.", initial: "R" },
                  { name: "City Care Hospital", role: "Partner Clinic", text: "Integrating DigiArogya was seamless. The consent workflow ensures we are always compliant with privacy standards.", initial: "C" },
               ].map((t, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-left relative">
                     <div className="absolute top-6 right-8 text-6xl text-emerald-100 font-serif opacity-50">"</div>
                     <p className="text-gray-600 mb-6 relative z-10 italic">"{t.text}"</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                           {t.initial}
                        </div>
                        <div>
                           <p className="font-bold text-gray-900">{t.name}</p>
                           <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">{t.role}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-emerald-600 relative overflow-hidden">
         <div className="absolute inset-0">
            <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[200%] bg-emerald-500 transform rotate-12 opacity-50"></div>
            <div className="absolute -bottom-[50%] -right-[20%] w-[100%] h-[200%] bg-teal-600 transform -rotate-12 opacity-50"></div>
         </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to Modernize Your<br/>Healthcare Experience?
          </h2>
          <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
             Join thousands of patients and doctors who are already experiencing the future of secure, connected health records.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg">
              Create Free Account
            </button>
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-emerald-400 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-200 text-lg">
              Partner with Us
            </button>
          </div>
          <p className="mt-6 text-sm text-emerald-200/80">
             No credit card required • GDPR Compliant • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
