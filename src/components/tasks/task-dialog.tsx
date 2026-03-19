import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input, Textarea } from "@/components/ui-custom";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import type { Task } from "@workspace/api-client-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: string;
  defaultProjectId?: number;
}

export function TaskDialog({ open, onOpenChange, task, defaultStatus = "todo", defaultProjectId }: TaskDialogProps) {
  const isEditing = !!task;
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const { data: projects = [] } = useProjects();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setProjectId(task.projectId ? String(task.projectId) : "");
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : "");
      } else {
        setTitle("");
        setDescription("");
        setProjectId(defaultProjectId ? String(defaultProjectId) : "");
        setStatus(defaultStatus);
        setPriority("medium");
        setDueDate("");
      }
    }
  }, [open, task, defaultStatus, defaultProjectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = { 
      title, 
      description: description || null, 
      projectId: projectId ? parseInt(projectId, 10) : null, 
      status, 
      priority, 
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    if (isEditing && task) {
      updateMutation.mutate({
        id: task.id,
        data: taskData
      }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createMutation.mutate({
        data: taskData
      }, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const selectClass = "flex h-11 w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Task Title <span className="text-rose-500">*</span></label>
            <Input 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Update landing page copy"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <Textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details here..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Project</label>
              <select 
                className={selectClass}
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
              >
                <option value="">No Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select 
                className={selectClass}
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Priority</label>
              <select 
                className={selectClass}
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Due Date</label>
              <Input 
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" isLoading={isPending}>
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
