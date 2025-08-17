import React, { useState } from 'react';
import { X, Globe, Search, MapPin, Users } from 'lucide-react';
import { countries } from '../../utils/countries';

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

interface CountryStats {
  users: number;
  growth: string;
  popular: boolean;
}

const countryStats: { [key: string]: CountryStats } = {
  'Côte d\'Ivoire': { users: 15420, growth: '+12%', popular: true },
  'France': { users: 8750, growth: '+8%', popular: true },
  'Sénégal': { users: 6230, growth: '+15%', popular: true },
  'Mali': { users: 4180, growth: '+10%', popular: false },
  'Burkina Faso': { users: 3920, growth: '+18%', popular: false },
  'Canada': { users: 2840, growth: '+5%', popular: false },
  'Belgique': { users: 2150, growth: '+7%', popular: false },
  'Maroc': { users: 1980, growth: '+22%', popular: false },
  'Cameroun': { users: 1750, growth: '+14%', popular: false },
  'Gabon': { users: 1420, growth: '+9%', popular: false }
};

export const CountryModal: React.FC<CountryModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedCountry, 
  onCountryChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'africa' | 'europe' | 'america' | 'asia'>('all');

  if (!isOpen) return null;

  const regions = {
    africa: ['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Niger', 'Guinée', 'Maroc', 'Algérie', 'Tunisie', 'Cameroun', 'Gabon', 'Congo', 'Nigeria', 'Ghana', 'Afrique du Sud', 'Égypte'],
    europe: ['France', 'Belgique', 'Suisse', 'Espagne', 'Italie', 'Allemagne', 'Pays-Bas', 'Portugal', 'Angleterre'],
    america: ['Canada', 'États-Unis', 'Brésil', 'Argentine', 'Mexique', 'Colombie', 'Venezuela', 'Chili', 'Pérou'],
    asia: ['Chine', 'Japon', 'Inde', 'Corée du Sud', 'Thaïlande', 'Vietnam', 'Malaisie', 'Singapour']
  };

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || 
      regions[selectedRegion]?.includes(country.name);
    return matchesSearch && matchesRegion;
  });

  const handleCountrySelect = (countryName: string) => {
    onCountryChange(countryName);
    onClose();
  };

  const getCountryStats = (countryName: string): CountryStats => {
    return countryStats[countryName] || { users: Math.floor(Math.random() * 1000), growth: '+5%', popular: false };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Globe className="text-blue-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Changer de pays</h2>
                <p className="text-gray-600">Plateforme disponible dans le monde entier</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Pays actuel */}
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <div className="flex items-center space-x-3">
              <MapPin className="text-blue-600" size={20} />
              <div>
                <h3 className="font-semibold text-blue-800">Pays actuel</h3>
                <p className="text-blue-700">{selectedCountry}</p>
              </div>
            </div>
          </div>

          {/* Recherche et filtres */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un pays..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les régions</option>
              <option value="africa">🌍 Afrique</option>
              <option value="europe">🇪🇺 Europe</option>
              <option value="america">🌎 Amérique</option>
              <option value="asia">🌏 Asie</option>
            </select>
          </div>

          {/* Pays populaires */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🔥 Pays populaires</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(countryStats)
                .filter(([_, stats]) => stats.popular)
                .map(([countryName, stats]) => {
                  const country = countries.find(c => c.name === countryName);
                  return (
                    <button
                      key={countryName}
                      onClick={() => handleCountrySelect(countryName)}
                      className={`p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                        selectedCountry === countryName
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{country?.flag}</div>
                      <div className="text-sm font-medium text-gray-800">{countryName}</div>
                      <div className="text-xs text-gray-500">{stats.users.toLocaleString()} utilisateurs</div>
                    </button>
                  );
                })
              }
            </div>
          </div>

          {/* Liste complète des pays */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tous les pays disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredCountries.map((country) => {
                const stats = getCountryStats(country.name);
                return (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country.name)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-md text-left ${
                      selectedCountry === country.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{country.flag}</div>
                        <div>
                          <h4 className="font-medium text-gray-800">{country.name}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Users size={12} />
                            <span>{stats.users.toLocaleString()} utilisateurs</span>
                            <span className="text-green-600">{stats.growth}</span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedCountry === country.name && (
                        <div className="text-blue-600">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredCountries.length === 0 && (
            <div className="text-center py-12">
              <Globe size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Aucun pays trouvé</h3>
              <p className="text-gray-400">Essayez de modifier votre recherche</p>
            </div>
          )}

          {/* Informations importantes */}
          <div className="mt-8 p-4 bg-green-50 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-2">🌍 Plateforme mondiale</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>• Service disponible dans plus de 190 pays</p>
              <p>• Support multilingue et devises locales</p>
              <p>• Conformité aux réglementations locales</p>
              <p>• Méthodes de paiement adaptées à chaque région</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};