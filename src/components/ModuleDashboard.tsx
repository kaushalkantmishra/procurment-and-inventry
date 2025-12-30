import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Settings, 
  BarChart, 
  DollarSign,
  LogOut,
  User,
  Users,
  Truck,
  UserCheck,
  Factory,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

const iconMap = {
  ShoppingCart,
  Package,
  Settings,
  BarChart,
  DollarSign,
  Users,
  Truck,
  UserCheck,
  Factory,
  TrendingUp,
  Briefcase
};

const ModuleDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, modules, logout } = useAuthStore();

  const handleModuleClick = (module: any) => {
    if (module.isAvailable) {
      navigate(module.route);
    } else {
      navigate('/coming-soon', { state: { module } });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="text-primary-600 mr-3" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">ERP Desk</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut size={16} className="mr-2 " />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Select a module to get started with your ERP operations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-lg font-semibold text-gray-900">Online</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Your Role</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="w-8 h-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Modules</p>
                <p className="text-lg font-semibold text-gray-900">{modules.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {modules.map((module) => {
            const IconComponent = iconMap[module.icon as keyof typeof iconMap];
            
            return (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module)}
                className={`bg-white rounded-lg shadow-md border transition-all duration-200 cursor-pointer group hover:shadow-lg hover:scale-105 ${
                  !module.isAvailable 
                    ? 'border-gray-200 hover:border-gray-300 opacity-75' 
                    : 'border-primary-200 hover:border-primary-300'
                }`}
              >
                <div className="p-6">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-lg mb-4 transition-all duration-200 ${
                    !module.isAvailable 
                      ? 'bg-gray-100' 
                      : 'bg-primary-50 group-hover:bg-primary-100'
                  }`}>
                    {IconComponent && (
                      <IconComponent 
                        size={28} 
                        className={`${
                          !module.isAvailable 
                            ? 'text-gray-400' 
                            : 'text-primary-600 group-hover:text-primary-700'
                        }`} 
                      />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {module.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  
                  <div className={`flex items-center justify-between text-sm font-medium ${
                    !module.isAvailable 
                      ? 'text-gray-400' 
                      : 'text-primary-600 group-hover:text-primary-700'
                  }`}>
                    <span>{module.isAvailable ? 'Open Module' : 'Coming Soon'}</span>
                    <div className={`p-1.5 rounded-full transition-all duration-200 ${
                      !module.isAvailable 
                        ? 'bg-gray-100' 
                        : 'bg-primary-50 group-hover:bg-primary-100'
                    }`}>
                      <svg 
                        className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {modules.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No modules available
            </h3>
            <p className="text-gray-600">
              Contact your administrator to get access to modules.
            </p>
          </div>
        )}

        {/* Settings Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Settings size={20} className="text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Application configuration and user management</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
              >
                <Settings size={16} />
                Open Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleDashboard;