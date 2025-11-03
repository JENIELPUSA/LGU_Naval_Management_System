import React, { useContext } from "react";
import OrganizerTable from "./OrganizerTable";
import { OrganizerDisplayContext } from "../../../../contexts/OrganizerContext/OrganizerContext";
import LoadingOverlay from "../../../../ReusableFolder/LoadingOverlay";
import { PersonilContext } from "../../../../contexts/PersonelContext/PersonelContext";
function AdminLayout() {
    const { isOrganizer, isLoading } = useContext(OrganizerDisplayContext);
    const { bgtheme, FontColor } = useContext(PersonilContext);
    return (
        <div className="relative p-4">
            {isLoading && <LoadingOverlay />}
            <OrganizerTable
                data={isOrganizer}
                bgtheme={bgtheme}
                FontColor={FontColor}
            />
        </div>
    );
}

export default AdminLayout;
