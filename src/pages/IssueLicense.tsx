import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function IssueLicense() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tier: '',
    productId: '',
    issuedTo: '',
    expiresAt: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      `${import.meta.env.VITE_LICENSE_API_URL}/issue-license`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_LICENSE_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          tier: form.tier,
          product_id: form.productId,
          issued_to: form.issuedTo,
          expires_at: form.expiresAt,
        }),
      }
    );

    if (!res.ok) {
      alert('Failed to issue license');
      return;
    }

    const { key } = await res.json();
    navigate(`/license/${encodeURIComponent(key)}`);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Card className="bg-card text-card-foreground shadow-md border border-border rounded-xl">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Issue New License</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="tier">Tier</Label>
                <Input
                  id="tier"
                  name="tier"
                  value={form.tier}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="issuedTo">Issued To</Label>
                <Input
                  id="issuedTo"
                  name="issuedTo"
                  value={form.issuedTo}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  value={form.expiresAt}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full">
                Issue License
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
