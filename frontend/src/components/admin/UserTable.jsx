import UserRow from "./UserRow";

const UserTable = ({ users, reload }) => {
    if (!users.length) {
        return (
            <div className="p-10 text-center text-white/50">No users found</div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-black/30 text-white/70">
                    <tr>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Role</th>
                        <th className="p-4 text-left">
                            Project Creation Permission
                        </th>
                        <th className="p-4 text-left">Action</th>
                        <th className="p-4 text-left">Role Change</th>
                        <th className="p-4 text-left">Delete User</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <UserRow key={u._id} user={u} reload={reload} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
