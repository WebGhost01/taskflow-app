import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useProject } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { Button, Badge } from "@/components/ui-custom";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Plus, ArrowLeft, LayoutDashboard, ListTodo } from "lucide-react";
import { Link, useParams } from "wouter";

export default function ProjectDetails() {
  const { id } = useParams();
  const projectId = parseInt(id || "0", 10);
  
  const { data: project, isLoading: pLoading } = useProject(projectId);
  const { data: tasks = [], isLoading: tLoading } = useTasks({ projectId });
  
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [view, setView] = useState<"board" | "list">("board");

  if (pLoading) return <AppLayout><div className="p-8 text-center animate-pulse">Loading project...</div></AppLayout>;
  if (!project) return <AppLayout><div className="p-8 text-center">Project not found</div></AppLayout>;

  // Derived stats
  const completed = tasks.filter(t => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <Link href="/projects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center text-white text-3xl font-display font-bold" style={{ backgroundColor: project.color }}>
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-display font-bold text-slate-900">{project.name}</h1>
                <Badge variant={project.status === 'active' ? 'success' : 'neutral'} className="capitalize">{project.status}</Badge>
              </div>
              <p className="text-slate-500 max-w-2xl">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
            <Button 
              variant={view === "board" ? "primary" : "ghost"} 
              size="sm" 
              onClick={() => setView("board")}
              className={view === "board" ? "shadow-sm" : ""}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" /> Board
            </Button>
            <Button 
              variant={view === "list" ? "primary" : "ghost"} 
              size="sm" 
              onClick={() => setView("list")}
              className={view === "list" ? "shadow-sm" : ""}
            >
              <ListTodo className="w-4 h-4 mr-2" /> List
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700">Project Progress</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${progress}%`, backgroundColor: project.color }} />
            </div>
          </div>
          <div className="px-4 border-l border-slate-200 text-center">
            <div className="text-2xl font-bold font-display text-slate-900">{tasks.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks</div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <h2 className="text-xl font-display font-bold text-slate-900">Project Tasks</h2>
          <Button onClick={() => setIsTaskDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>

        {tLoading ? (
          <div className="animate-pulse h-64 bg-slate-100 rounded-2xl"></div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No tasks yet</h3>
            <p className="text-slate-500 mb-6">Create the first task for this project.</p>
            <Button onClick={() => setIsTaskDialogOpen(true)} variant="outline">Add First Task</Button>
          </div>
        ) : view === "board" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['todo', 'in_progress', 'review', 'done'].map(status => {
              const columnTasks = tasks.filter(t => t.status === status);
              return (
                <div key={status} className="flex flex-col bg-slate-100/50 rounded-2xl p-4 border border-slate-200/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700 capitalize flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        status === 'todo' ? 'bg-slate-400' : 
                        status === 'in_progress' ? 'bg-blue-500' : 
                        status === 'review' ? 'bg-purple-500' : 'bg-emerald-500'
                      }`} />
                      {status.replace('_', ' ')}
                    </h3>
                    <Badge variant="neutral">{columnTasks.length}</Badge>
                  </div>
                  <div className="space-y-3 flex-1">
                    {columnTasks.map(task => (
                      <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex gap-2 items-start justify-between mb-2">
                          <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'neutral'} className="text-[10px]">
                            {task.priority}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-slate-900 leading-tight mb-2">{task.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{task.title}</td>
                    <td className="px-6 py-4 capitalize">
                      <Badge variant="neutral">{task.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={`flex items-center gap-1.5 ${task.priority === 'urgent' ? 'text-rose-600' : ''}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen} 
        defaultProjectId={projectId}
      />
    </AppLayout>
  );
}

// Ensure the icon used is imported
import { CheckSquare } from "lucide-react";
