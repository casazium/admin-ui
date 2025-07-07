import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type License = {
  key: string;
  product_id: string;
  tier: string;
  issued_to: string;
  expires_at: string | null;
  status: string; // 'active' or 'revoked'
};

export default function LicenseList() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLicenses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LICENSE_API_URL}/list-licenses`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_LICENSE_ADMIN_TOKEN}`,
          },
        }
      );
      const data = await res.json();
      setLicenses(data.licenses ?? []);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleToggleRevoke = async (key: string, currentlyRevoked: boolean) => {
    const action = currentlyRevoked ? 'unrevoke' : 'revoke';
    if (!confirm(`Are you sure you want to ${action} license "${key}"?`))
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LICENSE_API_URL}/revoke-license`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_LICENSE_ADMIN_TOKEN}`,
          },
          body: JSON.stringify({ key, revoked: !currentlyRevoked }),
        }
      );

      if (!res.ok) throw new Error(`Failed to ${action} license`);
      await fetchLicenses();
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Licenses</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Issued To</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => {
              const revoked = license.status === 'revoked';
              return (
                <tr
                  key={license.key}
                  className={`border-t transition ${
                    revoked ? 'bg-red-50 text-gray-400' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/license/${encodeURIComponent(license.key)}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {license.key}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{license.product_id}</td>
                  <td className="px-4 py-3">{license.tier}</td>
                  <td className="px-4 py-3">{license.issued_to}</td>
                  <td className="px-4 py-3">
                    {license.expires_at || (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {revoked ? 'Revoked' : 'Active'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleRevoke(license.key, revoked)}
                      className="text-red-600 hover:underline"
                    >
                      {revoked ? 'Unrevoke' : 'Revoke'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {licenses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No licenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
