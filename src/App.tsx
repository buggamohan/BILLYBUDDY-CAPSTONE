import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AppRoutes from './routes';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
            <footer className="bg-white border-t mt-auto">
              <div className="max-w-7xl mx-auto py-6 px-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} CyberGuard. All rights reserved.
                  </p>
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a>
                    <a href="#" className="text-gray-500 hover:text-gray-700">Terms of Service</a>
                    <a href="#" className="text-gray-500 hover:text-gray-700">Contact</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;