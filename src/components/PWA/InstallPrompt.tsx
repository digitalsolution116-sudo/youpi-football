import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds if not dismissed
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 30000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50"
      >
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <Smartphone className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Installer l'application
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Ajoutez notre app à votre écran d'accueil pour un accès rapide et une meilleure expérience.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleInstall}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                <span>Installer</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};