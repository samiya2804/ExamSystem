import type { FC } from 'react';
import AdminNotificationForm from '@/components/admin/AdminNotificationForm';

const AdminNotificationsPage: FC = () => {

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminNotificationForm />
    </div>
  );
};

export default AdminNotificationsPage;