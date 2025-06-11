import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Search, Users2, MessageSquare, ThumbsUp, Heart, Star, Send, X } from 'lucide-react';

const CommunityPostCard = ({ post, onLike, onFavorite, onComment }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };
  
  const isLiked = user && post.likes?.includes(user.id);
  const isFavorited = user && post.favorites?.includes(user.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="minecraft-card h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-3">
            <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full border border-primary/50" />
            <div>
              <CardTitle className="text-foreground text-lg">{post.authorName}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleString('pt-BR')}
              </CardDescription>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-primary line-clamp-2">{post.title}</h2>
        </CardHeader>
        <CardContent className="flex-grow">
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-muted">
              <img-replace src={post.imageUrls[0]} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-4 whitespace-pre-wrap">{post.content}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary">{tag}</Badge>)}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-border/20 pt-4 flex flex-col items-start">
          <div className="flex justify-between w-full items-center mb-3">
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" onClick={() => onLike(post.id)} className={`text-muted-foreground hover:text-primary ${isLiked ? 'text-primary' : ''}`}>
                <ThumbsUp className={`w-4 h-4 mr-1 ${isLiked ? 'fill-primary' : ''}`} /> {post.likes?.length || 0}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="text-muted-foreground hover:text-primary">
                <MessageSquare className="w-4 h-4 mr-1" /> {post.comments?.length || 0}
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onFavorite(post.id)} className={`text-muted-foreground hover:text-destructive ${isFavorited ? 'text-destructive' : ''}`}>
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-destructive' : ''}`} />
            </Button>
          </div>
          {showComments && (
            <div className="w-full mt-2 space-y-3">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map(comment => (
                  <div key={comment.id} className="text-xs p-2 rounded-md bg-background/30">
                    <div className="flex items-center space-x-2 mb-1">
                       <img src={comment.authorAvatar} alt={comment.authorName} className="w-5 h-5 rounded-full"/>
                       <strong className="text-foreground">{comment.authorName}</strong>
                    </div>
                    <p className="text-muted-foreground pl-1">{comment.text}</p>
                  </div>
                ))
              ) : <p className="text-xs text-muted-foreground italic">Nenhum comentário ainda.</p>}
              {user && (
                <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
                  <Input 
                    type="text" 
                    placeholder="Escreva um comentário..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="text-xs h-8 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <Button type="submit" size="sm" className="minecraft-button text-primary-foreground text-xs h-8 px-3">
                    <Send className="w-3 h-3"/>
                  </Button>
                </form>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('minecraft_community_posts') || '[]');
    setPosts(storedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (searchTerm) {
      filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    setFilteredPosts(filtered);
  }, [posts, searchTerm]);

  const handleAction = (postId, actionType) => {
    if (!user) {
      toast({ title: "Login Necessário", description: "Você precisa estar logado para interagir.", variant: "destructive" });
      return false;
    }

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        let currentList = p[actionType] || [];
        if (currentList.includes(user.id)) {
          currentList = currentList.filter(id => id !== user.id); // Unlike/Unfavorite
        } else {
          currentList = [...currentList, user.id]; // Like/Favorite
        }
        return { ...p, [actionType]: currentList };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('minecraft_community_posts', JSON.stringify(updatedPosts));
    return true;
  };

  const handleLike = (postId) => {
     if(handleAction(postId, 'likes')) {
        const post = posts.find(p => p.id === postId);
        const isLiked = post.likes?.includes(user.id);
        toast({ title: isLiked ? "Post curtido!" : "Curtida removida." });
     }
  };

  const handleFavorite = (postId) => {
    if(handleAction(postId, 'favorites')) {
        const post = posts.find(p => p.id === postId);
        const isFavorited = post.favorites?.includes(user.id);
        toast({ title: isFavorited ? "Adicionado aos favoritos!" : "Removido dos favoritos." });
    }
  };
  
  const handleComment = (postId, text) => {
    if (!user) {
      toast({ title: "Login Necessário", description: "Você precisa estar logado para comentar.", variant: "destructive" });
      return;
    }
    const newComment = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.username,
      authorAvatar: user.avatar,
      text,
      createdAt: new Date().toISOString()
    };
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('minecraft_community_posts', JSON.stringify(updatedPosts));
    toast({ title: "Comentário adicionado!"});
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
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
                <Users2 className="w-10 h-10 mr-3 text-primary" /> Comunidade
              </h1>
              <p className="text-muted-foreground text-lg">
                Compartilhe seus projetos, ideias e interaja com outros jogadores!
              </p>
            </div>
            {user && (
              <Link to="/create-community-post">
                <Button className="minecraft-button text-primary-foreground mt-4 sm:mt-0">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Criar Nova Postagem
                </Button>
              </Link>
            )}
          </div>

          <Card className="minecraft-card mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar na comunidade (títulos, conteúdo, tags, autores)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {filteredPosts.length === 0 ? (
            <Card className="minecraft-card">
              <CardContent className="p-12 text-center">
                <Users2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ainda não há nada por aqui...
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhuma postagem encontrada com seu termo de busca.' : 'Seja o primeiro a compartilhar algo com a comunidade!'}
                </p>
                 {!user && !searchTerm && (
                  <Link to="/register" className="mt-4 inline-block">
                    <Button className="minecraft-button text-primary-foreground">
                      Crie uma conta para postar
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <CommunityPostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLike} 
                  onFavorite={handleFavorite}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Community;