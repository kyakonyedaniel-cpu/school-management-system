'use client';

import { useState, useEffect } from 'react';
import { Upload, Camera, Save, Eye, X, School } from 'lucide-react';
import { getSchoolProfile, saveSchoolProfile, SchoolProfile } from '@/lib/school';

export default function SchoolProfilePage() {
  const [profile, setProfile] = useState<SchoolProfile>(getSchoolProfile());
  const [logoPreview, setLogoPreview] = useState<string>(profile.logo);
  const [saved, setSaved] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) {
      alert('Logo must be less than 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoPreview(result);
      setProfile(prev => ({ ...prev, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveSchoolProfile({
      ...profile,
      logo: logoPreview,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const fresh = getSchoolProfile();
    setProfile(fresh);
    setLogoPreview(fresh.logo);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">School Profile</h1>
        <p className="text-foreground/60">Customize your school branding</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Logo Upload */}
        <div className="bg-background rounded-xl border p-6">
          <h2 className="font-semibold mb-4">School Logo</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30">
              {logoPreview ? (
                <img src={logoPreview} alt="School Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center p-4">
                  <School className="w-12 h-12 text-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-foreground/50">No logo uploaded</p>
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90">
              <Upload size={18} />
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <p className="text-xs text-foreground/50 text-center">PNG, JPG up to 500KB</p>
          </div>
        </div>

        {/* School Details */}
        <div className="lg:col-span-2 bg-background rounded-xl border p-6">
          <h2 className="font-semibold mb-4">School Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">School Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Your School Name"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">School Motto</label>
              <input
                type="text"
                value={profile.motto}
                onChange={(e) => setProfile(prev => ({ ...prev, motto: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Excellence in Education"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Established</label>
              <input
                type="text"
                value={profile.established}
                onChange={(e) => setProfile(prev => ({ ...prev, established: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="2020"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Head Teacher</label>
              <input
                type="text"
                value={profile.headTeacher}
                onChange={(e) => setProfile(prev => ({ ...prev, headTeacher: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <Save size={18} /> Save Changes
            </button>
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
              <X size={18} /> Reset
            </button>
            {saved && <span className="text-green-600 text-sm self-center">Saved successfully!</span>}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-background rounded-xl border p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Eye size={20} /> Branding Preview</h2>
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain" />
                ) : (
                  <School className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{profile.name}</h3>
                <p className="text-white/80 text-sm italic">&quot;{profile.motto}&quot;</p>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{profile.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium">{profile.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Address</span>
              <span className="font-medium">{profile.address}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Established</span>
              <span className="font-medium">{profile.established}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Head Teacher</span>
              <span className="font-medium">{profile.headTeacher}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}