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
  X,
  Home,
  Globe,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

const HOUSES = [
  { id: 'casa-101', label: 'Casa 101' },
  { id: 'casa-102', label: 'Casa 102' },
  { id: 'casa-201', label: 'Casa 201' },
  { id: 'casa-202', label: 'Casa 202' },
];

interface Gallery {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  house_id: string | null;
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creatingHouse, setCreatingHouse] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => { fetchGalleries(); }, []);

  useEffect(() => {
    if (selectedGallery) fetchGalleryImages(selectedGallery.id);
    else setGalleryImages([]);
  }, [selectedGallery]);

  const fetchGalleries = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setGalleries(data || []);
    } catch (error: any) {
      console.error('Error fetching galleries:', error);
      setFetchError(error?.message || 'Erro ao carregar galerias');
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

  // Create a gallery for a specific house automatically
  const createHouseGallery = async (house: typeof HOUSES[0]) => {
    setCreatingHouse(house.id);
    try {
      const { data, error } = await supabase
        .from('galleries')
        .insert([{
          name: `Galeria - ${house.label}`,
          description: `Fotos da ${house.label}`,
          display_order: galleries.length,
          house_id: house.id,
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success(`Galeria da ${house.label} criada!`);
      await fetchGalleries();
      if (data) setSelectedGallery(data);
    } catch (error) {
      console.error('Error creating house gallery:', error);
      toast.error('Erro ao criar galeria da casa');
    } finally {
      setCreatingHouse(null);
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
        const { data, error } = await supabase
          .from('galleries')
          .insert([{
            name: validatedData.name,
            description: validatedData.description || null,
            display_order: galleries.length,
            house_id: null,
          }])
          .select()
          .single();

        if (error) throw error;
        toast.success('Galeria criada');
        if (data) {
          await fetchGalleries();
          setSelectedGallery(data);
        }
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
    if (!confirm(`Excluir a galeria "${gallery.name}"? Todas as imagens serão removidas.`)) return;

    try {
      const { data: images } = await supabase
        .from('gallery_images')
        .select('url')
        .eq('gallery_id', gallery.id);

      if (images) {
        for (const image of images) {
          const path = image.url.split('/storage/v1/object/public/galeria/').pop();
          if (path) await supabase.storage.from('galeria').remove([path]);
        }
      }

      const { error } = await supabase.from('galleries').delete().eq('id', gallery.id);
      if (error) throw error;

      toast.success('Galeria excluída');
      if (selectedGallery?.id === gallery.id) setSelectedGallery(null);
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
    let successCount = 0;

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} não é uma imagem`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} excede 5MB`);
          continue;
        }

        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${selectedGallery.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('galeria')
          .upload(fileName, file);

        if (uploadError) { toast.error(`Erro ao enviar ${file.name}`); continue; }

        const { data: urlData } = supabase.storage.from('galeria').getPublicUrl(fileName);

        const { error: dbError } = await supabase.from('gallery_images').insert([{
          gallery_id: selectedGallery.id,
          url: urlData.publicUrl,
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          display_order: galleryImages.length + successCount,
        }]);

        if (dbError) { toast.error(`Erro ao salvar ${file.name}`); continue; }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`${successCount} imagem${successCount > 1 ? 'ns' : ''} enviada${successCount > 1 ? 's' : ''}`);
        fetchGalleryImages(selectedGallery.id);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Erro ao enviar imagens');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm('Excluir esta imagem?')) return;

    try {
      const path = image.url.split('/storage/v1/object/public/galeria/').pop();
      if (path) await supabase.storage.from('galeria').remove([path]);

      const { error } = await supabase.from('gallery_images').delete().eq('id', image.id);
      if (error) throw error;

      toast.success('Imagem excluída');
      if (selectedGallery) fetchGalleryImages(selectedGallery.id);
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Erro ao excluir imagem');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingGallery(null);
  };

  const openEditDialog = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({ name: gallery.name, description: gallery.description || '' });
    setDialogOpen(true);
  };

  // Split galleries: house galleries vs roteiro galleries vs site galleries
  const houseGalleriesMap = Object.fromEntries(
    galleries.filter(g => g.house_id).map(g => [g.house_id!, g])
  );
  const roteiroGalleries = galleries
    .filter(g => !g.house_id && g.name.startsWith('roteiro-dia-'))
    .sort((a, b) => {
      const numA = parseInt(a.name.replace('roteiro-dia-', ''), 10);
      const numB = parseInt(b.name.replace('roteiro-dia-', ''), 10);
      return numA - numB;
    });
  const siteGalleries = galleries.filter(g => !g.house_id && !g.name.startsWith('roteiro-dia-'));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <p className="text-destructive font-medium">Erro ao carregar galerias</p>
        <p className="text-muted-foreground text-sm max-w-md">{fetchError}</p>
        <button onClick={fetchGalleries} className="text-sm underline text-primary">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Galerias</h1>
          <p className="text-muted-foreground">Gerencie as imagens das casas e do site</p>
        </div>

        {/* Dialog para galerias do site */}
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nova Galeria do Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGallery ? 'Editar Galeria' : 'Nova Galeria do Site'}</DialogTitle>
              <DialogDescription>Galeria exibida nas seções do site</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitGallery} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Galeria Principal"
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
                <Button type="submit">{editingGallery ? 'Atualizar' : 'Criar'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left panel: gallery list */}
        <div className="lg:col-span-1 space-y-4">

          {/* House galleries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                Galerias das Casas
              </CardTitle>
              <CardDescription>Uma galeria por acomodação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {HOUSES.map((house) => {
                const gallery = houseGalleriesMap[house.id];
                const isSelected = selectedGallery?.id === gallery?.id;

                return gallery ? (
                  <div
                    key={house.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedGallery(gallery)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="font-medium text-sm">{house.label}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); openEditDialog(gallery); }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); handleDeleteGallery(gallery); }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={house.id}
                    className="p-3 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                      <span className="text-sm text-muted-foreground">{house.label}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      disabled={creatingHouse === house.id}
                      onClick={() => createHouseGallery(house)}
                    >
                      {creatingHouse === house.id ? '...' : 'Criar'}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Roteiro galleries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Fotos do Roteiro
              </CardTitle>
              <CardDescription>Uma foto por dia do roteiro principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {roteiroGalleries.map((gallery) => {
                const dayNum = parseInt(gallery.name.replace('roteiro-dia-', ''), 10);
                const isSelected = selectedGallery?.id === gallery.id;
                return (
                  <div
                    key={gallery.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedGallery(gallery)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">
                          {dayNum}
                        </span>
                        <span className="font-medium text-sm truncate">{gallery.description || gallery.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Site galleries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Galerias do Site
              </CardTitle>
              <CardDescription>Seções de imagens do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {siteGalleries.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-2">
                  Nenhuma galeria do site
                </p>
              ) : (
                siteGalleries.map((gallery) => {
                  const isSelected = selectedGallery?.id === gallery.id;
                  return (
                    <div
                      key={gallery.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedGallery(gallery)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium text-sm truncate">{gallery.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); openEditDialog(gallery); }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); handleDeleteGallery(gallery); }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right panel: image management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {selectedGallery ? selectedGallery.name : 'Selecione uma galeria'}
                </CardTitle>
                <CardDescription>
                  {selectedGallery
                    ? `${galleryImages.length} imagem${galleryImages.length !== 1 ? 'ns' : ''}`
                    : 'Escolha uma galeria na lista ao lado'}
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
                  <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Enviando...' : 'Upload'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedGallery ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
                <p>Selecione uma galeria para gerenciar as imagens</p>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Upload className="h-12 w-12 mb-4 opacity-30" />
                <p className="font-medium">Nenhuma imagem ainda</p>
                <p className="text-sm mt-1">Clique em Upload para adicionar fotos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text || ''}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleDeleteImage(image)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {image.alt_text && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.alt_text}
                      </div>
                    )}
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
