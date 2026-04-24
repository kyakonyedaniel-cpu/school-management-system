"use client";

import { useState, useEffect } from 'react';
import { Save, School, Mail, Phone, MapPin } from 'lucide-react';

interface SchoolProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<SchoolProfile>({
    name: 'Your School Name',
    email: 'admin@school.ug',
    phone: '0772 XXX XXX',
    address: 'Kampala, Uganda'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('school_profile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('school_profile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">School Profile</h1>
          <p className="text-foreground/60">Manage your school settings</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${saved ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}>
          <Save size={18} />{saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg border p-6">
          <h3 className="font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">School Name</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg border p-6">
          <h3 className="font-semibold mb-4">System Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-foreground/60">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-foreground/60">Curriculum</span>
              <span className="font-medium">UNEB (Uganda)</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-foreground/60">Currency</span>
              <span className="font-medium">UGX</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-foreground/60">Classes</span>
              <span className="font-medium">P.1 - S.6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}