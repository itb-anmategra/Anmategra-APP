import { Sidebar } from "./_components/Sidebar";

export default function LembagaRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid h-dvh grid-cols-[auto_1fr] overflow-hidden bg-[#FAFAFA]">
      <Sidebar />
      <main className="w-full overflow-y-auto px-6 py-16">{children}</main>
    </div>
  );
}
