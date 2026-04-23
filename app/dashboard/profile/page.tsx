"use client";

import { useState } from 'react';
import { Save, School, Mail, Phone, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [schoolEmail, setSchoolEmail] = useState('admin@school.ug');
  const [schoolPhone, setSchoolPhone] = useState('0772 XXX XXX');
  const [schoolAddress, setSchoolAddress] = useState('Kampala, Uganda');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">School Profile</h1>
          <p className="text-foreground/60">Manage your school settings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
          <Save size={18} />Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">School Name</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input type="email" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input type="tel" value={schoolPhone} onChange={(e) => setSchoolPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input type="text" value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
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