import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900">
            <Navbar />
            <div className="pt-28 px-4 md:px-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AppLayout;
