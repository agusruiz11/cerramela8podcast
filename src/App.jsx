import React, { useState, Suspense, lazy, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { Toaster } from '@/components/ui/toaster';

// Lazy load components that are below the fold
const NewsletterCTA1 = lazy(() => import('@/components/NewsletterCTA1'));
const LatestEpisodes = lazy(() => import('@/components/LatestEpisodes'));
const MaestrasSection = lazy(() => import('@/components/MaestrasSection'));
const Marquee = lazy(() => import('@/components/Marquee'));
const HablemosSection = lazy(() => import('@/components/HablemosSection'));
const Footer = lazy(() => import('@/components/Footer'));
const PostSubscriptionModal = lazy(() => import('@/components/PostSubscriptionModal'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center bg-[#0F0F0F]">
    <div className="w-8 h-8 border-2 border-[#2A51F4] border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleSubscribeSuccess = useCallback(() => {
    setShowSubscriptionModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowSubscriptionModal(false);
  }, []);

  return (
    <>
      <Helmet>
        <title>Cerrame la 8 - Podcast de Gastronomía y Competitividad</title>
        <meta 
          name="description" 
          content="Cerrame la 8: el podcast #1 de gastronomía y competitividad. Suscribite al newsletter y escuchá los últimos episodios con las mentes maestras del sector." 
        />
        <meta name="keywords" content="Cerrame la 8, podcast, gastronomía, competitividad, negocios, emprendimiento" />
        <meta property="og:title" content="Cerrame la 8 - Podcast de Gastronomía y Competitividad" />
        <meta property="og:description" content="Cerrame la 8: el podcast #1 de gastronomía y competitividad." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-[#0F0F0F]">
        <Header />
        <main>
          <Hero />
          <Suspense fallback={<LoadingFallback />}>
            <NewsletterCTA1 onSubscribeSuccess={handleSubscribeSuccess} />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <LatestEpisodes />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <MaestrasSection />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <Marquee />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <HablemosSection />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <Suspense fallback={null}>
          <PostSubscriptionModal 
            isOpen={showSubscriptionModal}
            onClose={handleCloseModal}
          />
        </Suspense>
        <Toaster />
      </div>
    </>
  );
}

export default App;
