import React, { useContext } from 'react';
import OfficerTable from './OfficerTable';
import { OfficerDisplayContext } from '../../../../contexts/OfficerContext/OfficerContext';
import LoadingOverlay from '../../../../ReusableFolder/LoadingOverlay';

function AdminLayout() {
  const { isOfficer, isLoading } = useContext(OfficerDisplayContext);

  return (
    <div className="relative p-4">
      {isLoading && <LoadingOverlay />}
      <OfficerTable data={isOfficer} />
    </div>
  );
}

export default AdminLayout;
