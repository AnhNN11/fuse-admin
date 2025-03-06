import { Metadata } from "next";

import ResetPasswordModule from "@/components/modules/ResetPassword";
import ResetPasswordNoTokenModule from "@/components/modules/ResetNoToken";

export const metadata: Metadata = {
  title: "NEXTTEAM | Đổi mật khẩu",
};

function ResetPassPage() {
  return <ResetPasswordNoTokenModule />;
}

export default ResetPassPage;
