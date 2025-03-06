import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminLayout from "@/components/core/layouts/AdminLayout";

import { constants } from "@/settings";

export default function RootAdminLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	const token = getCookie(constants.ACCESS_TOKEN, { cookies });

	// if (!token) {
	//   redirect(`/${locale}/`);
	// }

	return <AdminLayout>{children}</AdminLayout>;
}
