import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [phone, setPhone] = useState('+33123456789');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const success = await login(phone, password);
      if (!success) {
        setError('Identifiants incorrects.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur de connexion.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Champ téléphone avec fond jaune */}
      <div className="relative">
        <div className="flex items-center bg-yellow-100 rounded-2xl border-2 border-blue-200 focus-within:border-blue-500 transition-colors">
          <div className="pl-3 sm:pl-4 pr-2 sm:pr-3">
            <Phone className="text-blue-500" size={20} />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: +225 07 12 34 56 78"
            className="flex-1 py-3 sm:py-4 bg-transparent border-none outline-none text-gray-700 font-medium text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Champ mot de passe avec fond jaune */}
      <div className="relative">
        <div className="flex items-center bg-yellow-100 rounded-2xl border-2 border-blue-200 focus-within:border-blue-500 transition-colors">
          <div className="pl-3 sm:pl-4 pr-2 sm:pr-3">
            <Lock className="text-blue-500" size={20} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ex: password123"
            className="flex-1 py-3 sm:py-4 bg-transparent border-none outline-none text-gray-700 font-bold tracking-wider text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3 sm:pr-4 pl-2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-xs sm:text-sm text-center bg-red-50 p-2 sm:p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Bouton de connexion */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-lg"
      >
        {isLoading ? 'Connexion...' : 'Connexion'}
      </button>

      {/* Lien vers inscription */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium"
        >
          Pas de compte, inscrivez-vous maintenant
        </button>
      </div>
    </form>
  );
};