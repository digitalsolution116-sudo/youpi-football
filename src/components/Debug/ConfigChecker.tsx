import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { paydunyaService } from '../../services/paydunyaService';

interface ConfigStatus {
  hasUrl: boolean;
  hasKey: boolean;
  urlValid: boolean;
  keyValid: boolean;
  connectionWorks: boolean;
  paydunyaConfigured: boolean;
  error?: string;
}

export const ConfigChecker: React.FC = () => {
  const [status, setStatus] = useState<ConfigStatus>({
    hasUrl: false,
    hasKey: false,
    urlValid: false,
    keyValid: false,
    connectionWorks: false,
    paydunyaConfigured: false
  });
  const [showDetails, setShowDetails] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    setIsChecking(true);
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const newStatus: ConfigStatus = {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlValid: false,
      keyValid: false,
      connectionWorks: false,
      paydunyaConfigured: false
    };

    // Vérifier le format de l'URL
    if (supabaseUrl) {
      newStatus.urlValid = supabaseUrl.includes('.supabase.co') && !supabaseUrl.includes('your-project');
    }

    // Vérifier le format de la clé
    if (supabaseKey) {
      newStatus.keyValid = supabaseKey.startsWith('eyJ') && !supabaseKey.includes('your-anon');
    }

    // Tester la connexion Supabase
    if (newStatus.urlValid && newStatus.keyValid) {
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (!error) {
          newStatus.connectionWorks = true;
        } else {
          newStatus.error = error.message;
        }
      } catch (error) {
        newStatus.error = error instanceof Error ? error.message : 'Erreur de connexion';
      }
    }

    // Vérifier la configuration Paydunya
    const paydunyaStatus = paydunyaService.getConfigurationStatus();
    newStatus.paydunyaConfigured = paydunyaStatus.isConfigured;

    setStatus(newStatus);
    setIsChecking(false);
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="text-green-500" size={20} />
    ) : (
      <XCircle className="text-red-500" size={20} />
    );
  };

  const allConfigured = status.hasUrl && status.hasKey && status.urlValid && status.keyValid && status.connectionWorks;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className={`bg-white border-2 rounded-xl shadow-lg p-4 ${
        allConfigured ? 'border-green-500' : 'border-red-500'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {allConfigured ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <AlertTriangle className="text-red-500" size={24} />
            )}
            <div>
              <h3 className="font-bold text-gray-800">
                {allConfigured ? '✅ Configuration OK' : '❌ Configuration requise'}
              </h3>
              <p className="text-sm text-gray-600">
                {allConfigured 
                  ? 'Supabase connecté • Paydunya configuré'
                  : 'Configuration Supabase et Paydunya requise'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {showDetails ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={checkConfiguration}
              disabled={isChecking}
              className="p-2 text-blue-500 hover:text-blue-700"
            >
              <RefreshCw size={20} className={isChecking ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-3 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.hasUrl)}
                  <span className="text-sm">URL Supabase</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.keyValid)}
                  <span className="text-sm">Clé Supabase</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.connectionWorks)}
                  <span className="text-sm">Connexion DB</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.paydunyaConfigured)}
                  <span className="text-sm">Paydunya configuré</span>
                </div>
              </div>
            </div>

            {!allConfigured && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🔧 Configuration :</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Cliquez sur "Connect to Supabase" en haut à droite</li>
                  <li>2. Les clés Paydunya sont déjà configurées</li>
                  <li>3. Testez un paiement après connexion Supabase</li>
                </ol>
              </div>
            )}

            {status.paydunyaConfigured && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Paydunya prêt :</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• Mode test activé</p>
                  <p>• Support Mobile Money (Orange, MTN, Moov)</p>
                  <p>• Support cartes bancaires</p>
                  <p>• Prêt pour les tests de paiement</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};