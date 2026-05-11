import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { useAuth } from "@/hooks/use-auth";
import { api, userStore } from "@/lib/api";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Loader2, Save, Trash2, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
  }, [loading, user]);

  // load user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setNickname(user.nickname || "");
      setPreview(user.avatar || null);
    }
  }, [user]);

  // pick file
  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    if (fileRef.current) {
      fileRef.current.files = e.target.files;
    }
  };

  // submit profile
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("nickname", nickname);

      if (fileRef.current?.files?.[0]) {
        formData.append("avatar", fileRef.current.files[0]);
      }

      // 1️⃣ Update profile (uploads to Cloudinary in backend)
      const res = await api.updateProfile(formData);

      // 2️⃣ Immediately update state with response
      const updatedUser = res.user;
      userStore.set(updatedUser);
      setUser(updatedUser);

      // 3️⃣ Force refresh from backend to ensure consistency
      const fresh = await api.me();
      userStore.set(fresh.user);
      setUser(fresh.user);

      // Clear file input after successful upload
      if (fileRef.current) {
        fileRef.current.value = "";
      }

      toast.success("Profile updated successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <BackgroundFX />

      <Link to="/dashboard" className="absolute top-6 left-6 flex items-center gap-2 text-sm">
        <ArrowLeft size={16} />
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 p-6 rounded-2xl border border-white/10"
      >
        <h1 className="text-xl font-semibold mb-6">Profile</h1>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">{initials}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-black/60"
              >
                <Camera size={14} />
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickFile}
              className="hidden"
            />

            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-xs">Name</label>
            <div className="flex items-center gap-2 border p-2 rounded-lg">
              <UserIcon size={16} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label className="text-xs">Nickname</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border p-2 rounded-lg bg-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full border p-2 rounded-lg opacity-60"
            />
          </div>

          {/* Submit */}
          <button
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-white text-black p-2 rounded-lg"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Changes
          </button>
        </form>
      </motion.div>
    </main>
  );
}
