import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Plus, Image as ImageIconLucide, DollarSign, FileText, Upload, X } from 'lucide-react';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    images: [], // Agora armazena objetos { id, name, dataUrl, file? }
    deliveryTime: '',
    requirements: ''
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    { value: 'construcao', label: 'Construção' },
    { value: 'plugin', label: 'Plugin' },
    { value: 'configuracao', label: 'Configuração' },
    { value: 'design', label: 'Design' },
    { value: 'outros', label: 'Outros' }
  ];

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
    e.target.value = null; // Reset file input
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
    setLoading(true);

    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar um post.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const newPost = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        images: formData.images.map(img => ({ name: img.name, dataUrl: img.dataUrl })), // Salva apenas name e dataUrl
        deliveryTime: formData.deliveryTime,
        requirements: formData.requirements,
        authorId: user.id,
        authorName: user.username,
        authorAvatar: user.avatar,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString()
      };

      const existingPosts = JSON.parse(localStorage.getItem('minecraft_posts') || '[]');
      existingPosts.push(newPost);
      localStorage.setItem('minecraft_posts', JSON.stringify(existingPosts));

      toast({
        title: "Post criado com sucesso!",
        description: "Seu serviço foi publicado e está disponível para a comunidade.",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro ao criar post",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="minecraft-card">
          <CardContent className="p-8 text-center">
            <p className="text-foreground text-lg">Você precisa estar logado para criar um post.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Criar Novo Serviço
            </h1>
            <p className="text-muted-foreground text-lg">
              Compartilhe seus serviços com a comunidade
            </p>
          </div>

          <Card className="minecraft-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Plus className="w-6 h-6 mr-2 text-primary" />
                Novo Post de Serviço
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Preencha as informações do seu serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">Título do Serviço</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Construção de Castelo Medieval"
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="focus:bg-accent focus:text-accent-foreground">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva detalhadamente seu serviço..."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground">Preço (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime" className="text-foreground">Tempo de Entrega</Label>
                    <Input
                      id="deliveryTime"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      placeholder="Ex: 3-5 dias"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Imagens do Projeto</Label>
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
                      htmlFor="imageUpload"
                      className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-muted-foreground/50 rounded-md cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Adicionar</span>
                      <Input id="imageUpload" type="file" className="hidden" onChange={handleImageFileChange} accept="image/*" multiple />
                    </Label>
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-foreground">Requisitos</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="O que você precisa do cliente para realizar o serviço..."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="minecraft-button text-primary-foreground flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Criando...' : 'Publicar Serviço'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
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

export default CreatePost;