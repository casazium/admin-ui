import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

interface License {
  key: string;
  tier: string;
  issued_to: string;
  expires_at: string;
}

export default function LicenseList() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with your actual API call
    fetch(`${import.meta.env.VITE_LICENSE_API_URL}/list-licenses`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_LICENSE_ADMIN_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.licenses)) {
          setLicenses(data.licenses);
        } else {
          console.error('Unexpected response:', data);
          setLicenses([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load licenses', err);
      });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Licenses</h1>
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[240px]">Key</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Issued To</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((license) => (
              <TableRow key={license.key}>
                <TableCell className="font-mono text-xs">
                  {license.key}
                </TableCell>
                <TableCell>{license.tier}</TableCell>
                <TableCell>
                  {license.issued_to || (
                    <em className="text-muted-foreground">—</em>
                  )}
                </TableCell>
                <TableCell>
                  {license.expires_at
                    ? new Date(license.expires_at).toLocaleDateString()
                    : 'Never'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/license/${encodeURIComponent(license.key)}`)
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      window.open(
                        `${
                          import.meta.env.VITE_LICENSE_API_URL
                        }/export-license/${license.key}`,
                        '_blank'
                      );
                    }}
                  >
                    Export
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {licenses.length === 0 && (
          <div className="text-center text-sm text-muted-foreground p-6">
            No licenses found.
          </div>
        )}
      </div>
    </div>
  );
}
