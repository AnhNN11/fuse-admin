import { Button, Form, FormProps, Input, InputNumber, ModalProps, notification } from "antd";
import * as S from "./style";
import { useAddFinanceMutation } from "@/store/queries/finances";

interface AddExpenseProps extends ModalProps {
	t: any;
	clubId: string;
	setOpen: any;
	refetch: any;
	confirmModal: { open: any; close: any; data: any };
	balance: number;
}

function AddExpense(props: AddExpenseProps) {
	const { t, clubId, setOpen, refetch, balance } = props;
	const { open, close, data } = props.confirmModal;
	const [addFinance, { isLoading }] = useAddFinanceMutation();
	const [form] = Form.useForm();

	const [api, contextHolder] = notification.useNotification();

	const openNotification = (field: string, postf: string = "is required!") => {
		api.error({
			message: "Error",
			description: field + " " + postf,
			placement: "bottomRight",
		});
	};
	const openEtError = (msg: string) => {
		api.error({
			message: "Error",
			description: msg,
			placement: "bottomRight",
		});
	};

	const handleSubmit: FormProps["onFinish"] = (values) => {
		if (!values?.title) {
			openNotification("Title");
			return;
		}
		if (!values?.content) {
			openNotification("Title");
			return;
		}
		if (!values?.amount || values.amount <= 0) {
			openNotification("Amount");
			return;
		}
		console.log(data);

		if (values.amount > balance) {
			openNotification("Amount");
			return;
		}
		open({
			data: values,
			name: "confirmAdd",
			onOk: async () => {
				try {
					await addFinance(values).unwrap();
					refetch(clubId);
					close();
					setOpen(false);
					form.resetFields();
				} catch (err) {
					openEtError("Số dư không đủ");
				}
			},
			onCancel: () => {
				form.resetFields();
				close();
			},
		});
	};

	return (
		<S.UserModal {...props} title={t("modal.expenses")}>
			{contextHolder}
			<Form
				form={form}
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 18 }}
				layout="horizontal"
				style={{ width: "100%" }}
				onFinish={handleSubmit}
				disabled={isLoading}
			>
				<Form.Item label={t("form.title")} name="title" required>
					<Input />
				</Form.Item>
				<Form.Item label={t("form.content")} name="content" required>
					<Input.TextArea />
				</Form.Item>
				<Form.Item label={t("form.amount")} name="amount" required>
					<InputNumber addonAfter="₫" />
				</Form.Item>
				<Form.Item name="type" style={{ display: "none" }} initialValue="e">
					<Input type="hidden" />
				</Form.Item>
				<Form.Item name="clubId" style={{ display: "none" }} initialValue={clubId}>
					<Input type="hidden" />
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 6, span: 16 }}>
					<Button type="primary" htmlType="submit">
						{t("form.submit")}
					</Button>
				</Form.Item>
			</Form>
		</S.UserModal>
	);
}

export default AddExpense;
