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
import { PlusCircle, Briefcase, DollarSign, Users, Calendar, Image as ImageIconLucide, FileText, Lightbulb, Plus, Upload, X } from 'lucide-react';

const CreateRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'remunerado',
    budget: '',
    skills: '',
    deadline: '',
    referenceImages: [], // Armazena objetos { id, name, dataUrl }
    whatIsNeeded: ''
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
            referenceImages: [...prev.referenceImages, ...newImageObjects]
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
      referenceImages: prev.referenceImages.filter(image => image.id !== imageIdToRemove)
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
          description: "Você precisa estar logado para criar um pedido de serviço.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (formData.type === 'remunerado' && (!formData.budget || parseFloat(formData.budget) <= 0)) {
        toast({
          title: "Erro",
          description: "Para pedidos remunerados, por favor, insira um orçamento válido.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }


      const newRequest = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        budget: formData.type === 'remunerado' ? parseFloat(formData.budget) : null,
        skills: formData.skills,
        deadline: formData.deadline,
        referenceImages: formData.referenceImages.map(img => ({ name: img.name, dataUrl: img.dataUrl })),
        whatIsNeeded: formData.whatIsNeeded,
        requesterId: user.id,
        requesterName: user.username,
        requesterAvatar: user.avatar,
        createdAt: new Date().toISOString(),
        status: 'aberto'
      };

      const existingRequests = JSON.parse(localStorage.getItem('minecraft_service_requests') || '[]');
      existingRequests.push(newRequest);
      localStorage.setItem('minecraft_service_requests', JSON.stringify(existingRequests));

      toast({
        title: "Pedido criado com sucesso!",
        description: "Seu pedido de serviço foi publicado.",
      });

      navigate('/service-requests');
    } catch (error) {
      toast({
        title: "Erro ao criar pedido",
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
            <p className="text-foreground text-lg">Você precisa estar logado para criar um pedido de serviço.</p>
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
              Criar Pedido de Serviço
            </h1>
            <p className="text-muted-foreground text-lg">
              Descreva o serviço que você precisa e encontre o profissional ideal.
            </p>
          </div>

          <Card className="minecraft-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <PlusCircle className="w-6 h-6 mr-2 text-primary" />
                Novo Pedido de Serviço
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Preencha os detalhes do serviço que você está procurando.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">Nome do Serviço/Projeto</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Ex: Preciso de um construtor para um lobby de servidor"
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatIsNeeded" className="text-foreground">O que você precisa exatamente?</Label>
                   <div className="relative">
                    <Lightbulb className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="whatIsNeeded"
                      name="whatIsNeeded"
                      value={formData.whatIsNeeded}
                      onChange={handleChange}
                      placeholder="Detalhe o que você espera do profissional. Ex: Um lobby com tema medieval, capacidade para 50 jogadores, portais para minigames..."
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Descrição Detalhada</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Forneça mais detalhes sobre o projeto, estilo, referências, etc."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-foreground">Tipo de Pedido</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value, budget: value === 'voluntario' ? '' : formData.budget })}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground">
                        <SelectItem value="remunerado" className="focus:bg-accent focus:text-accent-foreground">Remunerado</SelectItem>
                        <SelectItem value="voluntario" className="focus:bg-accent focus:text-accent-foreground">Voluntário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.type === 'remunerado' && (
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-foreground">Orçamento (R$)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="budget"
                          name="budget"
                          type="number"
                          step="0.01"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="Ex: 150.00"
                          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                          required={formData.type === 'remunerado'}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-foreground">Habilidades Desejadas</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Ex: WorldEdit, VoxelSniper, Construção Detalhada"
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Separe as habilidades por vírgula.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-foreground">Prazo Estimado</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        placeholder="Ex: 1 semana, 15 dias, A combinar"
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Imagens de Referência</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {imagePreviews.map((previewUrl, index) => {
                      const imageObj = formData.referenceImages.find(img => img.dataUrl === previewUrl);
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
                      htmlFor="imageUploadRequest"
                      className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-muted-foreground/50 rounded-md cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Adicionar</span>
                      <Input id="imageUploadRequest" type="file" className="hidden" onChange={handleImageFileChange} accept="image/*" multiple />
                    </Label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="minecraft-button text-primary-foreground flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Publicando Pedido...' : 'Publicar Pedido'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)} 
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

export default CreateRequest;