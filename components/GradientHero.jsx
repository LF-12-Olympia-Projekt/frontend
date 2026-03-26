export default function GradientHero({ title, subtitle, children }) {
  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 to-background px-4 py-12 sm:px-6 lg:px-8">

      {/* weicher Gesamtverlauf */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-green-500/10" />

      <div className="relative mx-auto max-w-7xl text-center">
        {title && (
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
