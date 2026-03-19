import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { Card, Badge } from "@/components/ui-custom";
import { CheckCircle2, CircleDashed, Clock, FolderKanban } from "lucide-react";
import { Link } from "wouter";
import { formatRelative } from "@/lib/format";
import { AppLayout } from "@/components/layout/app-layout";

export default function Dashboard() {
  const { data: projects = [], isLoading: pLoading } = useProjects();
  const { data: tasks = [], isLoading: tLoading } = useTasks();

  const activeProjects = projects.filter(p => p.status === 'active');
  const openTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');
  
  const recentTasks = [...openTasks].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-900 p-8 shadow-xl text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('/images/dashboard-hero.png')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold mb-2">Good morning!</h1>
            <p className="text-indigo-200 text-lg max-w-xl">
              You have <span className="text-white font-semibold">{openTasks.length} tasks</span> to complete across <span className="text-white font-semibold">{activeProjects.length} active projects</span>. Let's make today count.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Projects</p>
              <h3 className="text-2xl font-bold font-display text-slate-900">{activeProjects.length}</h3>
            </div>
          </Card>
          
          <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <CircleDashed className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Open Tasks</p>
              <h3 className="text-2xl font-bold font-display text-slate-900">{openTasks.length}</h3>
            </div>
          </Card>
          
          <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <h3 className="text-2xl font-bold font-display text-slate-900">{completedTasks.length}</h3>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Hours</p>
              <h3 className="text-2xl font-bold font-display text-slate-900">--</h3>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-900">Recent Tasks</h2>
              <Link href="/tasks" className="text-sm font-semibold text-primary hover:text-primary/80">View all</Link>
            </div>
            <div className="space-y-3">
              {tLoading ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />)
              ) : recentTasks.length === 0 ? (
                <Card className="p-8 text-center border-dashed border-2">
                  <p className="text-slate-500">No open tasks right now.</p>
                </Card>
              ) : (
                recentTasks.map(task => (
                  <Card key={task.id} className="p-4 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        task.priority === 'urgent' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                        task.priority === 'high' ? 'bg-orange-500' :
                        task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                      <div>
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.projectId ? projects.find(p => p.id === task.projectId)?.name : 'No Project'} • {formatRelative(task.updatedAt)}</p>
                      </div>
                    </div>
                    <Badge variant={task.status === 'review' ? 'warning' : 'neutral'} className="capitalize">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Active Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-900">Active Projects</h2>
              <Link href="/projects" className="text-sm font-semibold text-primary hover:text-primary/80">View all</Link>
            </div>
            <div className="space-y-3">
              {pLoading ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-xl" />)
              ) : activeProjects.length === 0 ? (
                <Card className="p-8 text-center border-dashed border-2">
                  <p className="text-slate-500">No active projects found.</p>
                </Card>
              ) : (
                activeProjects.slice(0, 4).map(project => {
                  const pTasks = tasks.filter(t => t.projectId === project.id);
                  const completed = pTasks.filter(t => t.status === 'done').length;
                  const progress = pTasks.length > 0 ? Math.round((completed / pTasks.length) * 100) : 0;
                  
                  return (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <Card className="p-4 hover:border-primary/30 transition-all hover:shadow-md cursor-pointer block group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: project.color }}>
                              {project.name.substring(0, 1)}
                            </div>
                            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{project.name}</p>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">{progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                      </Card>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
