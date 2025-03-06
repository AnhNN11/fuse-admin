import EditProfileModule from "@/components/modules/EditProfile";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "NEXTTEAM | Cài đặt tài khoản",
};
export default function EventPage() {
  return <EditProfileModule  />;
}
