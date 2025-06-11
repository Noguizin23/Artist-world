
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Home, Briefcase, Plus, Users2, MessagesSquare, Heart, MessageCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/60528a60-399b-4045-bc8c-643e2ce966a1/0bf787c20b1bb68684235d92f936c05e.png";

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado!",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/');
  };

  const handleSocialClick = () => {
    if (!user) {
       toast({
        title: "Login Necessário",
        description: "Você precisa estar logado para acessar as funcionalidades sociais.",
        variant: "destructive",
      });
      return;
    }
    navigate('/social');
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-background/70 backdrop-blur-lg border-b border-primary/30 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <img src={logoUrl} alt="Site Logo" className="h-8 md:h-10 object-contain" />
            </motion.div>
          </Link>

          <div className="flex items-center space-x-1 md:space-x-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary px-2 md:px-3">
                    <Home className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary px-2 md:px-3">
                    <Briefcase className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Serviços</span>
                  </Button>
                </Link>
                <Link to="/service-requests">
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary px-2 md:px-3">
                    <MessagesSquare className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Pedidos</span>
                  </Button>
                </Link>
                <Link to="/community">
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary px-2 md:px-3">
                    <Users2 className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Comunidade</span>
                  </Button>
                </Link>
                 <Button variant="ghost" size="sm" className="text-foreground hover:text-primary px-2 md:px-3" onClick={handleSocialClick}>
                    <MessageCircle className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Social</span>
                  </Button>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary px-2 md:px-3">
                    <User className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Perfil</span>
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  size="sm" 
                  className="text-foreground hover:text-destructive px-2 md:px-3"
                >
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Sair</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/community">
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary px-2 md:px-3">
                    <Users2 className="w-4 h-4 md:mr-2" />
                     <span className="hidden md:inline">Comunidade</span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary px-2 md:px-3">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="minecraft-button text-primary-foreground px-3 md:px-4">
                    Registrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
