import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '../components/Auth/LoginForm';
import { RegisterForm } from '../components/Auth/RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background avec image de stade */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
        }}
      >
        {/* Overlay bleu */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-blue-700/80"></div>
        
        {/* Effet de texture */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      {/* Sélecteur de langue en haut à droite */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white rounded-lg px-3 py-2 flex items-center space-x-2 shadow-lg">
          <span className="text-2xl">🇫🇷</span>
          <span className="text-sm font-medium text-gray-700">Français</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto"
        >
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 relative">
              <div className="w-full h-full bg-gradient-to-br from-red-500 via-blue-600 to-navy-800 rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  {/* Ballon de football stylisé */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#000" fillOpacity="0.1"/>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white"/>
                      <path d="M12 6l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="#333"/>
                    </svg>
                  </div>
                  {/* Lignes de vitesse */}
                  <div className="absolute -right-1 sm:-right-2 top-1 sm:top-2">
                    <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-red-500 rounded transform rotate-12 mb-0.5 sm:mb-1"></div>
                    <div className="w-4 sm:w-6 h-0.5 sm:h-1 bg-blue-600 rounded transform rotate-12 mb-0.5 sm:mb-1"></div>
                    <div className="w-3 sm:w-4 h-0.5 sm:h-1 bg-navy-800 rounded transform rotate-12"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium tracking-wider">
              • • • Sheng Ji Football Sports • • •
            </div>
          </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-green-800 mb-2">🎯 Comptes de test disponibles :</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Créez un nouveau compte</strong> ou utilisez les comptes existants</p>
            <p><strong>Inscription :</strong> Nom d'utilisateur + téléphone + mot de passe</p>
            <p><strong>Connexion :</strong> Téléphone + mot de passe</p>
            <p><strong>Bonus :</strong> 50 FCFA offerts à l'inscription !</p>
          </div>
        </div>

          {/* Form */}
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};