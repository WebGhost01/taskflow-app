import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useTasks, useDeleteTask } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import { Button, Badge, Card } from "@/components/ui-custom";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Plus, MoreVertical, Edit2, Trash2, Calendar, AlertCircle } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Task } from "@workspace/api-client-react";
import { formatDate } from "@/lib/format";

export default function TasksList() {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: projects = [] } = useProjects();
  const deleteTask = useDeleteTask();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState("all");

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this task?")) {
      deleteTask.mutate({ id });
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "active") return t.status !== "done";
    if (filter === "done") return t.status === "done";
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">My Tasks</h1>
            <p className="text-slate-500 mt-1">Manage and track your responsibilities.</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              className="h-10 px-3 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="active">Active Only</option>
              <option value="done">Completed</option>
            </select>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => <Card key={i} className="h-20 bg-slate-100 border-none" />)}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <img src={`${import.meta.env.BASE_URL}images/empty-tasks.png`} alt="No tasks" className="w-64 h-64 object-contain mb-8 opacity-90" />
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">You're all caught up!</h3>
            <p className="text-slate-500 max-w-md mb-6">Enjoy your clear schedule, or add a new task if you have something in mind.</p>
            <Button onClick={openCreate} size="lg" className="gap-2">
              <Plus className="w-5 h-5" /> Add New Task
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-1/2">Task</th>
                  <th className="px-6 py-4 hidden md:table-cell">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Due Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  const isUrgent = task.priority === 'urgent';
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
                  
                  return (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="pt-1">
                            <input 
                              type="checkbox" 
                              checked={task.status === 'done'}
                              readOnly
                              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer mt-0.5"
                            />
                          </div>
                          <div>
                            <p className={`font-bold text-base ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {isUrgent && <Badge variant="danger" className="text-[10px] px-1.5 py-0">Urgent</Badge>}
                              {task.priority === 'high' && <Badge variant="warning" className="text-[10px] px-1.5 py-0">High Priority</Badge>}
                              {isOverdue && <span className="flex items-center text-xs text-rose-500 font-semibold"><AlertCircle className="w-3 h-3 mr-1"/> Overdue</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {project ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                            <span className="font-medium text-slate-700">{project.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          task.status === 'done' ? 'success' : 
                          task.status === 'in_progress' ? 'indigo' : 
                          task.status === 'review' ? 'warning' : 'neutral'
                        } className="capitalize">{task.status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        {task.dueDate ? (
                          <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                            <Calendar className="w-4 h-4" />
                            {formatDate(task.dueDate)}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors ml-auto opacity-0 group-hover:opacity-100 focus:opacity-100">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content className="min-w-[160px] bg-white rounded-xl shadow-lg border border-slate-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                              <DropdownMenu.Item onSelect={() => openEdit(task)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 rounded-lg cursor-pointer">
                                <Edit2 className="w-4 h-4" /> Edit Task
                              </DropdownMenu.Item>
                              <DropdownMenu.Item onSelect={() => handleDelete(task.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 outline-none hover:bg-rose-50 rounded-lg cursor-pointer font-medium mt-1">
                                <Trash2 className="w-4 h-4" /> Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <TaskDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          task={editingTask} 
        />
      </div>
    </AppLayout>
  );
}
