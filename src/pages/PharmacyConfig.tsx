
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PharmacyConfig = () => {
  const [pharmacyId, setPharmacyId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [config, setConfig] = useState({
    iosKeyId: '',
    issuerId: '',
    iosTeamId: '',
    appDisplayName: ''
  });

  const handlePharmacyIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(true);
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pharmacy Configuration</h1>
      
      {!showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Enter Pharmacy ID</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePharmacyIdSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pharmacyId">Pharmacy ID</Label>
                <Input
                  id="pharmacyId"
                  value={pharmacyId}
                  onChange={(e) => setPharmacyId(e.target.value)}
                  placeholder="Enter pharmacy ID"
                  required
                />
              </div>
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Continue
              </button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Configure Pharmacy {pharmacyId}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="iosKeyId">iOS Key ID</Label>
                <Input
                  id="iosKeyId"
                  name="iosKeyId"
                  value={config.iosKeyId}
                  onChange={handleConfigChange}
                  placeholder="Enter iOS Key ID"
                />
              </div>
              <div>
                <Label htmlFor="issuerId">Issuer ID</Label>
                <Input
                  id="issuerId"
                  name="issuerId"
                  value={config.issuerId}
                  onChange={handleConfigChange}
                  placeholder="Enter Issuer ID"
                />
              </div>
              <div>
                <Label htmlFor="iosTeamId">iOS Team ID</Label>
                <Input
                  id="iosTeamId"
                  name="iosTeamId"
                  value={config.iosTeamId}
                  onChange={handleConfigChange}
                  placeholder="Enter iOS Team ID"
                />
              </div>
              <div>
                <Label htmlFor="appDisplayName">App Display Name</Label>
                <Input
                  id="appDisplayName"
                  name="appDisplayName"
                  value={config.appDisplayName}
                  onChange={handleConfigChange}
                  placeholder="Enter App Display Name"
                />
              </div>
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Configuration
              </button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PharmacyConfig;
