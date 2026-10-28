import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Coworking from '@/components/Coworking';
import MediaCenter from '@/components/MediaCenter';
import ROICalculator from '@/components/ROICalculator';
import Events from '@/components/Events';
import Portfolio from '@/components/Portfolio';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import Chatbot from '@/components/Chatbot';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Header onAdminClick={() => setShowAdmin(true)} />
      {showAdmin ? (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      ) : (
        <main>
          <Hero />
          <Coworking />
          <Events />
          <MediaCenter />
          <ROICalculator />
          <Portfolio />
        </main>
      )}
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
