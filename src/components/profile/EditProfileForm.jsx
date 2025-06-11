
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, FileText, Upload, X } from 'lucide-react';

const EditProfileForm = ({ user, formData, setFormData, avatarPreview, setAvatarPreview, onSave, onCancel }) => {
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarFile: file, avatar: reader.result }));
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInternalSave = () => {
    const profileDataToUpdate = {
      username: formData.username,
      email: formData.email,
      bio: formData.bio,
      avatar: formData.avatar, 
    };
    onSave(profileDataToUpdate);
  };

  return (
    <Card className="minecraft-card mb-8">
      <CardHeader>
        <CardTitle className="text-foreground">Editar Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">Nome de Usuário</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-foreground">Foto de Perfil</Label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <img src={avatarPreview} alt="Pré-visualização do Avatar" className="w-16 h-16 rounded-full object-cover border border-border" />
              )}
              <Label
                htmlFor="avatarUploadEdit"
                className="cursor-pointer bg-input border border-border text-foreground rounded-md px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
              >
                <Upload className="w-4 h-4"/>
                {avatarPreview ? 'Alterar Foto' : 'Selecionar Foto'}
              </Label>
              <Input id="avatarUploadEdit" type="file" className="hidden" onChange={handleAvatarFileChange} accept="image/*" />
              {avatarPreview && formData.avatar && (
                <Button variant="ghost" size="sm" onClick={() => { setAvatarPreview(''); setFormData(prev => ({...prev, avatar:'', avatarFile: null})); }} className="text-destructive hover:text-destructive/80">
                    <X className="w-4 h-4 mr-1"/> Remover
                </Button>
              )}
            </div>
            <Input
                id="avatarUrl"
                name="avatar"
                value={formData.avatarFile ? '(Nova imagem selecionada)' : formData.avatar}
                onChange={handleChange}
                placeholder="Ou cole uma URL aqui"
                className="mt-2 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">Bio</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre você e seus serviços..."
                className="pl-10 bg-input border-border text-foreground min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleInternalSave} className="minecraft-button text-primary-foreground">
              Salvar Alterações
            </Button>
            <Button onClick={onCancel} variant="outline" className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/20">
              Cancelar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditProfileForm;
