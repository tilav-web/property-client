import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, Globe, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import { developerService } from "@/services/developer.service";
import { projectService } from "@/services/project.service";
import type { IDeveloper } from "@/interfaces/developer/developer.interface";
import type { IProject } from "@/interfaces/project/project.interface";
import ProjectCard from "../projects/_components/project-card";

export default function DeveloperDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [developer, setDeveloper] = useState<IDeveloper | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const [dev, list] = await Promise.all([
          developerService.findById(id),
          projectService.list({ developer: id, limit: 50 }),
        ]);
        if (cancelled) return;
        setDeveloper(dev);
        setProjects(list.items);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="py-16 text-center text-gray-500">
        {t("pages.developers.not_found", "Developer not found")}
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50">
          {developer.logo ? (
            <img
              src={developer.logo}
              alt={developer.name}
              className="max-h-full max-w-full object-contain p-2"
            />
          ) : (
            <Building2 className="h-12 w-12 text-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{developer.name}</h1>
          {developer.description && (
            <p className="mt-1 text-sm text-gray-600">{developer.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
            {developer.website && (
              <a
                href={developer.website}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Globe size={14} /> {t("common.website", "Website")}
              </a>
            )}
            {developer.email && (
              <a
                href={`mailto:${developer.email}`}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Mail size={14} /> {developer.email}
              </a>
            )}
            {developer.phone && (
              <a
                href={`tel:${developer.phone}`}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Phone size={14} /> {developer.phone}
              </a>
            )}
            {developer.whatsapp && (
              <a
                href={`https://wa.me/${developer.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-1 hover:text-green-600"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Projects */}
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        {t("pages.developers.projects_title", "Projects")} ({projects.length})
      </h2>
      {projects.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          {t("pages.developers.no_projects", "No projects from this developer yet")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p._id} to={`/project/${p._id}`}>
              <ProjectCard project={p} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
