
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProfileInfoCard = ({ user, avatarPreview, onEdit }) => {
  return (
    <Card className="minecraft-card mb-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <img
              src={avatarPreview || user.avatar || 'https://via.placeholder.com/150/220033/FFFFFF?text=Avatar'}
              alt={user.username}
              className="w-20 h-20 rounded-full border-2 border-primary object-cover"
            />
            <div>
              <CardTitle className="text-foreground">{user.username}</CardTitle>
              <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
            </div>
          </div>
          <Button
            onClick={onEdit}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            Editar Perfil
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Bio:</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {user.bio || 'Nenhuma bio adicionada ainda.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
