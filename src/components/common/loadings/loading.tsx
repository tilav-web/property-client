export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center w-screen h-screen">
      <div className="text-center">
        {/* Loading spinner */}
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

        {/* Loading text */}
        <h3 className="text-lg font-medium mb-2">Yuklanmoqda...</h3>
        <p className="text-muted-foreground">Iltimos, kuting</p>
      </div>
    </div>
  );
}