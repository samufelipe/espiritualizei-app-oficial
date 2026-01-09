import React, { useState, useEffect } from 'react';
import { Parish } from '@/types';
import { MapPin, Navigation, Star, Clock, ExternalLink, Loader2, Search, Church } from 'lucide-react';
import { searchNearbyParishes } from '@/services/googlePlacesService';

interface ParishFinderProps {
  onClose?: () => void;
}

const ParishFinder: React.FC<ParishFinderProps> = ({ onClose }) => {
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          handleSearch(coords);
        },
        (err) => {
          setError('Não foi possível obter sua localização. Permita o acesso à localização para encontrar paróquias próximas.');
        }
      );
    }
  }, []);

  const handleSearch = async (coords?: { lat: number; lng: number }) => {
    const location = coords || userLocation;
    if (!location) {
      setError('Localização não disponível');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchNearbyParishes(location.lat, location.lng, searchQuery);
      const sorted = results.sort((a: Parish, b: Parish) => {
        const distA = parseFloat(a.distance?.replace(/[^\d.]/g, '') || '999');
        const distB = parseFloat(b.distance?.replace(/[^\d.]/g, '') || '999');
        return distA - distB;
      });
      setParishes(sorted);
    } catch (err) {
      setError('Erro ao buscar paróquias. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Church className="text-brand-violet" />
            Encontrar Paróquias
          </h1>
          <p className="text-slate-400 text-sm mt-1">Igrejas católicas próximas a você</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por nome ou endereço..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-violet focus:outline-none"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="px-4 py-3 bg-brand-violet hover:bg-brand-violet-dark rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 size={32} className="animate-spin text-brand-violet mb-4" />
          <p>Buscando paróquias próximas...</p>
        </div>
      )}

      {/* Results */}
      {!loading && parishes.length > 0 && (
        <div className="space-y-4">
          {parishes.map((parish, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-brand-violet/50 transition-colors"
            >
              <div className="flex gap-4">
                {/* Photo */}
                {parish.photoUrl && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                    <img src={parish.photoUrl} alt={parish.name} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{parish.name}</h3>
                  
                  <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                    <MapPin size={14} />
                    <span className="truncate">{parish.address}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm">
                    {parish.rating && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} />
                        <span>{parish.rating}</span>
                        {parish.userRatingsTotal && (
                          <span className="text-slate-500">({parish.userRatingsTotal})</span>
                        )}
                      </div>
                    )}
                    
                    {parish.distance && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Navigation size={14} />
                        <span>{parish.distance}</span>
                      </div>
                    )}

                    {parish.openNow !== undefined && (
                      <div className={`flex items-center gap-1 ${parish.openNow ? 'text-green-400' : 'text-red-400'}`}>
                        <Clock size={14} />
                        <span>{parish.openNow ? 'Aberto' : 'Fechado'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {parish.directionsUrl && (
                    <a
                      href={parish.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-brand-violet/20 text-brand-violet rounded-lg hover:bg-brand-violet/30 transition-colors"
                    >
                      <Navigation size={18} />
                    </a>
                  )}
                  {parish.url && (
                    <a
                      href={parish.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && parishes.length === 0 && userLocation && (
        <div className="text-center py-12 text-slate-400">
          <Church size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhuma paróquia encontrada.</p>
          <p className="text-sm mt-1">Tente ampliar sua busca ou verificar sua localização.</p>
        </div>
      )}
    </div>
  );
};

export default ParishFinder;
