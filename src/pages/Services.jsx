
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Eye, Star, User, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Services = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'construcao', label: 'Construção' },
    { value: 'plugin', label: 'Plugin' },
    { value: 'configuracao', label: 'Configuração' },
    { value: 'design', label: 'Design' },
    { value: 'outros', label: 'Outros' }
  ];

  useEffect(() => {
    const allPosts = JSON.parse(localStorage.getItem('minecraft_posts') || '[]');
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  const handleLike = (postId) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para curtir posts.",
        variant: "destructive",
      });
      return;
    }

    const allPosts = JSON.parse(localStorage.getItem('minecraft_posts') || '[]');
    const updatedPosts = allPosts.map(post => {
      if (post.id === postId) {
        const likes = post.likes || 0;
        return { ...post, likes: likes + 1 };
      }
      return post;
    });

    localStorage.setItem('minecraft_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);

    toast({
      title: "Post curtido!",
      description: "Obrigado pelo seu feedback.",
    });
  };

  const handleView = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem('minecraft_posts') || '[]');
    const updatedPosts = allPosts.map(post => {
      if (post.id === postId) {
        const views = post.views || 0;
        return { ...post, views: views + 1 };
      }
      return post;
    });

    localStorage.setItem('minecraft_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Serviços de Minecraft
            </h1>
            <p className="text-muted-foreground text-lg">
              Descubra os melhores serviços da comunidade
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="minecraft-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar serviços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                      className={
                        selectedCategory === category.value
                          ? "minecraft-button text-primary-foreground"
                          : "border-primary/50 text-primary hover:bg-primary/10"
                      }
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          {filteredPosts.length === 0 ? (
            <Card className="minecraft-card">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum serviço encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Tente ajustar seus filtros de busca'
                    : 'Ainda não há serviços publicados'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="minecraft-card h-full cursor-pointer" onClick={() => handleView(post.id)}>
                    {post.images && post.images.length > 0 && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                          {categories.find(cat => cat.value === post.category)?.label || post.category}
                        </Badge>
                        <span className="text-2xl font-bold text-primary">
                          R$ {post.price}
                        </span>
                      </div>
                      <CardTitle className="text-foreground text-lg line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-3">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.authorName}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views || 0}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {post.likes || 0}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                          className="minecraft-button text-primary-foreground"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Curtir
                        </Button>
                      </div>
                    </CardContent>
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

export default Services;
