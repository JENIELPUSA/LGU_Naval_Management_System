import React, { useContext } from 'react';
import OrganizerTable from './OrganizerTable';
import { OrganizerDisplayContext } from '../../../../contexts/OrganizerContext/OrganizerContext';
import LoadingOverlay from '../../../../ReusableFolder/LoadingOverlay';

function AdminLayout() {
  const { isOrganizer, isLoading } = useContext(OrganizerDisplayContext);

  return (
    <div className="relative p-4">
      {isLoading && <LoadingOverlay />}
      <OrganizerTable data={isOrganizer} />
    </div>
  );
}

export default AdminLayout;
