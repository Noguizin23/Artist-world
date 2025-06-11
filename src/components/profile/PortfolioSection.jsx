
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, ExternalLink, Upload, X, FileText } from 'lucide-react';

const PortfolioSection = ({ user, updateUser }) => {
  const [portfolioItem, setPortfolioItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    imageFile: null,
  });
  const [portfolioImagePreview, setPortfolioImagePreview] = useState('');

  const handlePortfolioChange = (e) => {
    setPortfolioItem({
      ...portfolioItem,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePortfolioImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioItem(prev => ({...prev, imageFile: file, imageUrl: reader.result }));
        setPortfolioImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPortfolioItem = () => {
    if (!portfolioItem.title || !portfolioItem.description) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: portfolioItem.title,
      description: portfolioItem.description,
      imageUrl: portfolioItem.imageUrl,
      projectUrl: portfolioItem.projectUrl,
      createdAt: new Date().toISOString()
    };

    const updatedPortfolio = [...(user.portfolio || []), newItem];
    updateUser({ portfolio: updatedPortfolio });

    setPortfolioItem({
      title: '',
      description: '',
      imageUrl: '',
      projectUrl: '',
      imageFile: null,
    });
    setPortfolioImagePreview('');

    toast({
      title: "Item adicionado!",
      description: "Novo item foi adicionado ao seu portfólio.",
    });
  };

  const handleRemovePortfolioItem = (itemId) => {
    const updatedPortfolio = user.portfolio.filter(item => item.id !== itemId);
    updateUser({ portfolio: updatedPortfolio });
    
    toast({
      title: "Item removido!",
      description: "O item foi removido do seu portfólio.",
    });
  };

  return (
    <Card className="minecraft-card">
      <CardHeader>
        <CardTitle className="text-foreground">Portfólio</CardTitle>
        <CardDescription className="text-muted-foreground">
          Mostre seus melhores trabalhos e projetos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-6 bg-background/50 rounded-lg border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-4">Adicionar Novo Item ao Portfólio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="portfolioTitle" className="text-foreground">Título</Label>
              <Input
                id="portfolioTitle"
                name="title"
                value={portfolioItem.title}
                onChange={handlePortfolioChange}
                placeholder="Nome do projeto"
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Imagem do Projeto</Label>
              <div className="flex items-center gap-2">
                  {portfolioImagePreview && (
                      <img src={portfolioImagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-md border border-border"/>
                  )}
                  <Label htmlFor="portfolioItemImageUpload" className="cursor-pointer bg-input border border-border text-foreground rounded-md px-3 py-1.5 text-xs hover:bg-accent flex items-center gap-1">
                      <Upload className="w-3 h-3"/> {portfolioImagePreview ? 'Alterar' : 'Upload'}
                  </Label>
                  <Input id="portfolioItemImageUpload" type="file" className="hidden" onChange={handlePortfolioImageFileChange} accept="image/*" />
                   {portfolioImagePreview && (
                      <Button variant="ghost" size="xs" onClick={() => { setPortfolioImagePreview(''); setPortfolioItem(prev => ({...prev, imageUrl:'', imageFile: null})); }} className="text-destructive hover:text-destructive/80 text-xs px-1 py-0.5 h-auto">
                          <X className="w-3 h-3"/>
                      </Button>
                  )}
              </div>
               <Input
                  name="imageUrl"
                  value={portfolioItem.imageFile ? '(Nova imagem selecionada)' : portfolioItem.imageUrl}
                  onChange={handlePortfolioChange}
                  placeholder="Ou cole uma URL de imagem aqui"
                  className="mt-1 bg-input border-border text-foreground text-xs placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="portfolioDescription" className="text-foreground">Descrição</Label>
            <Textarea
              id="portfolioDescription"
              name="description"
              value={portfolioItem.description}
              onChange={handlePortfolioChange}
              placeholder="Descreva o projeto..."
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="portfolioProjectUrl" className="text-foreground">URL do Projeto (opcional)</Label>
            <Input
              id="portfolioProjectUrl"
              name="projectUrl"
              value={portfolioItem.projectUrl}
              onChange={handlePortfolioChange}
              placeholder="https://exemplo.com/projeto"
              className="bg-input border-border text-foreground"
            />
          </div>
          <Button onClick={handleAddPortfolioItem} className="minecraft-button text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </Button>
        </div>

        {user.portfolio && user.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.portfolio.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="minecraft-card h-full">
                  {item.imageUrl && (
                    <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.description}</p>
                    <div className="flex justify-between items-center">
                      {item.projectUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/50 text-primary hover:bg-primary/10"
                          onClick={() => window.open(item.projectUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Ver Projeto
                        </Button>
                      )}
                       <Button
                        size="icon"
                        variant="outline"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemovePortfolioItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum item no portfólio
            </h3>
            <p className="text-muted-foreground">
              Adicione seus projetos para mostrar seu trabalho
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioSection;
