export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* Floating orbs */}
      <div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-50 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.22 250 / 0.5), transparent 70%)", animationDelay: "-7s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.15 210 / 0.4), transparent 70%)", animationDelay: "-3s" }}
      />
    </div>
  );
}
