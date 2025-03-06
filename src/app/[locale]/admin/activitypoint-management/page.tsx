import { Metadata } from "next";
import ClubsInformationtModule from "@/components/modules/ClubsManagement";
import ActivityPointModule from "@/components/modules/ActivityPointManagement";

export const metadata: Metadata = {
  title: "IC-PDP | Quản lý kế hoạch",
};

export default function UserManagementPage() {
  return <ActivityPointModule />;
}
