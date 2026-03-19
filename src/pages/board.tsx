import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import { Button, Badge } from "@/components/ui-custom";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Plus, GripVertical, Calendar, MessageSquare, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Task } from "@workspace/api-client-react";
import { formatDate } from "@/lib/format";

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-200 text-slate-700', border: 'border-slate-200' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  { id: 'review', label: 'In Review', color: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
  { id: 'done', label: 'Done', color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' }
];

export default function KanbanBoard() {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: projects = [] } = useProjects();
  const updateTask = useUpdateTask();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const filteredTasks = selectedProjectId === "all" 
    ? tasks 
    : tasks.filter(t => t.projectId === parseInt(selectedProjectId));

  const handleStatusChange = (task: Task, newStatus: string) => {
    if (task.status === newStatus) return;
    updateTask.mutate({ id: task.id, data: { status: newStatus } });
  };

  const openTask = (task: Task) => {
    setActiveTask(task);
    setIsDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Board</h1>
            <p className="text-slate-500 mt-1">Visualize and move your work forward.</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              className="h-10 px-3 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Button onClick={() => { setActiveTask(null); setIsDialogOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto kanban-scroll pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-6 min-w-max h-full">
            {COLUMNS.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.id);
              
              return (
                <div key={col.id} className={`w-80 flex flex-col bg-slate-50/80 rounded-2xl border ${col.border} flex-shrink-0 h-full max-h-[calc(100vh-200px)]`}>
                  <div className="p-4 flex items-center justify-between border-b border-slate-200/60 bg-white/50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800">{col.label}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.color}`}>
                        {colTasks.length}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => {
                      setActiveTask(null);
                      setIsDialogOpen(true);
                    }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 kanban-scroll">
                    <AnimatePresence>
                      {colTasks.map(task => {
                        const project = projects.find(p => p.id === task.projectId);
                        return (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={task.id} 
                            className="bg-white rounded-xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-primary/40 transition-all group"
                          >
                            <div className="p-4 cursor-pointer" onClick={() => openTask(task)}>
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant={
                                  task.priority === 'urgent' ? 'danger' : 
                                  task.priority === 'high' ? 'warning' : 'neutral'
                                } className="text-[10px] uppercase font-bold tracking-wider">
                                  {task.priority}
                                </Badge>
                                
                                <div onClick={e => e.stopPropagation()}>
                                  <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                      <button className="text-slate-400 hover:text-slate-700 w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Portal>
                                      <DropdownMenu.Content className="min-w-[180px] bg-white rounded-xl shadow-lg border border-slate-100 p-1 z-50">
                                        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Move to</div>
                                        {COLUMNS.filter(c => c.id !== task.status).map(c => (
                                          <DropdownMenu.Item 
                                            key={c.id} 
                                            onSelect={() => handleStatusChange(task, c.id)}
                                            className="px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 rounded-lg cursor-pointer flex items-center gap-2"
                                          >
                                            <div className={`w-2 h-2 rounded-full ${c.color.split(' ')[0]}`} />
                                            {c.label}
                                          </DropdownMenu.Item>
                                        ))}
                                      </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                  </DropdownMenu.Root>
                                </div>
                              </div>
                              
                              <h4 className="font-bold text-slate-900 leading-snug mb-3">{task.title}</h4>
                              
                              {project && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: project.color }} />
                                  <span className="text-xs font-medium text-slate-600 truncate">{project.name}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between text-slate-400 text-xs mt-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    
                    {colTasks.length === 0 && !isLoading && (
                      <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-sm font-medium text-slate-400">
                        Drop items here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <TaskDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          task={activeTask} 
          defaultProjectId={selectedProjectId !== "all" ? parseInt(selectedProjectId) : undefined}
        />
      </div>
    </AppLayout>
  );
}
