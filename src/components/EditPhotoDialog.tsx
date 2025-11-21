import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Upload, X, Camera } from "lucide-react";
import { toast } from "sonner";

interface EditPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhoto?: string;
  employeeName: string;
  onSave: (photo: string) => void;
}

export const EditPhotoDialog = ({
  open,
  onOpenChange,
  currentPhoto,
  employeeName,
  onSave,
}: EditPhotoDialogProps) => {
  const [photoPreview, setPhotoPreview] = useState<string>(currentPhoto || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Photo must be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    onSave(photoPreview);
    onOpenChange(false);
    toast.success("Photo updated");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-[400px] border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Camera className="w-5 h-5 text-accent" />
            Edit Photo - {employeeName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex flex-col items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-accent/20"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors accent-glow"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <Upload className="w-12 h-12 text-accent" />
                </div>
              )}
              
              <div className="w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload-edit"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-input w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Max 2MB, JPG/PNG/WEBP
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setPhotoPreview(currentPhoto || "");
              }}
              className="glass-input"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Save Photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
