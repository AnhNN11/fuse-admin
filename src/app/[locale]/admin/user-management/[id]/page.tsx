import UsersManagementModule from "@/components/modules/UsersManagement";

function UserManagementPage({ params: { id } }: { params: { id: string } }) {
	return <UsersManagementModule id={id} />;
}

export default UserManagementPage;
