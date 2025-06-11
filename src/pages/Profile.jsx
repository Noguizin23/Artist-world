
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, FileText, Plus, Trash2, ExternalLink, Upload, X, Users, MessageSquare, Phone } from 'lucide-react';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import EditProfileForm from '@/components/profile/EditProfileForm';
import PortfolioSection from '@/components/profile/PortfolioSection';
import SocialInteractionsPlaceholder from '@/components/profile/SocialInteractionsPlaceholder';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    avatarFile: null,
  });
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        avatarFile: null,
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleSaveProfile = (updatedData) => {
    updateUser(updatedData);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="minecraft-card">
          <CardContent className="p-8 text-center">
            <p className="text-foreground text-lg">Você precisa estar logado para acessar o perfil.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-8">Meu Perfil</h1>

          {isEditing ? (
            <EditProfileForm
              user={user}
              formData={formData}
              setFormData={setFormData}
              avatarPreview={avatarPreview}
              setAvatarPreview={setAvatarPreview}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileInfoCard 
              user={user} 
              avatarPreview={avatarPreview} 
              onEdit={() => setIsEditing(true)} 
            />
          )}
          
          <SocialInteractionsPlaceholder />
          <PortfolioSection user={user} updateUser={updateUser} />

        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
