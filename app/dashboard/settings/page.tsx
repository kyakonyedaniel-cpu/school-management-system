'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Download, Trash2, AlertTriangle, Database, Shield, Bell, Palette } from 'lucide-react';
import { exportAllData, downloadJSON, importData, clearAllData, getStorageUsage, formatBytes } from '@/lib/export';

interface SchoolSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  motto: string;
  logo: string;
}

const settings = ['General', 'Data', 'Notifications', 'Appearance'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [settings, setSettings] = useState<SchoolSettings>({
    name: 'Your School Name',
    email: 'admin@school.ug',
    phone: '0772 XXX XXX',
    address: 'Kampala, Uganda',
    motto: 'Education for Excellence',
    logo: ''
  });
  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ used: 0, keys: 0 });

  useEffect(() => {
    const stored = localStorage.getItem('school_profile');
    if (stored) setSettings(JSON.parse(stored));
    setStorageInfo(getStorageUsage());
  }, []);

  const handleSave = () => {
    localStorage.setItem('school_profile', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = exportAllData();
    const filename = `school_backup_${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(data, filename);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (importData(data)) {
          alert('Data imported successfully! Please refresh the page.');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    alert('All data cleared. Please refresh the page.');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-foreground/60">Manage your school settings and preferences</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${saved ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}>
          <Save size={18} />{saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64">
          <div className="bg-background rounded-lg border p-2 space-y-1">
            {['General', 'Data Management', 'Notifications', 'Appearance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                  activeTab === tab ? 'bg-primary text-white' : 'hover:bg-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-background rounded-lg border p-6">
          {activeTab === 'General' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">School Information</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">School Name</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">School Motto</label>
                    <input
                      type="text"
                      value={settings.motto}
                      onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Data Management' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">Local Storage Used</p>
                    <p className="text-sm text-foreground/60">{formatBytes(storageInfo.used)} across {storageInfo.keys} data sets</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Backup & Restore</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Download size={18} />Export All Data
                    </button>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      <Upload size={18} />Import Data
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>
                  </div>
                  <p className="text-sm text-foreground/60">
                    Export creates a JSON backup of all your data. Import restores data from a backup file.
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 text-red-600">Danger Zone</h3>
                {showClearConfirm ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 mb-3">Are you sure? This will delete ALL data permanently.</p>
                    <div className="flex gap-3">
                      <button onClick={handleClearData} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Yes, Delete Everything
                      </button>
                      <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 border border-border rounded-lg">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={18} />Clear All Data
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <h3 className="font-semibold">SMS Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">SMS Service</p>
                    <p className="text-sm text-foreground/60">Demo mode - configure MTN/Airtel for production</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Demo</span>
                </div>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">MTN API Key</label>
                    <input
                      type="password"
                      placeholder="Enter MTN API key"
                      className="w-full px-4 py-2 rounded-lg border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Airtel API Key</label>
                    <input
                      type="password"
                      placeholder="Enter Airtel API key"
                      className="w-full px-4 py-2 rounded-lg border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sender ID</label>
                    <input
                      type="text"
                      placeholder="e.g. SmartSchool"
                      className="w-full px-4 py-2 rounded-lg border border-border"
                    />
                  </div>
                </div>
                <p className="text-sm text-foreground/60">
                  Contact support to get API credentials for MTN MoMo or Airtel Money.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="space-y-6">
              <h3 className="font-semibold">Theme Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-primary rounded-lg bg-white text-center">
                    <div className="w-full h-20 bg-primary/10 rounded mb-2"></div>
                    <p className="font-medium">Light Theme</p>
                  </button>
                  <button className="p-4 border border-border rounded-lg text-center opacity-50">
                    <div className="w-full h-20 bg-slate-800 rounded mb-2"></div>
                    <p className="font-medium">Dark Theme</p>
                    <span className="text-xs text-foreground/60">(Coming Soon)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}