import { useEffect, useState } from "react";
import api from "../services/api";
import UserTable from "../components/admin/UserTable";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        const res = await api.get("/users");
        setUsers(res.data.users);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 text-white">
            <h1 className="text-3xl font-bold mb-8">
                Admin Panel — User Permissions
            </h1>

            <div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden"
            >
                <UserTable users={users} reload={loadUsers} />
            </div>
        </div>
    );
};

export default AdminPanel;
