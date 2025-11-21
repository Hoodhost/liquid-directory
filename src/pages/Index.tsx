import { useState, useEffect, useMemo } from "react";
import { Search, Edit3, Save, Building2 } from "lucide-react";
import { DirectoryCard, Employee } from "@/components/DirectoryCard";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { PasswordDialog } from "@/components/PasswordDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialEmployees } from "@/data/employees";
import { toast } from "sonner";

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // Load employees from localStorage or use initial data
  useEffect(() => {
    const stored = localStorage.getItem("companyDirectory");
    if (stored) {
      setEmployees(JSON.parse(stored));
    } else {
      const employeesWithIds = initialEmployees.map((emp, idx) => ({
        ...emp,
        id: `emp-${idx}`,
      }));
      setEmployees(employeesWithIds);
      localStorage.setItem("companyDirectory", JSON.stringify(employeesWithIds));
    }
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem("companyDirectory", JSON.stringify(employees));
    }
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    
    const query = searchQuery.toLowerCase();
    return employees.filter((emp) => {
      return (
        emp.name.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        emp.jobTitle?.toLowerCase().includes(query) ||
        emp.branch?.toLowerCase().includes(query) ||
        emp.telephone?.toLowerCase().includes(query) ||
        emp.cellPhone?.toLowerCase().includes(query)
      );
    });
  }, [employees, searchQuery]);

  const handleAddEmployee = (newEmployee: Omit<Employee, "id">) => {
    const employee: Employee = {
      ...newEmployee,
      id: `emp-${Date.now()}`,
    };
    setEmployees([...employees, employee]);
    toast.success("Employee added successfully");
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast.success("Employee removed");
  };

  const handleEditClick = () => {
    if (editMode) {
      setEditMode(false);
      toast.info("Edit mode disabled");
    } else {
      setPasswordDialogOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setEditMode(true);
    toast.success("Edit mode enabled");
  };

  // Get unique branches for display
  const branches = useMemo(() => {
    const branchSet = new Set(employees.map((emp) => emp.branch).filter(Boolean));
    return Array.from(branchSet).sort();
  }, [employees]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Hood Distribution
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                Company Directory
              </p>
            </div>
            
            <Button
              onClick={handleEditClick}
              variant={editMode ? "default" : "outline"}
              className={editMode 
                ? "bg-accent hover:bg-accent/90 text-accent-foreground accent-glow" 
                : "glass-input hover:border-accent/50"
              }
            >
              {editMode ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Exit Edit Mode
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Directory
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
              <Input
                type="text"
                placeholder="Search by name, email, job title, branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10 h-12 text-base"
              />
            </div>
            
            {editMode && (
              <AddEmployeeDialog onAdd={handleAddEmployee} />
            )}
          </div>

          {/* Branch filter pills */}
          {branches.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setSearchQuery(branch || "")}
                  className="px-3 py-1.5 rounded-full text-sm glass-input hover:bg-accent/10 hover:border-accent/50 transition-all"
                >
                  {branch}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <DirectoryCard
              key={employee.id}
              employee={employee}
              editMode={editMode}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No employees found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default Index;
