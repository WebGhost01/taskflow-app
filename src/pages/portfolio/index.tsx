import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Github, Mail, Phone, MapPin, Globe, Linkedin, Pencil, Plus, Trash2,
  ExternalLink, Briefcase, Code2, Brain, Dumbbell, Calendar, BookOpen,
  X, Check, ChevronRight, Bot, Gamepad2, FileText, User, Clock
} from "lucide-react";

const API = "/api";

interface Profile {
  id: number;
  name: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  bio: string;
  coverLetter: string;
}
interface Job {
  id: number;
  company: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  current: boolean;
  sortOrder: number;
}

const projects = [
  {
    name: "TaskFlow",
    desc: "Full-stack project & task management with kanban board, drag-and-drop, and analytics.",
    href: "/",
    icon: Code2,
    color: "from-blue-500 to-indigo-600",
    tags: ["React", "PostgreSQL", "Express"],
  },
  {
    name: "BudgetWise",
    desc: "Personal finance tracker with income/expense logging, budget goals, and charts.",
    href: "/budgetwise/",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-600",
    tags: ["React", "Charts", "REST API"],
  },
  {
    name: "MedVault",
    desc: "Secure medical records and medication tracker with appointment scheduling.",
    href: "/medvault/",
    icon: FileText,
    color: "from-red-500 to-rose-600",
    tags: ["React", "CRUD", "Forms"],
  },
  {
    name: "QuizForge",
    desc: "Interactive quiz platform with timed quizzes, scoring, and result history.",
    href: "/quizforge/",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    tags: ["React", "Real-time", "Gamification"],
  },
  {
    name: "RecipeBox",
    desc: "Recipe manager with ingredient lists, step-by-step instructions, and categories.",
    href: "/quizforge/recipes",
    icon: BookOpen,
    color: "from-orange-500 to-amber-600",
    tags: ["React", "Search", "CRUD"],
  },
  {
    name: "JobTracker",
    desc: "Career tracking with job application pipeline, status updates, and notes.",
    href: "/jobtracker/jobs",
    icon: Briefcase,
    color: "from-sky-500 to-blue-600",
    tags: ["React", "Kanban", "Dashboard"],
  },
  {
    name: "LinkVault",
    desc: "Bookmark manager with collections, tagging, and search across saved links.",
    href: "/jobtracker/links",
    icon: Globe,
    color: "from-pink-500 to-fuchsia-600",
    tags: ["React", "Collections", "Search"],
  },
  {
    name: "HabitChain",
    desc: "Daily habit tracker with streaks, completion history, and progress visualization.",
    href: "/jobtracker/habits",
    icon: Dumbbell,
    color: "from-lime-500 to-green-600",
    tags: ["React", "Streaks", "Analytics"],
  },
  {
    name: "EventBoard",
    desc: "Event planner with RSVP management, calendar view, and attendee tracking.",
    href: "/jobtracker/events",
    icon: Calendar,
    color: "from-yellow-500 to-orange-500",
    tags: ["React", "Calendar", "RSVP"],
  },
  {
    name: "StudyDeck",
    desc: "Flashcard study tool with spaced repetition, deck management, and quiz mode.",
    href: "/jobtracker/flashcards",
    icon: BookOpen,
    color: "from-cyan-500 to-sky-600",
    tags: ["React", "Spaced Repetition", "Quiz"],
  },
  {
    name: "AI Assistant",
    desc: "Streaming GPT-5.2 chat with conversation history, system prompts, and image generation.",
    href: "/jobtracker/ai",
    icon: Bot,
    color: "from-purple-600 to-indigo-700",
    tags: ["GPT-5.2", "Streaming", "OpenAI"],
  },
  {
    name: "Space Shooter",
    desc: "Canvas-based Space Invaders game with enemies, particles, bunkers, and levels.",
    href: "/jobtracker/game",
    icon: Gamepad2,
    color: "from-slate-600 to-gray-800",
    tags: ["Canvas", "Game Loop", "Animations"],
  },
];

function EditProfileModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...profile });
  const mut = useMutation({
    mutationFn: (data: Partial<Profile>) =>
      fetch(`${API}/portfolio/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["portfolio-profile"] }); onClose(); },
  });
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "name", label: "Full Name", placeholder: "Jane Doe" },
            { key: "tagline", label: "Tagline", placeholder: "Full-Stack Developer" },
            { key: "email", label: "Email", placeholder: "jane@example.com" },
            { key: "phone", label: "Phone", placeholder: "+1 555 000 0000" },
            { key: "location", label: "Location", placeholder: "San Francisco, CA" },
            { key: "github", label: "GitHub URL", placeholder: "https://github.com/..." },
            { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
            { key: "website", label: "Website URL", placeholder: "https://yoursite.com" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio / About Me</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={4}
              placeholder="Write a brief bio..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50">Cancel</button>
          <button
            onClick={() => mut.mutate(form)}
            disabled={mut.isPending}
            className="px-6 py-2 text-sm rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
          >
            {mut.isPending ? "Saving..." : <><Check className="w-4 h-4" /> Save</>}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

function EditCoverLetterModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const qc = useQueryClient();
  const [text, setText] = useState(profile.coverLetter);
  const mut = useMutation({
    mutationFn: (coverLetter: string) =>
      fetch(`${API}/portfolio/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["portfolio-profile"] }); onClose(); },
  });
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Cover Letter</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-slate-500 mb-4">Write your cover letter below. Use blank lines to separate paragraphs.</p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
          placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my strong interest in..."
          rows={16}
        />
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50">Cancel</button>
          <button
            onClick={() => mut.mutate(text)}
            disabled={mut.isPending}
            className="px-6 py-2 text-sm rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
          >
            {mut.isPending ? "Saving..." : <><Check className="w-4 h-4" /> Save</>}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

function JobFormModal({ job, onClose }: { job?: Job; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Omit<Job, "id" | "sortOrder">>({
    company: job?.company || "",
    title: job?.title || "",
    startDate: job?.startDate || "",
    endDate: job?.endDate || "",
    description: job?.description || "",
    current: job?.current || false,
  });
  const mut = useMutation({
    mutationFn: (data: typeof form) => {
      if (job) {
        return fetch(`${API}/portfolio/jobs/${job.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then(r => r.json());
      }
      return fetch(`${API}/portfolio/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => r.json());
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["portfolio-jobs"] }); onClose(); },
  });
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{job ? "Edit Job" : "Add Job"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          {[
            { key: "company", label: "Company", placeholder: "Acme Corp" },
            { key: "title", label: "Job Title", placeholder: "Senior Software Engineer" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="month"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="month"
                value={form.endDate || ""}
                disabled={form.current}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.current}
              onChange={e => setForm(f => ({ ...f, current: e.target.checked, endDate: e.target.checked ? "" : f.endDate }))}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-sm text-slate-700">I currently work here</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="Key responsibilities and achievements..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50">Cancel</button>
          <button
            onClick={() => mut.mutate(form)}
            disabled={mut.isPending || !form.company || !form.title || !form.startDate}
            className="px-6 py-2 text-sm rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
          >
            {mut.isPending ? "Saving..." : <><Check className="w-4 h-4" /> {job ? "Update" : "Add"}</>}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month) - 1] || ""} ${year}`;
}

export default function PortfolioPage() {
  const qc = useQueryClient();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingCoverLetter, setEditingCoverLetter] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null | "new">(null);

  const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
    queryKey: ["portfolio-profile"],
    queryFn: () => fetch(`${API}/portfolio/profile`).then(r => r.json()),
  });

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["portfolio-jobs"],
    queryFn: () => fetch(`${API}/portfolio/jobs`).then(r => r.json()),
  });

  const deleteJob = useMutation({
    mutationFn: (id: number) =>
      fetch(`${API}/portfolio/jobs/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio-jobs"] }),
  });

  const sectionRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollTo = (id: string) => {
    sectionRef.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loadingProfile || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-slate-500 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-indigo-700 tracking-tight text-lg cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            {profile.name || "Portfolio"}
          </span>
          <div className="hidden sm:flex items-center gap-1">
            {[
              { id: "projects", label: "Projects" },
              { id: "experience", label: "Experience" },
              { id: "cover-letter", label: "Cover Letter" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="px-4 py-1.5 text-sm rounded-lg text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors font-medium"
              >
                {label}
              </button>
            ))}
            <a
              href="/taskflow"
              className="ml-2 flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" /> TaskFlow App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.3) 0%, transparent 50%)"
        }} />
        <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-start gap-10">
          {/* Avatar */}
          <div className="shrink-0 w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-2xl shadow-indigo-900/50">
            <User className="w-14 h-14 text-white/90" />
          </div>
          {/* Info */}
          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile.name || "Your Name"}</h1>
              <button
                onClick={() => setEditingProfile(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                title="Edit profile"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <p className="text-indigo-200 text-xl mb-6 font-medium">{profile.tagline || "Developer & Creator"}</p>
            {profile.bio && (
              <p className="text-indigo-100/80 text-base leading-relaxed max-w-2xl mb-8">{profile.bio}</p>
            )}
            {/* Contact Links */}
            <div className="flex flex-wrap gap-3">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                  <Mail className="w-4 h-4" /> {profile.email}
                </a>
              )}
              {profile.phone && (
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm font-medium">
                  <Phone className="w-4 h-4" /> {profile.phone}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm font-medium">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </span>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                  <Globe className="w-4 h-4" /> Website
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Projects */}
      <section ref={el => { sectionRef.current["projects"] = el; }} className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-8 rounded-full bg-indigo-600" />
          <h2 className="text-3xl font-bold">Projects</h2>
          <span className="ml-2 text-sm text-slate-500 font-medium">{projects.length} apps built</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(proj => (
            <a
              key={proj.name}
              href={proj.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${proj.color}`} />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${proj.color} flex items-center justify-center shadow-sm`}>
                    <proj.icon className="w-5 h-5 text-white" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h3 className="font-bold text-base mb-2">{proj.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section ref={el => { sectionRef.current["experience"] = el; }} className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-200">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-violet-600" />
            <h2 className="text-3xl font-bold">Work Experience</h2>
          </div>
          <button
            onClick={() => setEditingJob("new")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Position
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-violet-400" />
            </div>
            <p className="text-slate-500 mb-2">No work experience added yet</p>
            <button
              onClick={() => setEditingJob("new")}
              className="text-violet-600 text-sm font-medium hover:underline"
            >
              Add your first position →
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-8">
              {jobs.map((job, i) => (
                <div key={job.id} className="relative flex gap-6 group">
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm z-10 relative
                      ${i === 0 ? "bg-gradient-to-br from-violet-500 to-indigo-600" : "bg-white border border-slate-200"}`}>
                      <Briefcase className={`w-5 h-5 ${i === 0 ? "text-white" : "text-slate-400"}`} />
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">{job.title}</h3>
                          {job.current && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">Current</span>
                          )}
                        </div>
                        <p className="text-violet-600 font-medium mt-0.5">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => setEditingJob(job)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this position?")) deleteJob.mutate(job.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(job.startDate)} — {job.current ? "Present" : formatDate(job.endDate || "")}</span>
                    </div>
                    {job.description && (
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Cover Letter */}
      <section ref={el => { sectionRef.current["cover-letter"] = el; }} className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-200 mb-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-emerald-600" />
            <h2 className="text-3xl font-bold">Cover Letter</h2>
          </div>
          <button
            onClick={() => setEditingCoverLetter(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Pencil className="w-4 h-4" /> {profile.coverLetter ? "Edit" : "Write Cover Letter"}
          </button>
        </div>

        {profile.coverLetter ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
            <div className="flex items-start gap-4 mb-8 pb-8 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">{profile.name}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500">
                  {profile.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{profile.email}</span>}
                  {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>}
                </div>
              </div>
            </div>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
              {profile.coverLetter.split("\n\n").map((para, i) => (
                para.trim() && (
                  <p key={i} className="mb-5 last:mb-0 whitespace-pre-wrap">{para.trim()}</p>
                )
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-slate-500 mb-2">No cover letter yet</p>
            <button
              onClick={() => setEditingCoverLetter(true)}
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              Write your cover letter →
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>Built with React, Express & PostgreSQL</p>
          <div className="flex gap-4">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      {editingProfile && <EditProfileModal profile={profile} onClose={() => setEditingProfile(false)} />}
      {editingCoverLetter && <EditCoverLetterModal profile={profile} onClose={() => setEditingCoverLetter(false)} />}
      {editingJob === "new" && <JobFormModal onClose={() => setEditingJob(null)} />}
      {editingJob && editingJob !== "new" && <JobFormModal job={editingJob} onClose={() => setEditingJob(null)} />}
    </div>
  );
}
