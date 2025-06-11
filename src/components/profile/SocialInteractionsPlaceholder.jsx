
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Phone, UserPlus, Users2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SocialInteractionsPlaceholder = () => {
  const showToast = () => {
    toast({
      title: "🚧 Em Breve!",
      description: "Esta funcionalidade social ainda não foi implementada. Fique ligado para futuras atualizações após a integração com Supabase! 🚀",
      duration: 5000,
    });
  };

  return (
    <Card className="minecraft-card mb-8">
      <CardHeader>
        <CardTitle className="text-foreground">Interações Sociais</CardTitle>
        <CardDescription className="text-muted-foreground">
          Conecte-se com outros usuários. (Funcionalidades em desenvolvimento)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10" onClick={showToast} disabled>
            <UserPlus className="w-4 h-4 mr-2" /> Ver Amigos
          </Button>
          <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10" onClick={showToast} disabled>
            <MessageSquare className="w-4 h-4 mr-2" /> Abrir Chat Privado
          </Button>
          <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10" onClick={showToast} disabled>
            <Phone className="w-4 h-4 mr-2" /> Iniciar Chamada (Voz/Vídeo)
          </Button>
          <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10" onClick={showToast} disabled>
            <Users2 className="w-4 h-4 mr-2" /> Criar/Ver Grupos
          </Button>
           <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10" onClick={showToast} disabled>
            <Users className="w-4 h-4 mr-2" /> Criar/Ver Comunidades
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Estas funcionalidades requerem integração com Supabase.
        </p>
      </CardContent>
    </Card>
  );
};

export default SocialInteractionsPlaceholder;
