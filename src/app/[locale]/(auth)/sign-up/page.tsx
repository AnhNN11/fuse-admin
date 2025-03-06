import SignUpModule from "@/components/modules/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Đăng ký",
};

function SignUpPage() {
  return <SignUpModule />;
}

export default SignUpPage;
