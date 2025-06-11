
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Phone, UserPlus, Users2, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';


const SocialPlaceholder = () => {
  const { user } = useAuth();

  const showToast = (featureName) => {
    toast({
      title: `🚧 ${featureName} em Breve!`,
      description: "Esta funcionalidade social ainda não foi implementada. Estamos trabalhando nisso! Fique ligado para futuras atualizações após a integração com Supabase! 🚀",
      duration: 5000,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="minecraft-card text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Acesso Restrito</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground mb-6">
                Você precisa estar logado para acessar as funcionalidades sociais.
              </p>
              <Link to="/login">
                <Button className="minecraft-button text-primary-foreground">
                  Fazer Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="w-full max-w-3xl"
      >
        <Card className="minecraft-card shadow-2xl">
          <CardHeader className="text-center">
            <Construction className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse" />
            <CardTitle className="text-4xl font-bold text-gradient mb-3">
              Central Social em Construção!
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
              Estamos preparando um espaço incrível para você se conectar! 
              As funcionalidades abaixo serão ativadas após a integração com Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Sistema de Amigos", icon: <UserPlus size={20} />, featureKey: "friends" },
                { name: "Chat Privado", icon: <MessageSquare size={20} />, featureKey: "privateChat" },
                { name: "Chamadas (Voz/Vídeo)", icon: <Phone size={20} />, featureKey: "calls" },
                { name: "Criação de Grupos", icon: <Users2 size={20} />, featureKey: "groups" },
                { name: "Comunidades Personalizadas", icon: <Users size={20} />, featureKey: "customCommunities" },
              ].map((feature) => (
                <Button
                  key={feature.featureKey}
                  variant="outline"
                  className="w-full justify-start py-6 text-left border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 group"
                  onClick={() => showToast(feature.name)}
                  disabled
                >
                  <div className="flex items-center">
                    <span className="mr-4 p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
                      {feature.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-base">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">Em breve</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center pt-4">
              Para habilitar estas funcionalidades, a integração com Supabase é necessária.
              Se você já conectou o Supabase, me avise para começarmos a implementação!
            </p>
            <div className="text-center mt-6">
                <Link to="/profile">
                    <Button variant="ghost" className="text-primary hover:underline">
                        Voltar para o Perfil
                    </Button>
                </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SocialPlaceholder;
