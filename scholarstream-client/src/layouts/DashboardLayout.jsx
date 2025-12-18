import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  FiHome, FiUser, FiFileText, FiStar, FiPlusCircle, 
  FiList, FiUsers, FiBarChart2, FiMenu, FiX, FiLogOut,
  FiCheckSquare, FiMessageSquare
} from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logOut } = useAuth();
  const [role] = useRole();
  const location = useLocation();

  // Close sidebar on route change
  useState(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logOut();
  };

  const studentLinks = [
    { path: '/dashboard/my-profile', icon: FiUser, label: 'My Profile' },
    { path: '/dashboard/my-applications', icon: FiFileText, label: 'My Applications' },
    { path: '/dashboard/my-reviews', icon: FiStar, label: 'My Reviews' },
  ];

  const moderatorLinks = [
    { path: '/dashboard/my-profile', icon: FiUser, label: 'My Profile' },
    { path: '/dashboard/manage-applications', icon: FiCheckSquare, label: 'Manage Applications' },
    { path: '/dashboard/all-reviews', icon: FiMessageSquare, label: 'All Reviews' },
  ];

  const adminLinks = [
    { path: '/dashboard/my-profile', icon: FiUser, label: 'My Profile' },
    { path: '/dashboard/add-scholarship', icon: FiPlusCircle, label: 'Add Scholarship' },
    { path: '/dashboard/manage-scholarships', icon: FiList, label: 'Manage Scholarships' },
    { path: '/dashboard/manage-users', icon: FiUsers, label: 'Manage Users' },
    { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return adminLinks;
      case 'moderator':
        return moderatorLinks;
      default:
        return studentLinks;
    }
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-secondary text-white p-4 flex items-center justify-between shadow-md">
        <Link to="/" className="text-lg sm:text-xl font-display font-bold">
          ScholarStream
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-70px)] lg:min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-secondary text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:min-h-screen`}
        >
          <div className="h-full flex flex-col overflow-y-auto">
            {/* Logo Section */}
            <div className="p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center gap-2"
                onClick={() => setSidebarOpen(false)}
              >
                <img
                  src="/logo.png"
                  alt="ScholarStream logo"
                  className="w-8 h-8 rounded-lg object-cover"
                  width={40}
                  height={40}
                />
                <span className="text-lg sm:text-xl font-display font-bold text-primary hidden sm:inline">
                  Scholar<span className="text-primary">Stream</span>
                </span>
              </Link>
            </div>

            {/* User Info Section */}
            <div className="p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={user?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                  alt={user?.displayName}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{user?.displayName}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 capitalize truncate">{role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
              <ul className="space-y-1 sm:space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`
                      }
                    >
                      <link.icon size={20} className="flex-shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Bottom Links */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-8 border-t border-slate-700">
                <NavLink
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 text-sm sm:text-base"
                >
                  <FiHome size={20} className="flex-shrink-0" />
                  <span>Back to Home</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 mt-2 text-sm sm:text-base text-left"
                >
                  <FiLogOut size={20} className="flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;