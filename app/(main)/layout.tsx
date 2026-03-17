import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-50 w-full">
        {children}
      </main>
    </div>
  );
}