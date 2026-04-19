export default function SafeAreaWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-safe-bottom bg-bg">
      {children}
      <style jsx>{`
        .pb-safe-bottom {
          padding-bottom: max(env(safe-area-inset-bottom, 20px), 20px);
        }
      `}</style>
    </div>
  );
}