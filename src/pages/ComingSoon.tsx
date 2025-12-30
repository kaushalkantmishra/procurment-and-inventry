import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ComingSoon: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const module = location.state?.module;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Clock size={32} className="text-primary-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {module?.name || 'Coming Soon'}
        </h1>

        <p className="text-gray-600 mb-6">
          {module?.description || 'This module is currently under development and will be available soon.'}
        </p>

        <div className="flex items-center justify-center mb-6">
          <Package size={48} className="text-gray-300" />
        </div>

        <p className="text-sm text-gray-500 mb-8">
          We're working hard to bring you this feature. Stay tuned for updates!
        </p>

        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};