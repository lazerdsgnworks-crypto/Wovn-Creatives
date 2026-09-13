import * as React from "react";
import { ArrowUpRight, Grid, List, Eye, Sparkles, X, Layers } from "lucide-react";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";

export type Project = {
  id: string;
  title: string;
  category: "3D & Motion" | "Brand Identity" | "Digital Design" | "Editorial";
  year: string;
  client: string;
  description: string;
  image: string;
  secondaryImage: string;
  deliverables: string[];
  metrics?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "aura-iridescent",
    title: "Aura Atmosphere",
    category: "3D & Motion",
    year: "2026",
    client: "Lazer Studio",
    description: "Soft iridescent light simulations, volumetric atmospheric shaders, and chromatic radiance explorations.",
    image: "https://i.ibb.co/m5R73btf/hf-20260912-193317-f5868bff-6646-42b1-94d8-e4edcba52484.png",
    secondaryImage: "https://i.ibb.co/Wp6dXt2Z/hf-20260912-193317-96734949-14ed-49e4-a089-8e920589b2b0.png",
    deliverables: ["Spatial UI Kit", "Real-Time Shaders", "Keynote Art Direction", "Motion Toolkit"],
    metrics: "+4.2M Live Broadcast Impressions",
  },
  {
    id: "flora-botanica",
    title: "Flora Architecture",
    category: "Brand Identity",
    year: "2026",
    client: "Organic Botany Labs",
    description: "Monolithic architectural forms fused with organic moss textures and bio-sculpted structures.",
    image: "https://i.ibb.co/QvYGTRsn/hf-20260912-194151-55ce9bd5-8fe5-40e7-b570-118cd200b1f6.png",
    secondaryImage: "https://i.ibb.co/Z1bp74TR/hf-20260912-191155-5f71e124-8e87-42bc-8b86-1cff2150b5d0.png",
    deliverables: ["Comprehensive Identity", "Hardware Typography", "Recyclable Unboxing", "Sound Identity"],
    metrics: "Red Dot Best of Category 2026",
  },
  {
    id: "form-chrome",
    title: "Form & Structure",
    category: "Editorial",
    year: "2025",
    client: "Monolith Design Group",
    description: "Precision chrome axes carved by sharp directional lighting and minimalist geometric silhouettes.",
    image: "https://i.ibb.co/Wp6dXt2Z/hf-20260912-193317-96734949-14ed-49e4-a089-8e920589b2b0.png",
    secondaryImage: "https://i.ibb.co/m5R73btf/hf-20260912-193317-f5868bff-6646-42b1-94d8-e4edcba52484.png",
    deliverables: ["Art Direction", "Hardbound Monograph", "FSC-Certified Packaging", "E-commerce Experience"],
    metrics: "100% Sold Out First Run",
  },
  {
    id: "flow-motion",
    title: "Spatial Flow",
    category: "Digital Design",
    year: "2025",
    client: "Velocity CGI",
    description: "Fluid kinetic stream transitions, hyper-smooth vector trajectories, and interactive dimensional motions.",
    image: "https://i.ibb.co/Z1bp74TR/hf-20260912-191155-5f71e124-8e87-42bc-8b86-1cff2150b5d0.png",
    secondaryImage: "https://i.ibb.co/KzfwqN8C/hf-20260912-191255-78bb3dd2-f71b-435f-9c64-55cd88dc29fe.png",
    deliverables: ["Web Application Design", "Design Token System", "WebGL Shader Canvas", "Mobile Companion App"],
    metrics: "$1.8B Processed Volume in Alpha",
  },
  {
    id: "depth-dimension",
    title: "Dimensional Depth",
    category: "Editorial",
    year: "2025",
    client: "Atelier Dimension",
    description: "Multilayer visual weight and depth mapping across dark-matter geometric planes.",
    image: "https://i.ibb.co/KzfwqN8C/hf-20260912-191255-78bb3dd2-f71b-435f-9c64-55cd88dc29fe.png",
    secondaryImage: "https://i.ibb.co/rRt0gSH8/hf-20260912-191457-5b20f26b-8f37-401e-862a-e1ef62e02a63.png",
    deliverables: ["Typeface Specimen", "Silk-Screen Posters", "Interactive Specimen Site", "Specimen Booklet"],
    metrics: "Featured in TDC Annual 46",
  },
  {
    id: "energy-temporal",
    title: "Temporal Energy",
    category: "3D & Motion",
    year: "2024",
    client: "Synth Dynamics",
    description: "Kinetic energy captured across rapid temporal exposures and radiant ultraviolet currents.",
    image: "https://i.ibb.co/rRt0gSH8/hf-20260912-191457-5b20f26b-8f37-401e-862a-e1ef62e02a63.png",
    secondaryImage: "https://i.ibb.co/WNcJNZmd/hf-20260912-192806-549bed52-0312-4da7-9f03-204a384a215e.png",
    deliverables: ["3D CGI Launch Film", "Kinetic Identity", "Brand Guidelines", "Spatial Showroom VR"],
    metrics: "14 International Film Awards",
  },
  {
    id: "glitch-distortion",
    title: "Digital Distortion",
    category: "3D & Motion",
    year: "2024",
    client: "Noir et Cie",
    description: "High-frequency cybernetic glitch distortion breaking visual geometry in dark aesthetic realms.",
    image: "https://i.ibb.co/WNcJNZmd/hf-20260912-192806-549bed52-0312-4da7-9f03-204a384a215e.png",
    secondaryImage: "https://i.ibb.co/NdjnKbwy/hf-20260912-193056-2a68be59-2b90-4b50-b553-c64e14ce4419.png",
    deliverables: ["Audio-Reactive 3D", "Album Packaging", "Spatial Audio Master"],
    metrics: "Over 850K Vinyl Editions Shipped",
  },
  {
    id: "prism-spectral",
    title: "Spectral Horizon",
    category: "3D & Motion",
    year: "2024",
    client: "Prism Studio",
    description: "Prismatic spectral refraction and chromatic beam arrays carving through deep void horizons.",
    image: "https://i.ibb.co/NdjnKbwy/hf-20260912-193056-2a68be59-2b90-4b50-b553-c64e14ce4419.png",
    secondaryImage: "https://i.ibb.co/GfwPZrZC/hf-20260912-193857-676dccef-3441-445d-b269-8fcf6201c675.png",
    deliverables: ["Interactive WebGL", "Brand Identity", "Motion Design"],
    metrics: "Awwwards Site of the Day",
  },
  {
    id: "pulse-cybernetic",
    title: "Cybernetic Pulse",
    category: "Digital Design",
    year: "2024",
    client: "Vector Works",
    description: "Real-time cybernetic pulses and glowing kinetic nodes powering next-generation audio visualizers.",
    image: "https://i.ibb.co/GfwPZrZC/hf-20260912-193857-676dccef-3441-445d-b269-8fcf6201c675.png",
    secondaryImage: "https://i.ibb.co/m5R73btf/hf-20260912-193317-f5868bff-6646-42b1-94d8-e4edcba52484.png",
    deliverables: ["Audio Visualizer", "Interactive Installation", "Live Performance Engine"],
    metrics: "Global Tour Visuals",
  },
];

type CategoryFilter = "All" | "3D & Motion" | "Brand Identity" | "Digital Design" | "Editorial";
type ViewMode = "coverflow" | "grid" | "list";

export function OurWork() {
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>("All");
  const [viewMode, setViewMode] = React.useState<ViewMode>("coverflow");
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);

  const filteredProjects = React.useMemo(() => {
    if (activeCategory === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Convert filtered projects into CoverflowSlides
  const coverflowSlides: CoverflowSlide[] = React.useMemo(() => {
    return filteredProjects.map((project) => ({
      src: project.image,
      alt: project.title,
      title: project.title,
      subtitle: `${project.category} - ${project.client}`,
      meta: [
        { label: "Year", value: project.year },
        { label: "Client", value: project.client },
        { label: "Category", value: project.category },
        ...(project.metrics ? [{ label: "Impact", value: project.metrics }] : []),
      ],
    }));
  }, [filteredProjects]);

  return (
    <section
      id="our-work"
      className="relative z-20 w-full bg-background text-foreground py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800/60 font-sans tracking-[-0.02em] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-[-0.04em] text-zinc-950 dark:text-zinc-100 leading-[0.88]">
              Our Work
            </h1>
          </div>

          {/* View toggle & counts */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Showing {filteredProjects.length} of {PROJECTS.length}
            </span>
            <div className="inline-flex rounded-full bg-zinc-100 dark:bg-zinc-900/80 p-1 shadow-xs">
              <button
                onClick={() => setViewMode("coverflow")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  viewMode === "coverflow"
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-xs font-medium"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                title="3D Coverflow Carousel"
                aria-label="3D Coverflow View"
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Coverflow</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-xs font-medium"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-xs font-medium"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                title="Index / Table View"
                aria-label="Index View"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Index</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="py-5 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {(["All", "3D & Motion", "Brand Identity", "Digital Design", "Editorial"] as CategoryFilter[]).map(
            (cat) => {
              const count = cat === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveSlideIndex(0);
                  }}
                  className={`whitespace-nowrap px-3.5 py-1.5 text-xs rounded-full transition-all flex items-center gap-1.5 tracking-[-0.02em] ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-[#09090b] font-medium shadow-xs"
                      : "bg-zinc-100/90 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/80 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/80"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-zinc-700 text-white dark:bg-zinc-300 dark:text-zinc-900"
                        : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            },
          )}
        </div>

        {/* Display Mode 1: 3D Coverflow Carousel Animation */}
        {viewMode === "coverflow" ? (
          <div className="pt-2 pb-6">
            <div className="relative rounded-3xl bg-zinc-50/70 dark:bg-zinc-900/25 overflow-hidden py-6 px-3 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 mb-2">
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-[-0.02em] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Touch or click image to move to next project • Swipe or use arrows</span>
                </span>
                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  {coverflowSlides.length} Selected Works
                </span>
              </div>

              <CoverflowCarousel
                key={`cf-${activeCategory}`}
                slides={coverflowSlides}
                cardWidth="clamp(260px, 32vw, 420px)"
                aspectRatio="16/11"
                rotate={38}
                depth={0.56}
                perspective={3.4}
                falloff={0.6}
                gap={0.02}
                loop={true}
                showCaption={true}
                captionPosition="top"
                showNavigation={true}
                showPagination={true}
                onSlideChange={(idx) => setActiveSlideIndex(idx)}
              />
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* Display Mode 2: Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer rounded-lg bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/70 overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs dark:shadow-none transition-all duration-300 flex flex-col justify-between"
                id={`work-card-${project.id}`}
              >
                {/* Media frame */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Top floating pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/90 dark:bg-[#09090b]/80 backdrop-blur-md text-zinc-800 dark:text-zinc-300 border border-zinc-200/90 dark:border-zinc-700/60 tracking-[-0.02em]">
                      {project.category}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/90 dark:bg-[#09090b]/80 backdrop-blur-md text-zinc-600 dark:text-zinc-400 border border-zinc-200/90 dark:border-zinc-700/60">
                      {project.year}
                    </span>
                  </div>

                  {/* View indicator */}
                  <div className="absolute bottom-3 right-3 flex items-center justify-center h-7 w-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-[#09090b] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-md">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-[-0.02em] mb-1">
                      {project.client}
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white tracking-[-0.02em] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal tracking-[-0.02em] line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags list */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap gap-1.5">
                    {project.deliverables.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5 rounded tracking-[-0.02em]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Display Mode 3: Index / Table List View */
          <div className="mt-4 border border-zinc-200 dark:border-zinc-800/80 rounded-lg overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800/60 bg-white dark:bg-zinc-900/20">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/70 tracking-[-0.02em]">
              <div className="col-span-1">No.</div>
              <div className="col-span-4">Project & Client</div>
              <div className="col-span-3">Discipline</div>
              <div className="col-span-2">Year</div>
              <div className="col-span-2 text-right">Details</div>
            </div>

            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-5 py-4 items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors tracking-[-0.02em]"
                id={`index-row-${project.id}`}
              >
                <div className="hidden sm:block col-span-1 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="col-span-4 flex items-center gap-3">
                  <div className="h-9 w-12 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex-shrink-0 sm:block hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {project.title}
                    </h4>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-normal">
                      {project.client}
                    </span>
                  </div>
                </div>

                <div className="col-span-3">
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-normal">
                    {project.category}
                  </span>
                </div>

                <div className="col-span-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {project.year}
                </div>

                <div className="col-span-2 flex items-center sm:justify-end justify-between pt-2 sm:pt-0">
                  <span className="sm:hidden text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    {project.year} • {project.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                    <span>Inspect</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Project Interactive Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="relative w-full max-w-3xl rounded-xl bg-white dark:bg-[#111114] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 text-zinc-900 dark:text-zinc-100 my-auto tracking-[-0.02em]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close Project Modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {selectedProject.category}
                </span>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {selectedProject.year}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">• {selectedProject.client}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white tracking-[-0.02em]">
                {selectedProject.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl font-normal">
                {selectedProject.description}
              </p>

              {/* Imagery Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={selectedProject.secondaryImage}
                    alt={`${selectedProject.title} detail`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Deliverables & Metrics */}
              <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 block mb-1.5">
                    Core Deliverables
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.deliverables.map((d, i) => (
                      <span
                        key={i}
                        className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded text-zinc-700 dark:text-zinc-300"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProject.metrics && (
                  <div className="sm:text-right">
                    <span className="text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 block mb-1">
                      Key Metric
                    </span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {selectedProject.metrics}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Studio Disciplines Overview Section */}
        <div id="disciplines" className="mt-20 pt-8">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>
            <span>Studio Capabilities</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-normal tracking-[-0.02em] text-zinc-950 dark:text-zinc-100 mb-6">
            Disciplines & Practice
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/35 shadow-xs">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 block mb-2">01 / BRAND</span>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Identity & Architecture</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Scalable design systems, typographic guidelines, brand positioning, and comprehensive identity manuals.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/35 shadow-xs">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 block mb-2">02 / SPATIAL</span>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">3D & Motion Graphics</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Corridor stream visualizers, photoreal 3D rendering, kinetic motion toolkits, and immersive spatial environments.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/35 shadow-xs">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 block mb-2">03 / DIGITAL</span>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Product & Interactive</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                WebGL interactive experiences, responsive interfaces, mobile design, and robust component engineering.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/35 shadow-xs">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 block mb-2">04 / PRINT</span>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Editorial & Packaging</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Tactile print specimens, foil debossing, FSC-certified luxury packaging, and custom typography specimens.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Contact / Inquiry Banner */}
        <div
          id="studio-contact"
          className="mt-16 rounded-3xl bg-gradient-to-b from-zinc-100/90 to-zinc-50 dark:from-zinc-900/60 dark:to-zinc-950/90 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Accepting New Commissions</span>
            </div>
            <h3 className="text-lg sm:text-xl font-medium tracking-[-0.02em] text-zinc-900 dark:text-zinc-100">
              Have a project in mind? Let&apos;s talk.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-lg font-normal">
              Direct inquiries to lazerdsgnworks@gmail.com. We respond within one business day.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:lazerdsgnworks@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-[#09090b] text-xs font-medium tracking-[-0.02em] hover:bg-black dark:hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xs"
            >
              <span>Email the Studio</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
