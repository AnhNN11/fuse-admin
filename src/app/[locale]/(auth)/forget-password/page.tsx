import { Metadata } from "next";

import ForgetPasswordModule from "@/components/modules/ForgetPassword";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quên mật khẩu",
};

function ForgetPassPage() {
  return <ForgetPasswordModule />;
}

export default ForgetPassPage;
