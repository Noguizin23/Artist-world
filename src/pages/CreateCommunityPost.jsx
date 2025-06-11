import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Edit3, Image as ImageIconLucide, Tag, Plus, X, Upload } from 'lucide-react';

const CreateCommunityPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [], // Armazena objetos { id, name, dataUrl }
    tags: '', 
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImageObjects = [];
    const newPreviews = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
          name: file.name,
          dataUrl: reader.result 
        };
        newImageObjects.push(newImage);
        newPreviews.push(reader.result);

        if (newImageObjects.length === files.length) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImageObjects]
          }));
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = null;
  };

  const removeImage = (imageIdToRemove, previewUrlToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image.id !== imageIdToRemove)
    }));
    setImagePreviews(prev => prev.filter(url => url !== previewUrlToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: "Campos obrigatórios", description: "Título e conteúdo não podem estar vazios.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      if (!user) {
        toast({ title: "Erro", description: "Você precisa estar logado para criar uma postagem.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const newPost = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        images: formData.images.map(img => ({ name: img.name, dataUrl: img.dataUrl })),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        authorId: user.id,
        authorName: user.username,
        authorAvatar: user.avatar,
        likes: [],
        favorites: [],
        comments: [],
        createdAt: new Date().toISOString()
      };

      const existingPosts = JSON.parse(localStorage.getItem('minecraft_community_posts') || '[]');
      existingPosts.push(newPost);
      localStorage.setItem('minecraft_community_posts', JSON.stringify(existingPosts));

      toast({ title: "Postagem criada!", description: "Sua postagem foi compartilhada com a comunidade." });
      navigate('/community');
    } catch (error) {
      toast({ title: "Erro ao criar postagem", description: "Ocorreu um erro. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="minecraft-card">
          <CardContent className="p-8 text-center">
            <p className="text-foreground text-lg">Você precisa estar logado para criar uma postagem na comunidade.</p>
            <Link to="/login" className="mt-4 inline-block">
                <Button className="minecraft-button text-primary-foreground">Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Criar Nova Postagem</h1>
            <p className="text-muted-foreground text-lg">
              Compartilhe seus projetos, ideias, ou qualquer coisa legal com a comunidade!
            </p>
          </div>

          <Card className="minecraft-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Edit3 className="w-6 h-6 mr-2 text-primary" />
                Detalhes da Postagem
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Preencha as informações abaixo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">Título da Postagem</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Um título criativo para sua postagem"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-foreground">Conteúdo</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Escreva sobre seu projeto, ideia, ou o que quiser compartilhar..."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[150px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-foreground">Imagens</Label>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {imagePreviews.map((previewUrl, index) => {
                       const imageObj = formData.images.find(img => img.dataUrl === previewUrl);
                       return (
                        <div key={imageObj?.id || index} className="relative group aspect-square border border-border rounded-md overflow-hidden">
                          <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImage(imageObj.id, previewUrl)}
                            className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                       );
                    })}
                    <Label
                      htmlFor="imageUploadCommunity"
                      className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-muted-foreground/50 rounded-md cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Adicionar</span>
                      <Input id="imageUploadCommunity" type="file" className="hidden" onChange={handleImageFileChange} accept="image/*" multiple />
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-foreground">Tags (separadas por vírgula)</Label>
                   <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Ex: construção, redstone, ideia, servidor"
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                   </div>
                  <p className="text-xs text-muted-foreground">Tags ajudam outros a encontrarem sua postagem.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="minecraft-button text-primary-foreground flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Publicando...' : 'Publicar na Comunidade'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/community')}
                    className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/20"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCommunityPost;