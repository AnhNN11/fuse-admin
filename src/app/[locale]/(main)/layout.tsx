import MainLayout from "@/components/core/layouts/MainLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
