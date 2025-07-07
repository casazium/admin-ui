import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

type License = {
  key: string;
  product_id: string;
  tier: string;
  issued_to: string;
  expires_at: string | null;
};

export default function LicenseDetail() {
  const { key } = useParams();
  const [license, setLicense] = useState<License | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!key) return;

    fetch(`${import.meta.env.VITE_LICENSE_API_URL}/export-license/${key}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_LICENSE_ADMIN_TOKEN}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('License not found');
        }
        return res.json();
      })
      .then((data) => {
        const lic = data.license ?? data;
        setLicense(lic);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  if (loading) return <div>Loading license...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!license) return <div>No license data found.</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">License Detail</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(license, null, 2)}
      </pre>
    </div>
  );
}
