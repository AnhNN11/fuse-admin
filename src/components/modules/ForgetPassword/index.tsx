"use client";

import Image from "next/image";

import { Flex, Form, FormProps, Input, message } from "antd";

import { useParams } from "next/navigation";

import Button from "@/components/core/common/Button";
import SelectLanguage from "@/components/core/layouts/AdminLayout/SelectLanguage";
import Typography from "@/components/core/common/Typography";

import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";
import { useForgetPasswordMutation } from "@/store/queries/auth";

import * as S from "./styles";
import { log } from "console";

type FieldType = {
  email: string;
};

function ForgetPasswordModule() {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "forgetPassword");

  const [forget, { isLoading }] = useForgetPasswordMutation();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const result = await forget(values).unwrap();
      message.success(result?.message);
    } catch (error: any) {}
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

export default ForgetPasswordModule;
