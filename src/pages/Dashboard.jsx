
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Users, Star, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });

  useEffect(() => {
    if (user) {
      const allPosts = JSON.parse(localStorage.getItem('minecraft_posts') || '[]');
      const userPosts = allPosts.filter(post => post.authorId === user.id);
      setPosts(userPosts);
      
      setStats({
        totalPosts: userPosts.length,
        totalViews: userPosts.reduce((sum, post) => sum + (post.views || 0), 0),
        totalLikes: userPosts.reduce((sum, post) => sum + (post.likes || 0), 0)
      });
    }
  }, [user]);

  const handleDeletePost = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem('minecraft_posts') || '[]');
    const updatedPosts = allPosts.filter(post => post.id !== postId);
    localStorage.setItem('minecraft_posts', JSON.stringify(updatedPosts));
    
    const userPosts = updatedPosts.filter(post => post.authorId === user.id);
    setPosts(userPosts);
    
    toast({
      title: "Post excluído!",
      description: "O post foi removido com sucesso.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="minecraft-card">
          <CardContent className="p-8 text-center">
            <p className="text-foreground text-lg">Você precisa estar logado para acessar o dashboard.</p>
            <Link to="/login">
              <Button className="minecraft-button mt-4 text-primary-foreground">Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Bem-vindo, {user.username}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Gerencie seus serviços e acompanhe seu desempenho
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="minecraft-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Posts
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalPosts}</div>
              </CardContent>
            </Card>

            <Card className="minecraft-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Visualizações
                </CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalViews}</div>
              </CardContent>
            </Card>

            <Card className="minecraft-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Curtidas
                </CardTitle>
                <Star className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalLikes}</div>
              </CardContent>
            </Card>
          </div>

          {/* Posts Section */}
          <Card className="minecraft-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-foreground">Meus Posts</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Gerencie seus serviços e posts
                  </CardDescription>
                </div>
                <Link to="/create-post">
                  <Button className="minecraft-button text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Post
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Nenhum post ainda
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Comece criando seu primeiro post de serviço
                  </p>
                  <Link to="/create-post">
                    <Button className="minecraft-button text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Post
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="minecraft-card h-full">
                        <CardHeader>
                          <CardTitle className="text-foreground text-lg line-clamp-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {post.category}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {post.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.views || 0}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1" />
                              {post.likes || 0}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
                              onClick={() => toast({
                                title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
                              })}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-destructive/50 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
