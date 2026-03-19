import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { Button, Card, Badge } from "@/components/ui-custom";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Plus, MoreVertical, Trash2, Edit2, LayoutDashboard } from "lucide-react";
import { Link } from "wouter";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Project } from "@workspace/api-client-react";

export default function Projects() {
  const { data: projects = [], isLoading } = useProjects();
  const deleteMutation = useDeleteProject();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project? All associated tasks will be orphaned.")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Projects</h1>
            <p className="text-slate-500 mt-1">Manage and organize all your work.</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Card key={i} className="h-48 animate-pulse bg-slate-100 border-none" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <img src={`${import.meta.env.BASE_URL}images/empty-projects.png`} alt="No projects" className="w-64 h-64 object-contain mb-8 opacity-80" />
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">No projects yet</h3>
            <p className="text-slate-500 max-w-md mb-6">Create your first project to start organizing tasks, setting deadlines, and tracking progress.</p>
            <Button onClick={openCreate} size="lg" className="gap-2">
              <Plus className="w-5 h-5" /> Create First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group relative overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 border-slate-200/80">
                <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: project.color }} />
                
                <div className="p-6 flex-1 flex flex-col mt-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-display font-bold shadow-sm" style={{ backgroundColor: project.color }}>
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="min-w-[160px] bg-white rounded-xl shadow-lg border border-slate-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                          <DropdownMenu.Item onSelect={() => openEdit(project)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 rounded-lg cursor-pointer">
                            <Edit2 className="w-4 h-4" /> Edit Details
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onSelect={() => handleDelete(project.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 outline-none hover:bg-rose-50 rounded-lg cursor-pointer font-medium mt-1">
                            <Trash2 className="w-4 h-4" /> Delete Project
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>

                  <h3 className="text-xl font-bold font-display text-slate-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">{project.description || "No description provided."}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Badge variant={
                      project.status === 'active' ? 'success' : 
                      project.status === 'completed' ? 'neutral' : 'warning'
                    } className="capitalize">{project.status}</Badge>
                    
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-primary hover:text-primary hover:bg-primary/10">
                        View Board <LayoutDashboard className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <ProjectDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          project={editingProject} 
        />
      </div>
    </AppLayout>
  );
}
