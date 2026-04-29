export interface SchoolProfile {
  name: string;
  motto: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  established: string;
  headTeacher: string;
}

export const defaultSchoolProfile: SchoolProfile = {
  name: 'SmartSchool Pro',
  motto: 'Excellence in Education',
  logo: '',
  email: 'info@school.ug',
  phone: '+256 700 000 000',
  address: 'Kampala, Uganda',
  established: '2020',
  headTeacher: 'Head Teacher',
};

export function getSchoolProfile(): SchoolProfile {
  if (typeof window === 'undefined') return defaultSchoolProfile;
  const stored = localStorage.getItem('school_profile');
  if (stored) return JSON.parse(stored);
  return defaultSchoolProfile;
}

export function saveSchoolProfile(profile: Partial<SchoolProfile>): SchoolProfile {
  if (typeof window === 'undefined') return defaultSchoolProfile;
  const current = getSchoolProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem('school_profile', JSON.stringify(updated));
  return updated;
}