import { useState } from "react";
import api from "../../services/api";
import { RiDeleteBin2Fill } from "react-icons/ri";

const UserRow = ({ user, reload }) => {
    const [loading, setLoading] = useState(false);

    const togglePermission = async () => {
        try {
            setLoading(true);

            await api.patch(`/users/${user._id}/project-permission`, {
                allowed: !user.canCreateProject,
            });

            reload();
        } catch {
            alert("Toggle failed");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRole = async (userId) => {
        try {
            await api.patch(`/users/${userId}`);
            reload();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error updating role");
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            reload();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error deleting user");
        }
    };

    return (
        <tr className="border-t border-white/10">
            <td className="p-4 font-medium capitalize">{user.name}</td>

            <td className="p-4 text-white/70">{user.email}</td>

            <td className="p-4">
                <span
                    className={`
          px-3 py-1 rounded-lg text-xs font-semibold
          ${
              user.role === "admin"
                  ? "bg-purple-500/30 text-purple-300"
                  : "bg-indigo-500/30 text-indigo-300"
          }
        `}
                >
                    {user.role}
                </span>
            </td>

            <td className="p-4">
                {user.canCreateProject ? (
                    <span className="text-green-400 font-semibold">
                        Allowed
                    </span>
                ) : (
                    <span className="text-red-400 font-semibold">Blocked</span>
                )}
            </td>

            <td className="p-4">
                {user.role !== "admin" && (
                    <button
                        onClick={togglePermission}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-linear-to-r from-indigo-500 to-purple-600 hover:scale-105 transition"
                        disabled={loading}
                    >
                        {loading ? "..." : "Toggle"}
                    </button>
                )}
            </td>

            <td className="p-4">
                <button
                    onClick={() => handleToggleRole(user._id)}
                    className="bg-indigo-500 px-3 py-1 rounded text-white"
                >
                    {user.role === "admin" ? "Demote" : "Promote"}
                </button>
            </td>

            <td className="p-4">
                <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-3 py-1 rounded text-white text-xl transition-colors cursor-pointer hover:text-red-500"
                >
                    <RiDeleteBin2Fill />
                </button>
            </td>
        </tr>
    );
};

export default UserRow;
