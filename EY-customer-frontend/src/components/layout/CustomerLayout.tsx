import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ChatWidget } from '@/components/chat/ChatWidget';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen theme-bg bg-mesh transition-colors duration-300">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      {/* Chat Widget at layout level for all customer pages */}
      <ChatWidget />
    </div>
  );
};
