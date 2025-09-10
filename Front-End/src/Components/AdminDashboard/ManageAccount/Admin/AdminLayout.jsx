import React, { useContext } from 'react';
import AdminTable from './AdminTable';
import { AdminDisplayContext } from '../../../../contexts/AdminContext/AdminContext';
import LoadingOverlay from '../../../../ReusableFolder/LoadingOverlay';

function AdminLayout() {
  const { isAdmin, isLoading } = useContext(AdminDisplayContext);

  return (
    <div className="relative p-4">
      {isLoading && <LoadingOverlay />}
      <AdminTable data={isAdmin} />
    </div>
  );
}

export default AdminLayout;
