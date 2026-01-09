import React, { useState } from 'react';
import { UserProfile, UserSettings } from '../types';
import { User, Mail, Phone, Camera, Settings, LogOut, Crown, Calendar, Flame, Star, Edit2, Save, X } from 'lucide-react';
import { uploadImage } from '../services/databaseService';
import { updateUserProfile } from '../services/authService';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenCheckout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout, onOpenCheckout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedBio, setEditedBio] = useState(user.bio || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    const updatedUser = { ...user, name: editedName, bio: editedBio };
    await updateUserProfile(updatedUser);
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const photoUrl = await uploadImage(file, 'avatars');
      if (photoUrl) {
        const updatedUser = { ...user, photoUrl };
        await updateUserProfile(updatedUser);
        onUpdateUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const xpProgress = (user.currentXP / user.nextLevelXP) * 100;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-brand-violet/20 to-purple-900/20 rounded-2xl p-6 border border-brand-violet/30">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-brand-violet/30 flex items-center justify-center overflow-hidden border-2 border-brand-violet">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-brand-violet" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-brand-violet rounded-full cursor-pointer hover:bg-brand-violet-dark transition-colors">
              <Camera size={14} />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={isUploading} />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold bg-white/10 rounded px-2 py-1 w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold">{user.name}</h1>
            )}
            <p className="text-slate-400 text-sm mt-1">{user.email}</p>
            
            {user.isPremium && (
              <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                <Crown size={12} />
                Premium
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                  <Save size={18} />
                </button>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                  <X size={18} />
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                <Edit2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              placeholder="Escreva uma breve bio..."
              className="w-full bg-white/10 rounded-lg p-3 text-sm resize-none"
              rows={2}
            />
          ) : (
            <p className="text-slate-300 text-sm">{user.bio || 'Nenhuma bio definida.'}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
          <Star className="mx-auto mb-2 text-yellow-400" size={24} />
          <p className="text-2xl font-bold">{user.level}</p>
          <p className="text-xs text-slate-400">Nível</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
          <Flame className="mx-auto mb-2 text-orange-400" size={24} />
          <p className="text-2xl font-bold">{user.streakDays}</p>
          <p className="text-xs text-slate-400">Dias de Sequência</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
          <Calendar className="mx-auto mb-2 text-blue-400" size={24} />
          <p className="text-2xl font-bold">{user.currentXP}</p>
          <p className="text-xs text-slate-400">XP Total</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
          <Crown className="mx-auto mb-2 text-brand-violet" size={24} />
          <p className="text-lg font-bold">{user.patronSaint || '-'}</p>
          <p className="text-xs text-slate-400">Santo Padroeiro</p>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex justify-between text-sm mb-2">
          <span>Progresso para Nível {user.level + 1}</span>
          <span>{user.currentXP}/{user.nextLevelXP} XP</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-violet to-purple-400 transition-all"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!user.isPremium && onOpenCheckout && (
          <button
            onClick={onOpenCheckout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Crown size={20} />
            Atualizar para Premium
          </button>
        )}
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

export default Profile;
