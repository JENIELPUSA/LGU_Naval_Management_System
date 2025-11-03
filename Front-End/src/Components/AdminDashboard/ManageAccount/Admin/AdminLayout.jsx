import React, { useContext } from "react";
import AdminTable from "./AdminTable";
import { AdminDisplayContext } from "../../../../contexts/AdminContext/AdminContext";
import LoadingOverlay from "../../../../ReusableFolder/LoadingOverlay";
import { PersonilContext } from "../../../../contexts/PersonelContext/PersonelContext";

function AdminLayout() {
    const { isAdmin, isLoading } = useContext(AdminDisplayContext);
    const { bgtheme, FontColor } = useContext(PersonilContext);

    return (
        <div className="relative p-4">
            {isLoading && <LoadingOverlay />}
            <AdminTable
                data={isAdmin}
                bgtheme={bgtheme}
                FontColor={FontColor}
            />
        </div>
    );
}

export default AdminLayout;
