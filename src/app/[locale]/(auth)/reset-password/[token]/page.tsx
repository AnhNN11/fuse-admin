import { Metadata } from "next";

import ResetPasswordModule from "@/components/modules/ResetPassword";

export const metadata: Metadata = {
  title: "NEXTTEAM | Đổi mật khẩu",
};

function ResetPassPage() {
  return <ResetPasswordModule />;
}

export default ResetPassPage;
