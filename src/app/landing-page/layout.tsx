import MahasiswaSidebar from "../_components/MahasiswaSidebar";

export default function LandingPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col">
      <MahasiswaSidebar />
      {children}
    </div>
  );
}
