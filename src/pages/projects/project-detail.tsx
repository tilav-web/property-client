import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Calendar,
  Download,
  Loader2,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { projectService } from "@/services/project.service";
import Price from "@/components/common/price";
import type { IProject } from "@/interfaces/project/project.interface";
import ProjectContactDialog from "./_components/project-contact-dialog";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const p = await projectService.findById(id);
        if (!cancelled) setProject(p);
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

  if (!project) {
    return (
      <div className="py-16 text-center text-gray-500">
        {t("pages.projects.not_found", "Project not found")}
      </div>
    );
  }

  const developer =
    typeof project.developer === "object" ? project.developer : null;

  return (
    <div className="py-6">
      {/* Hero */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="relative h-64 bg-gray-100 sm:h-80">
          {project.photos?.[0] && (
            <img
              src={project.photos[0]}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <span className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-semibold text-white">
              {t(`pages.projects.status.${project.status}`, project.status)}
            </span>
            {project.delivery_date && (
              <span className="flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-gray-700">
                <Calendar size={12} /> {project.delivery_date}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              {developer && (
                <Link
                  to={`/developer/${developer._id}`}
                  className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
                >
                  {developer.logo ? (
                    <img
                      src={developer.logo}
                      alt={developer.name}
                      className="h-6 max-w-20 object-contain"
                    />
                  ) : (
                    <Building2 size={14} />
                  )}
                  {developer.name}
                </Link>
              )}
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {project.name}
              </h1>
              {project.address && (
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} /> {project.address}
                </p>
              )}
            </div>
            {project.launch_price !== undefined && (
              <div className="rounded-xl bg-blue-50 p-4 text-right">
                <p className="text-xs uppercase tracking-wide text-blue-600">
                  {t("pages.projects.launch_price", "Launch price")}
                </p>
                <Price
                  amount={project.launch_price}
                  currency={project.currency}
                  className="items-end text-2xl text-blue-900"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              onClick={() => setContactOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare size={16} className="mr-2" />
              {t("pages.projects.contact_us", "Contact us")}
            </Button>
            {project.brochure && (
              <Button asChild variant="outline">
                <a href={project.brochure} target="_blank" rel="noopener">
                  <Download size={16} className="mr-2" />
                  {t("pages.projects.brochure", "Brochure")}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            {t("pages.projects.about", "About this project")}
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
            {project.description}
          </p>
        </div>
      )}

      {/* Unit types */}
      {project.unit_types?.length > 0 && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t("pages.projects.unit_types", "Unit types")}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.unit_types.map((u, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 p-4"
              >
                <p className="text-sm font-semibold capitalize text-gray-900">
                  {t(`enums.project_unit.${u.category}`, u.category)}
                </p>
                <div className="mt-2 space-y-1 text-xs text-gray-600">
                  {u.bedrooms_min !== undefined && (
                    <p>
                      {u.bedrooms_min}
                      {u.bedrooms_max !== undefined && u.bedrooms_max !== u.bedrooms_min
                        ? ` - ${u.bedrooms_max}`
                        : ""}{" "}
                      {t("common.beds", "Beds")}
                    </p>
                  )}
                  {u.area_min !== undefined && (
                    <p>
                      {u.area_min}
                      {u.area_max !== undefined && u.area_max !== u.area_min
                        ? ` - ${u.area_max}`
                        : ""}{" "}
                      m²
                    </p>
                  )}
                  {u.price_from !== undefined && (
                    <div className="flex items-baseline gap-1 text-emerald-600">
                      <span className="font-semibold">
                        {t("pages.projects.from", "From")}
                      </span>
                      <Price
                        amount={u.price_from}
                        currency={project.currency}
                        showOriginal={false}
                      />
                    </div>
                  )}
                  {u.count !== undefined && (
                    <p className="text-gray-400">
                      {u.count} {t("pages.projects.units", "units")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment plans */}
      {project.payment_plans?.length > 0 && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t("pages.projects.payment_plans", "Payment plans")}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {project.payment_plans.map((p, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 p-4"
              >
                <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                {p.deposit_percent !== undefined && (
                  <p className="text-xs text-blue-600">
                    {t("pages.projects.deposit", "Deposit")}: {p.deposit_percent}%
                  </p>
                )}
                {p.description && (
                  <p className="mt-1 text-xs text-gray-600">{p.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo gallery */}
      {project.photos?.length > 1 && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t("pages.projects.gallery", "Gallery")}
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {project.photos.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener"
                className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"
              >
                <img
                  src={url}
                  alt={`${project.name} ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <ProjectContactDialog
        project={project}
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
    </div>
  );
}
