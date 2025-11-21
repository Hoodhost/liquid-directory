import { useState } from "react";
import { User, Mail, Phone, Briefcase, Building2, Trash2, Camera } from "lucide-react";
import { Button } from "./ui/button";
import { EditPhotoDialog } from "./EditPhotoDialog";

export interface Employee {
  id: string;
  name: string;
  telephone?: string;
  ext?: string;
  fax?: string;
  email?: string;
  cellPhone?: string;
  homePhone?: string;
  jobTitle?: string;
  branch?: string;
  photo?: string;
}

interface DirectoryCardProps {
  employee: Employee;
  editMode: boolean;
  onDelete: (id: string) => void;
  onUpdatePhoto: (id: string, photo: string) => void;
}

export const DirectoryCard = ({ employee, editMode, onDelete, onUpdatePhoto }: DirectoryCardProps) => {
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center overflow-hidden relative group/photo cursor-pointer"
              onClick={() => editMode && setPhotoDialogOpen(true)}
            >
              {employee.photo ? (
                <img 
                  src={employee.photo} 
                  alt={employee.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-accent" />
              )}
              {editMode && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{employee.name}</h3>
              {employee.jobTitle && (
                <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{employee.jobTitle}</span>
                </div>
              )}
            </div>
          </div>
          
          {editMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(employee.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-2.5">
          {employee.branch && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">{employee.branch}</span>
            </div>
          )}
          
          {employee.email && (
            <a
              href={`mailto:${employee.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors group/link"
            >
              <Mail className="w-4 h-4 text-accent" />
              <span className="group-hover/link:underline">{employee.email}</span>
            </a>
          )}

          {(employee.telephone || employee.cellPhone || employee.homePhone) && (
            <div className="flex items-start gap-2 text-sm">
              <Phone className="w-4 h-4 text-accent mt-0.5" />
              <div className="flex flex-col gap-1">
                {employee.telephone && (
                  <a href={`tel:${employee.telephone}`} className="text-muted-foreground hover:text-accent transition-colors">
                    {employee.telephone}
                    {employee.ext && <span className="text-xs ml-1">(ext. {employee.ext})</span>}
                  </a>
                )}
                {employee.cellPhone && (
                  <a href={`tel:${employee.cellPhone}`} className="text-muted-foreground hover:text-accent transition-colors text-xs">
                    Cell: {employee.cellPhone}
                  </a>
                )}
                {employee.homePhone && (
                  <a href={`tel:${employee.homePhone}`} className="text-muted-foreground hover:text-accent transition-colors text-xs">
                    Home: {employee.homePhone}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <EditPhotoDialog
        open={photoDialogOpen}
        onOpenChange={setPhotoDialogOpen}
        currentPhoto={employee.photo}
        employeeName={employee.name}
        onSave={(photo) => onUpdatePhoto(employee.id, photo)}
      />
    </div>
  );
};
