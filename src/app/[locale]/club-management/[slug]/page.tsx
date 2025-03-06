import { redirect } from "next/navigation";

export default function AdminPage({
  params: { locale, slug },
  
}: {
  params: { locale: string; slug: string };
}) {
  return redirect(`/${locale}/club-management/${slug}/dashboard/`);
}
