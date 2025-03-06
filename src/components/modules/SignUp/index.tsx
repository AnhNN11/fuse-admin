"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Checkbox,
  Col,
  Flex,
  Form,
  FormProps,
  Input,
  message,
  Row,
  Select,
} from "antd";
import { useRouter } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

import Button from "@/components/core/common/Button";
import SelectLanguage from "@/components/core/layouts/AdminLayout/SelectLanguage";
import Typography from "@/components/core/common/Typography";

import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";
import { useSignInMutation, useSignUpMutation } from "@/store/queries/auth";

import * as S from "./styles";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { useEffect } from "react";

type FieldType = {
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  password: string;
  username: string;
  passwordConfirm: string;
  phoneNumber: string;
};
function detachName(fullName: string | undefined): {
  firstname: string;
  lastname: string;
} {
  if (!fullName) {
    return { firstname: "", lastname: "" };
  }
  const parts = fullName.trim().split(/\s+/); // Improved to handle multiple spaces
  const firstname = parts.shift() || ""; // Safely extract the first part
  const lastname = parts.join(" "); // Join the remaining parts
  return { firstname, lastname };
}

function SignUpModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = useLocale();
  const { userInfo } = useAppSelector((state) => state?.auth);

  const [myForm] = Form.useForm();

  const { t } = useTranslation(params?.locale as string, "signUp");
  const method = searchParams.get("method") || "";

  const [signUp, { isLoading }] = useSignUpMutation();

  const onFinish = async () => {
    try {
      const result = myForm.getFieldsValue();
      await signUp(result).unwrap();
      router?.push(`/${locale}/sign-in`);
      message.success("Sign-up successful");
    } catch (error: any) {
      console.log("error", error);
      if (error && error.data && error.data.message) {
        message.error(error.data.message);
      } else {
        message.error("An unexpected error occurred");
      }
    }
  };
  const onLoginGG = async () => {
    try {
      const result = myForm.getFieldsValue();
      await signUp(result).unwrap();
      router?.push(`/${locale}/sign-in`);
    } catch (error) {}
  };

  detachName(userInfo?.decodedToken?.name);

  useEffect(() => {
    if (method === "SignUp") {
      myForm.setFieldsValue({
        email: userInfo?.email,
        firstname: userInfo?.firstname,
        lastname: userInfo?.lastname,
        password: "NextTeam123#",
        passwordConfirm: "NextTeam123#",
      });
    }
  }, [
    method,
    myForm,
    userInfo?.email,
    userInfo?.firstname,
    userInfo?.lastname,
  ]);

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
        initialValues={{ remember: true, email: userInfo?.email }}
        // onFinish={method === "SignUp" ? onLoginGG : onFinish}
        layout="vertical"
        form={myForm}
      >
        <Row gutter={16}>
          <Col span={12}>
            {" "}
            <Form.Item<FieldType>
              label="First name"
              name="firstname"
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="First name" autoComplete="current-password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType>
              label="Last name"
              name="lastname"
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Last name" autoComplete="current-password" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email"
          name="email"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your email! " }]}
        >
          <Input placeholder="Enter your email" autoComplete="email" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your password!" }]}
          hidden={method === "SignUp"}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Confirm Password"
          name="passwordConfirm"
          wrapperCol={{ span: 24 }}
          hidden={method === "SignUp"}
          rules={[
            { required: true, message: "Please input your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Col span={24}>
          <Flex align="flex-start" justify="space-between">
            <Form.Item<FieldType>
              label="Student Code"
              name="username"
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="First name" autoComplete="current-password" />
            </Form.Item>
            <Form.Item<FieldType>
              label="Gender"
              name="gender"
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
            >
              <Select placeholder="Select your gender" allowClear>
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Flex>
        </Col>
        <Form.Item<FieldType>
          label="Phone number"
          name="phoneNumber"
          wrapperCol={{ span: 24 }}
          rules={[
            { required: true, message: "Please input your phone number!" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid phone number!",
            },
          ]}
        >
          <Input placeholder="Enter your phone number" autoComplete="tel" />
        </Form.Item>

        <Form.Item<FieldType> wrapperCol={{ span: 24 }} valuePropName="checked">
          <Checkbox>
            {" "}
            <span>I agree to </span>
            <span style={{ color: "orange" }}>the terms of the platform</span>
          </Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          {method === "SignUp" ? (
            <Button
              type="primary"
              htmlType="submit"
              $width="100%"
              loading={isLoading}
              onClick={onLoginGG}
            >
              Dang ky Google
            </Button>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              $width="100%"
              loading={isLoading}
              onClick={onFinish}
            >
              Xác nhận
            </Button>
          )}
        </Form.Item>
      </Form>
      <Flex justify="center" gap={4}>
        <p>Do you already have an account</p>
        <Link href={`/${locale}/sign-in`}>Login in now</Link>
      </Flex>
    </S.Wrapper>
  );
}

export default SignUpModule;
