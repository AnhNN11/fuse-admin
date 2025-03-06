"use client";

import Image from "next/image";
import Link from "next/link";
import { Checkbox, Col, Flex, Form, FormProps, Input, message } from "antd";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { signInWithPopup } from "firebase/auth";

import Button from "@/components/core/common/Button";
import SelectLanguage from "@/components/core/layouts/AdminLayout/SelectLanguage";
import Typography from "@/components/core/common/Typography";

import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";
import {
  useSignInMutation,
  useSignInWithGoogleMutation,
} from "@/store/queries/auth";
import { auth, provider } from "@/services/firebase/config";

import facebook from "@public/icons/auth/facebook.svg";
import google from "@public/icons/auth/google.svg";
import apple from "@public/icons/auth/apple.svg";

import * as S from "./styles";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import { actionSocialLogin } from "@/store/slices/auth";

type FieldType = {
  email: string;
  password: string;
  remember: string;
};

function SignInModule() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();

  const dispatch = useAppDispatch();

  const { t } = useTranslation(params?.locale as string, "signIn");

  const [signIn, { isLoading }] = useSignInMutation();
  const [signInWithGoogle] = useSignInWithGoogleMutation();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await signIn(values).unwrap();
      router?.push(`/${locale}/`);
      message.success("Sign-in successful!");
    } catch (error: any) {
      message.error(error?.data?.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const resFirebase: any = await signInWithPopup(
        auth,
        provider.providerGoogle
      );
      const res = await signInWithGoogle(resFirebase.user).unwrap();

      if (res.method == "SignUp") {
        dispatch(actionSocialLogin(res));
        router?.push(`/${locale}/sign-up?method=${res.method}`);
      }
      if (res.method == "LoginWithGoogle") {
        dispatch(actionSocialLogin(res));
        router?.push(`/${locale}/events`);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <S.Wrapper>
      <Flex justify="space-between">
        <Image alt="" src={"/icons/layout/logo.svg"} width={40} height={40} />
        <SelectLanguage />
      </Flex>
      <Typography.Title
        level={2}
        $color={themeColors?.primary}
        $align="center"
        $margin="32px 0px 16px 0"
      >
        {t("welcome")} 👋
      </Typography.Title>
      <Typography.Text $align="center" $margin="0px 0px 32px 0">
        {t("description")} 👋
      </Typography.Text>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            placeholder="Enter your email"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Col span={24}>
          <Flex align="flex-start" justify="space-between">
            <Form.Item<FieldType>
              wrapperCol={{ span: 24 }}
              name="remember"
              valuePropName="checked"
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link href={`/${locale}/forget-password`}>Forget Password?</Link>
          </Flex>
        </Col>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            $width="100%"
            loading={isLoading}
          >
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
      <Flex gap={16} justify="center">
        <S.SocialWrapper onClick={handleGoogleLogin}>
          <Image src={google} alt="google-icon" width={32} height={32} />
        </S.SocialWrapper>
      </Flex>
      <Flex justify="center" gap={4}>
        <p>Don&apos;t have an account?</p>
        <Link href={`/${locale}/sign-up`}>Sign up</Link>
      </Flex>
    </S.Wrapper>
  );
}

export default SignInModule;
