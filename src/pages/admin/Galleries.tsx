import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  Upload,
  GripVertical,
  X
} from 'lucide-react';

interface Gallery {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

interface GalleryImage {
  id: string;
  gallery_id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
}

const gallerySchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
});

export default function AdminGalleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (selectedGallery) {
      fetchGalleryImages(selectedGallery.id);
    }
  }, [selectedGallery]);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setGalleries(data || []);
      
      if (data && data.length > 0 && !selectedGallery) {
        setSelectedGallery(data[0]);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      toast.error('Erro ao carregar galerias');
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryImages = async (galleryId: string) => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Erro ao carregar imagens');
    }
  };

  const handleSubmitGallery = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = gallerySchema.parse(formData);

      if (editingGallery) {
        const { error } = await supabase
          .from('galleries')
          .update({
            name: validatedData.name,
            description: validatedData.description || null,
          })
          .eq('id', editingGallery.id);

        if (error) throw error;
        toast.success('Galeria atualizada');
      } else {
        const { error } = await supabase
          .from('galleries')
          .insert([{
            name: validatedData.name,
            description: validatedData.description || null,
            display_order: galleries.length,
          }]);

        if (error) throw error;
        toast.success('Galeria criada');
      }

      setDialogOpen(false);
      resetForm();
      fetchGalleries();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Error saving gallery:', error);
        toast.error('Erro ao salvar galeria');
      }
    }
  };

  const handleDeleteGallery = async (gallery: Gallery) => {
    if (!confirm(`Tem certeza que deseja excluir a galeria "${gallery.name}"? Todas as imagens serão removidas.`)) {
      return;
    }

    try {
      // Delete images from storage first
      const { data: images } = await supabase
        .from('gallery_images')
        .select('url')
        .eq('gallery_id', gallery.id);

      if (images) {
        for (const image of images) {
          const path = image.url.split('/').pop();
          if (path) {
            await supabase.storage.from('gallery-images').remove([path]);
          }
        }
      }

      const { error } = await supabase
        .from('galleries')
        .delete()
        .eq('id', gallery.id);

      if (error) throw error;
      
      toast.success('Galeria excluída');
      setSelectedGallery(null);
      fetchGalleries();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast.error('Erro ao excluir galeria');
    }
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedGallery || !e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        // Validate file
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} não é uma imagem`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} excede 5MB`);
          continue;
        }

        // Upload to storage
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName);

        // Save to database
        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert([{
            gallery_id: selectedGallery.id,
            url: urlData.publicUrl,
            alt_text: file.name,
            display_order: galleryImages.length,
          }]);

        if (dbError) throw dbError;
      }

      toast.success('Imagens enviadas');
      fetchGalleryImages(selectedGallery.id);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Erro ao enviar imagens');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm('Excluir esta imagem?')) return;

    try {
      // Delete from storage
      const path = image.url.split('/').pop();
      if (path) {
        await supabase.storage.from('gallery-images').remove([path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;
      
      toast.success('Imagem excluída');
      if (selectedGallery) {
        fetchGalleryImages(selectedGallery.id);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Erro ao excluir imagem');
    }
  };

  const updateImageOrder = async (imageId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ display_order: newOrder })
        .eq('id', imageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating image order:', error);
    }
  };

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= galleryImages.length) return;

    const newImages = [...galleryImages];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];

    setGalleryImages(newImages);

    // Update orders in database
    await updateImageOrder(newImages[index].id, index);
    await updateImageOrder(newImages[newIndex].id, newIndex);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingGallery(null);
  };

  const openEditDialog = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      name: gallery.name,
      description: gallery.description || '',
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Galerias</h1>
          <p className="text-muted-foreground">Gerencie as galerias de imagens do site</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Galeria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGallery ? 'Editar Galeria' : 'Nova Galeria'}</DialogTitle>
              <DialogDescription>
                Preencha os dados da galeria
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitGallery} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="submit">
                  {editingGallery ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Galleries List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Galerias</CardTitle>
            <CardDescription>{galleries.length} galerias</CardDescription>
          </CardHeader>
          <CardContent>
            {galleries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma galeria criada
              </p>
            ) : (
              <div className="space-y-2">
                {galleries.map((gallery) => (
                  <div
                    key={gallery.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedGallery?.id === gallery.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedGallery(gallery)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{gallery.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(gallery);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGallery(gallery);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gallery Images */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {selectedGallery ? selectedGallery.name : 'Selecione uma galeria'}
                </CardTitle>
                <CardDescription>
                  {selectedGallery ? `${galleryImages.length} imagens` : 'Escolha uma galeria para gerenciar as imagens'}
                </CardDescription>
              </div>
              {selectedGallery && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImages}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Enviando...' : 'Upload'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedGallery ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4" />
                <p>Selecione uma galeria para ver as imagens</p>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4" />
                <p>Nenhuma imagem nesta galeria</p>
                <p className="text-sm">Clique em Upload para adicionar imagens</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative group aspect-square rounded-lg overflow-hidden border"
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text || ''}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteImage(image)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
