import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Upload, X } from "lucide-react";
import { Employee } from "./DirectoryCard";
import { toast } from "sonner";

interface AddEmployeeDialogProps {
  onAdd: (employee: Omit<Employee, "id">) => void;
}

export const AddEmployeeDialog = ({ onAdd }: AddEmployeeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    telephone: "",
    ext: "",
    fax: "",
    email: "",
    cellPhone: "",
    homePhone: "",
    jobTitle: "",
    branch: "",
    photo: "",
  });

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
        setFormData({ ...formData, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setFormData({ ...formData, photo: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAdd(formData);
      setFormData({
        name: "",
        telephone: "",
        ext: "",
        fax: "",
        email: "",
        cellPhone: "",
        homePhone: "",
        jobTitle: "",
        branch: "",
        photo: "",
      });
      setPhotoPreview("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground accent-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card sm:max-w-[500px] border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-accent/20"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-accent" />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
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
                <p className="text-xs text-muted-foreground mt-1">
                  Max 2MB, JPG/PNG/WEBP
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="glass-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="glass-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ext">Extension</Label>
              <Input
                id="ext"
                value={formData.ext}
                onChange={(e) => setFormData({ ...formData, ext: e.target.value })}
                className="glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cellPhone">Cell Phone</Label>
              <Input
                id="cellPhone"
                value={formData.cellPhone}
                onChange={(e) => setFormData({ ...formData, cellPhone: e.target.value })}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homePhone">Home Phone</Label>
              <Input
                id="homePhone"
                value={formData.homePhone}
                onChange={(e) => setFormData({ ...formData, homePhone: e.target.value })}
                className="glass-input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="glass-input">
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
