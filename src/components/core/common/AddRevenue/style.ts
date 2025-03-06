import { Modal } from "antd";
import styled from "styled-components";

export const UserModal = styled(Modal)`
	width: 35% !important;
	max-height: 80vh;
	.ant-modal-content {
		margin-bottom: 50px;
		overflow: hidden;
		max-height: 100%;
		padding: 0 0 20px 0 !important;
		.ant-modal-header {
			padding: 10px 5px;
			.ant-modal-title {
				font-size: 20px;
				color: ${(props) => props?.theme?.colors?.primary};
			}
		}
		.ant-modal-close {
			background-color: #8884;
			&:hover {
				background-color: #8888;
			}
		}
		.ant-modal-footer {
			padding: 0 5%;
		}
	}
`;
