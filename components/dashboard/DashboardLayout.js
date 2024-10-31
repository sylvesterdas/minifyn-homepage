import { useState } from 'react';
import Head from 'next/head';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import DashboardFooter from './DashboardFooter';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>MiniFyn Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <DashboardNavbar setSidebarOpen={setSidebarOpen} />
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
          <DashboardFooter />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;