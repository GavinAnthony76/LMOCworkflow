export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-3 px-4">
        <div className="text-5xl">📡</div>
        <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          This page doesn't exist. Return to the{" "}
          <a href="/" className="text-primary underline underline-offset-2">
            Broadcast Team Workflow
          </a>
          .
        </p>
      </div>
    </div>
  );
}
