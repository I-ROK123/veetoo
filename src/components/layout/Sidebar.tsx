import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { 
  LayoutDashboard, 
  Receipt, 
  Package, 
  BarChart3,
  Users,
  Building, 
  CreditCard,
  Settings, 
  Menu, 
  X,
  Milk
} from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles: ('salesperson' | 'supervisor' | 'ceo')[];
}

const links: SidebarLink[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['salesperson', 'supervisor', 'ceo'],
  },
  {
    name: 'Invoices',
    href: '/invoices',
    icon: <Receipt className="w-5 h-5" />,
    roles: ['salesperson', 'supervisor', 'ceo'],
  },
  {
    name: 'Store',
    href: '/store',
    icon: <Package className="w-5 h-5" />,
    roles: ['supervisor', 'ceo'],
  },
  {
    name: 'Sales Team',
    href: '/team',
    icon: <Users className="w-5 h-5" />,
    roles: ['supervisor', 'ceo'],
  },
  {
    name: 'Banking',
    href: '/banking',
    icon: <Building className="w-5 h-5" />,
    roles: ['supervisor', 'ceo'],
  },
  {
    name: 'Debt',
    href: '/debt',
    icon: <CreditCard className="w-5 h-5" />,
    roles: ['salesperson', 'supervisor', 'ceo'],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['supervisor', 'ceo'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['salesperson', 'supervisor', 'ceo'],
  },
];

const Sidebar: React.FC = () => {
  const { userRole } = useAuthStore();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Filter links based on user role
  const filteredLinks = links.filter(link => 
    link.roles.includes(userRole as 'salesperson' | 'supervisor' | 'ceo')
  );
  
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-neutral-600 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-neutral-900 bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white dark:bg-neutral-800 shadow-md z-40 transition-transform duration-300 transform lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-2">
              <Milk className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">VeeToo</span>
            </div>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {filteredLinks.map((link) => {
                const isActive = location.pathname === link.href;
                
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={clsx(
                        "flex items-center px-3 py-2.5 rounded-md font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-primary-400"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* User role indicator */}
          <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Role: <span className="text-primary-600 dark:text-primary-400 capitalize">{userRole}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;