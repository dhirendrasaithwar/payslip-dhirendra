import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { api, type TemplateRecord } from "@/lib/api";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, FileText, Loader, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/templates")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
  }, [loading, user]);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await api.getTemplates();
        setTemplates(res.items || []);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        toast.error("Failed to load templates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [user]);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;

    setDeleting(id);
    try {
      await api.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => (t._id || t.id) !== id));
      toast.success("Template deleted");
    } catch (err) {
      console.error("Failed to delete template:", err);
      toast.error("Failed to delete template");
    } finally {
      setDeleting(null);
    }
  };

  const handleUseTemplate = async (template: TemplateRecord) => {
    if (!template?.data) {
      toast.error("Template data is missing");
      return;
    }

    // Store the template in session storage to pass to dashboard
    sessionStorage.setItem("selectedTemplate", JSON.stringify(template));
    navigate({ to: "/dashboard" });
  };

  // Filter templates based on search query
  const filteredTemplates = templates.filter((template) => {
    const searchLower = searchQuery.toLowerCase();
    const name = template.name?.toLowerCase() || "";
    const company = (template.data as any)?.companyName?.toLowerCase() || "";
    const employee = (template.data as any)?.employeeName?.toLowerCase() || "";

    return (
      name.includes(searchLower) || company.includes(searchLower) || employee.includes(searchLower)
    );
  });

  if (!loading && !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <BackgroundFX />

      {/* HEADER */}
      <header className="px-6 py-5 border-b flex justify-between items-center">
        <Link to="/dashboard" className="flex gap-2 items-center">
          <FileText size={18} /> Payslip.io
        </Link>

        <nav className="flex gap-4 items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:opacity-75 transition-opacity"
          >
            <FileText size={16} /> Dashboard
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-1 hover:opacity-75 transition-opacity"
          >
            <FileText size={16} /> History
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Templates</h1>
          <p className="text-muted-foreground">
            Manage and reuse your payslip templates for quick creation
          </p>
        </div>

        {/* Search Bar */}
        {!isLoading && templates.length > 0 && (
          <div className="mb-6 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by template name, company, or employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-sm"
            />
          </div>
        )}

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : filteredTemplates.length === 0 && searchQuery ? (
          <div className="text-center py-12 glass rounded-2xl">
            <Search size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">Try searching with different keywords</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl">
            <FileText size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first template from the dashboard
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-2 bg-gradient-brand text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredTemplates.map((template, idx) => (
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  key={template._id || template.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors group cursor-pointer"
                >
                  {/* Template Header */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-sm truncate">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(template.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>

                  {/* Template Preview */}
                  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5 text-xs space-y-1">
                    {template.data && typeof template.data === "object" && (
                      <>
                        <p className="text-muted-foreground">
                          <span className="text-white/60">Company:</span>{" "}
                          {(template.data as any)?.companyName || "N/A"}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-white/60">Employee:</span>{" "}
                          {(template.data as any)?.employeeName || "N/A"}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-white/60">Role:</span>{" "}
                          {(template.data as any)?.role || "N/A"}
                        </p>
                        {(template.data as any)?.basic && (
                          <p className="text-muted-foreground">
                            <span className="text-white/60">Base Salary:</span> ₹
                            {(template.data as any)?.basic?.toLocaleString("en-IN") || "N/A"}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-brand text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Copy size={14} /> Use
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(template._id || template.id)}
                      disabled={deleting === (template._id || template.id)}
                      className="px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleting === (template._id || template.id) ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
