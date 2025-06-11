
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Shovel as Pickaxe, Sword, Shield, Crown, Users, Star } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Pickaxe className="w-8 h-8 text-primary" />,
      title: "Construções Épicas",
      description: "Criamos construções incríveis para seu servidor"
    },
    {
      icon: <Sword className="w-8 h-8 text-primary" />,
      title: "Plugins Customizados",
      description: "Desenvolvimento de plugins únicos e personalizados"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Configuração de Servidor",
      description: "Setup completo e otimização de performance"
    },
    {
      icon: <Crown className="w-8 h-8 text-primary" />,
      title: "Ranks e Permissões",
      description: "Sistema de ranks profissional para seu servidor"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-6 floating-animation">
              MineCraft Services
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A plataforma definitiva para serviços profissionais de Minecraft. 
              Conecte-se com os melhores desenvolvedores e construtores da comunidade!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="minecraft-button text-primary-foreground px-8 py-4 text-lg">
                      Começar Agora
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary/10">
                      Ver Serviços
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="minecraft-button text-primary-foreground px-8 py-4 text-lg">
                      Ir para Dashboard
                    </Button>
                  </Link>
                  <Link to="/create-post">
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary/10">
                      Criar Serviço
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Serviços Profissionais
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos uma ampla gama de serviços para transformar seu servidor Minecraft
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="minecraft-card h-full pulse-glow">
                  <CardHeader className="text-center">
                    <div className="text-primary mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <Users className="w-12 h-12 mx-auto mb-4" />
                500+
              </div>
              <p className="text-xl text-muted-foreground">Desenvolvedores Ativos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <Star className="w-12 h-12 mx-auto mb-4" />
                1000+
              </div>
              <p className="text-xl text-muted-foreground">Projetos Concluídos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <Crown className="w-12 h-12 mx-auto mb-4" />
                98%
              </div>
              <p className="text-xl text-muted-foreground">Satisfação dos Clientes</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se à nossa comunidade e transforme suas ideias em realidade!
            </p>
            {!user && (
              <Link to="/register">
                <Button size="lg" className="minecraft-button text-primary-foreground px-12 py-4 text-lg">
                  Criar Conta Grátis
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
