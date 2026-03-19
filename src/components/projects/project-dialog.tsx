import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input, Textarea } from "@/components/ui-custom";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import type { Project } from "@workspace/api-client-react";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const isEditing = !!project;
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name);
        setDescription(project.description || "");
        setColor(project.color);
        setStatus(project.status);
      } else {
        setName("");
        setDescription("");
        setColor("#6366f1");
        setStatus("active");
      }
    }
  }, [open, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && project) {
      updateMutation.mutate({
        id: project.id,
        data: { name, description, color, status }
      }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createMutation.mutate({
        data: { name, description, color, status }
      }, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{isEditing ? "Edit Project" : "Create Project"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details of your project below." : "Add a new project to organize your tasks."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Project Name <span className="text-rose-500">*</span></label>
            <Input 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Website Redesign"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <Textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this project about?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select 
                className="flex h-11 w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Color</label>
              <div className="flex gap-2 items-center h-11">
                <input 
                  type="color" 
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-11 h-11 p-1 rounded-xl border-2 border-border cursor-pointer bg-background"
                />
                <Input 
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="#000000"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" isLoading={isPending}>
              {isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
