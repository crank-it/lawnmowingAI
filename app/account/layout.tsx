import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F0EBE3] flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
