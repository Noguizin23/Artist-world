import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Search, User, Calendar, DollarSign, Users, MessageSquare, Briefcase, PlusCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const ServiceRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all | remunerado | voluntario

  const requestTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'remunerado', label: 'Remunerado' },
    { value: 'voluntario', label: 'Voluntário' }
  ];

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem('minecraft_service_requests') || '[]');
    setRequests(allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by newest
    setFilteredRequests(allRequests);
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (selectedType !== 'all') {
      filtered = filtered.filter(request => request.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.skills && request.skills.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredRequests(filtered);
  }, [requests, searchTerm, selectedType]);

  const handleContactRequester = (requesterName) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para contatar o solicitante.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: `Contatar ${requesterName}`,
      description: "🚧 Esta funcionalidade (chat/mensagem) ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'aberto':
        return 'bg-green-500/20 text-green-400';
      case 'em_progresso':
        return 'bg-blue-500/20 text-blue-400';
      case 'concluido':
        return 'bg-purple-500/20 text-purple-400';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };


  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Pedidos de Serviço
              </h1>
              <p className="text-muted-foreground text-lg">
                Encontre projetos e oportunidades na comunidade.
              </p>
            </div>
            {user && (
               <Link to="/create-request">
                <Button className="minecraft-button text-primary-foreground mt-4 sm:mt-0">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Criar Novo Pedido
                </Button>
              </Link>
            )}
          </div>

          <Card className="minecraft-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, descrição, habilidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {requestTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={selectedType === type.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.value)}
                      className={
                        selectedType === type.value
                          ? "minecraft-button text-primary-foreground"
                          : "border-primary/50 text-primary hover:bg-primary/10"
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredRequests.length === 0 ? (
            <Card className="minecraft-card">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum pedido de serviço encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedType !== 'all'
                    ? 'Tente ajustar seus filtros ou crie um novo pedido!'
                    : 'Ainda não há pedidos de serviço publicados. Que tal criar um?'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="minecraft-card h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className={request.type === 'remunerado' ? 'bg-primary/30 text-primary' : 'bg-secondary/30 text-secondary'}>
                          {request.type === 'remunerado' ? 'Remunerado' : 'Voluntário'}
                        </Badge>
                        {request.type === 'remunerado' && request.budget && (
                          <span className="text-lg font-bold text-primary">
                            R$ {request.budget.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-foreground text-xl line-clamp-2">
                        {request.title}
                      </CardTitle>
                       <Badge variant="outline" className={`${getStatusBadgeColor(request.status)} capitalize`}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-3">
                        <strong>Necessidade:</strong> {request.whatIsNeeded}
                      </p>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                        {request.description}
                      </p>
                      {request.skills && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-foreground mb-1">Habilidades:</h4>
                          <div className="flex flex-wrap gap-1">
                            {request.skills.split(',').map(skill => skill.trim()).filter(Boolean).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs border-primary/40 text-primary/90">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {request.deadline && (
                        <p className="text-xs text-muted-foreground mb-1">
                          <Calendar className="w-3 h-3 mr-1 inline-block" />
                          Prazo: {request.deadline}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="border-t border-border/20 pt-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <img src={request.requesterAvatar} alt={request.requesterName} className="w-6 h-6 rounded-full mr-2 border border-primary/50"/>
                          <span>{request.requesterName}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleContactRequester(request.requesterName)}
                          className="minecraft-button text-primary-foreground text-xs"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Contatar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceRequests;