import React, { useState } from 'react';
import { Eye, EyeOff, User, Phone, Lock, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { countries } from '../../utils/countries';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    referralCode: 'Arthur2024',
    country: 'Côte d\'Ivoire',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.phone || !formData.password || !formData.country) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    // Générer un email unique basé sur le nom d'utilisateur
    const email = `${formData.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@footballbet.app`;
    
    try {
      const success = await register({
        ...formData,
        email: email
      });
      if (!success) {
        setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'inscription.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Champ nom d'utilisateur */}
      <div className="relative">
        <div className="flex items-center bg-gray-50 rounded-2xl border-2 border-blue-200 focus-within:border-blue-500 transition-colors">
          <div className="pl-3 sm:pl-4 pr-2 sm:pr-3">
            <User className="text-blue-500" size={20} />
          </div>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Veuillez entrer le compte"
            className="flex-1 py-3 sm:py-4 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Champ téléphone avec fond jaune */}
      <div className="relative">
        <div className="flex items-center bg-yellow-100 rounded-2xl border-2 border-blue-200 focus-within:border-blue-500 transition-colors">
          <div className="pl-3 sm:pl-4 pr-2 sm:pr-3">
            <Phone className="text-blue-500" size={20} />
          </div>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
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
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
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

      {/* Champ code de parrainage */}
      <div className="relative">
        <div className="flex items-center bg-gray-50 rounded-2xl border-2 border-blue-200 focus-within:border-blue-500 transition-colors">
          <div className="pl-3 sm:pl-4 pr-2 sm:pr-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <input
            type="text"
            value={formData.referralCode}
            onChange={(e) => handleInputChange('referralCode', e.target.value)}
            placeholder="Code de parrainage (optionnel)"
            className="flex-1 py-3 sm:py-4 bg-transparent border-none outline-none text-gray-700 font-medium text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Sélecteur de pays */}
      <div className="relative">
        <div className="flex items-center bg-gray-50 rounded-2xl border-2 border-blue-200 focus-within:border-blue-500 transition-colors">
          <div className="pl-3 sm:pl-4 pr-2 sm:pr-3">
            <MapPin className="text-orange-500" size={20} />
          </div>
          <input
            type="text"
            placeholder="Veuillez sélectionner le pays"
            className="flex-1 py-3 sm:py-4 bg-transparent border-none outline-none text-gray-400 text-sm sm:text-base"
            readOnly
          />
          <div className="pr-3 sm:pr-4">
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-xs sm:text-sm text-center bg-red-50 p-2 sm:p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Bouton d'inscription */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-lg"
      >
        {isLoading ? 'Inscription...' : 'Inscription'}
      </button>

      {/* Lien vers connexion */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium"
        >
          Compte déjà existant, connectez-vous maintenant
        </button>
      </div>
    </form>
  );
};