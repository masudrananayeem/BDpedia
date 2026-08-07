import { useParams } from 'react-router-dom';
import AdminSectionManager from './AdminSectionManager';
import { sectionConfigs } from './sectionConfigs';

export default function AdminSectionPage() {
  const { sectionKey } = useParams();
  const config = sectionConfigs.find((s) => s.key === sectionKey);

  if (!config) return <p className="text-muted">Section not found.</p>;
  return <AdminSectionManager config={config} />;
}
