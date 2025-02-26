import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Preggo App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <div className="relative pt-16 pb-32 overflow-hidden">
          <div className="relative">
            <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
              <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    Your pregnancy journey simplified
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Track your pregnancy journey, get personalized insights, and connect with a supportive community of expecting mothers. 
                  </p>
                  <div className="mt-6">
                    <Link href="/signup" className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      Get started
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                  <div className="w-full h-96 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
                Everything you need for your pregnancy journey
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Track Your Progress</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Keep track of your pregnancy journey with our easy-to-use tracking tools.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Personalized Insights</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Get personalized insights and recommendations based on your unique pregnancy journey.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Community Support</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Connect with a supportive community of expecting mothers and healthcare professionals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-500">
            &copy; 2025 Preggo App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
