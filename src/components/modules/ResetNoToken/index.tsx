"use client";

import Image from "next/image";
import { Flex, Form, FormProps, Input, message } from "antd";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import Button from "@/components/core/common/Button";
import SelectLanguage from "@/components/core/layouts/AdminLayout/SelectLanguage";
import Typography from "@/components/core/common/Typography";

import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";
import {
  useResetPasswordMutation,
  useResetPasswordNoTokenMutation,
} from "@/store/queries/auth";

import * as S from "./styles";

type FieldType = {
  password: string;
  passwordConfirm: string;
};
function ResetPasswordNoTokenModule() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();

  const { t } = useTranslation(params?.locale as string, "resetPassword");

  const [reset, { isLoading }] = useResetPasswordNoTokenMutation();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const result = await reset({
        body: {
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        },
      }).unwrap();
      message.success("Reset password successfully");
      router?.push(`/${locale}/sign-in`);
    } catch (error: any) {
      message.error(error?.data?.message || "Reset password failed");
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
          label="Password"
          name="password"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Confirm Password"
          name="passwordConfirm"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please confirm your password!" }]}
        >
          <Input
            placeholder="Confirm your password"
            autoComplete="current-password"
          />
        </Form.Item>

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
    </S.Wrapper>
  );
}

export default ResetPasswordNoTokenModule;
