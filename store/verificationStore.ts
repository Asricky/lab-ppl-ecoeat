import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApplicantStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ApplicantTab = 'seller' | 'lks' | 'buyer' | 'kurir';

export interface Applicant {
  id: number;
  name: string;
  type: string;
  tab: ApplicantTab;
  file: string;
  date: string;
  time: string;
  status: ApplicantStatus;
  avatar: string;
  isErrorFile?: boolean;
  notes?: string;
}

export interface VerificationState {
  applicants: Applicant[];
  updateStatus: (id: number, status: ApplicantStatus) => void;
  updateNotes: (id: number, notes: string) => void;
}

export const INITIAL_APPLICANTS: Applicant[] = [
  // Sellers
  { id: 1, name: 'Green Valley Cooperatives', type: 'Organic Produce Supplier', tab: 'seller', file: 'NIB_2023_GV.pdf', date: 'Oct 24, 2023', time: '14:32 PM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Green+Valley&background=1A5632&color=fff', notes: '' },
  { id: 2, name: 'EcoHarvest Logistics', type: 'Fresh Food Distributor', tab: 'seller', file: 'Business_License.jpg', date: 'Oct 23, 2023', time: '09:15 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=EcoHarvest&background=409B5C&color=fff', notes: '' },
  { id: 3, name: 'Bumi Lestari Foundation', type: 'Community Kitchen Network', tab: 'seller', file: 'Tax_ID_2023.pdf', date: 'Oct 21, 2023', time: '11:00 AM', status: 'APPROVED', avatar: 'https://ui-avatars.com/api/?name=Bumi+Lestari&background=B0D5B5&color=1A5632', notes: 'Verified tax documentation matches governmental records.' },
  { id: 4, name: 'Urban Oasis Mart', type: 'Retail Store', tab: 'seller', file: 'Incomplete_File.zip', date: 'Oct 20, 2023', time: '16:45 PM', status: 'REJECTED', isErrorFile: true, avatar: 'https://ui-avatars.com/api/?name=Urban+Oasis&background=E2EAD8&color=1A5632', notes: 'Corrupt zip file uploaded. Requesting resubmission.' },
  { id: 13, name: 'Lestari Organic Farms', type: 'Local Farm Cooperative', tab: 'seller', file: 'NIB_Lestari_2026.pdf', date: 'Jun 18, 2026', time: '08:30 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Lestari+Farms&background=1A5632&color=fff', notes: '' },
  { id: 14, name: 'Sinar Baru Catering', type: 'Surplus Food Provider', tab: 'seller', file: 'Halal_Cert_SinarBaru.pdf', date: 'Jun 18, 2026', time: '11:15 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Sinar+Baru&background=409B5C&color=fff', notes: '' },
  
  // LKS
  { id: 5, name: 'Yayasan Peduli Pangan', type: 'Registered Food Bank', tab: 'lks', file: 'SK_Kemenkumham.pdf', date: 'Oct 25, 2023', time: '10:00 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Yayasan+Peduli&background=2563EB&color=fff', notes: '' },
  { id: 6, name: 'Dompet Dhuafa', type: 'National Charity', tab: 'lks', file: 'Akta_Yayasan_2023.pdf', date: 'Oct 24, 2023', time: '15:20 PM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Dompet+Dhuafa&background=3B82F6&color=fff', notes: '' },
  { id: 15, name: 'Panti Asuhan Al-Barokah', type: 'Registered Orphanage', tab: 'lks', file: 'Legal_Doc_AlBarokah.pdf', date: 'Jun 18, 2026', time: '09:00 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Al+Barokah&background=2563EB&color=fff', notes: '' },
  { id: 16, name: 'Rumah Singgah Sahabat', type: 'Community Help Shelter', tab: 'lks', file: 'SK_Kemenkumham_RSS.pdf', date: 'Jun 18, 2026', time: '14:20 PM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Rumah+Sahabat&background=3B82F6&color=fff', notes: '' },

  // Buyers
  { id: 7, name: 'Siti Aminah', type: 'Individual Buyer', tab: 'buyer', file: 'KTP_Siti_Aminah.pdf', date: 'Oct 25, 2023', time: '11:20 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=F59E0B&color=fff', notes: '' },
  { id: 8, name: 'Budi Santoso', type: 'Individual Buyer', tab: 'buyer', file: 'KTP_Budi_Santoso.pdf', date: 'Oct 24, 2023', time: '09:40 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=F59E0B&color=fff', notes: '' },
  { id: 9, name: 'Rina Kusuma', type: 'Individual Buyer', tab: 'buyer', file: 'KTP_Rina_Kusuma.pdf', date: 'Oct 22, 2023', time: '14:10 PM', status: 'APPROVED', avatar: 'https://ui-avatars.com/api/?name=Rina+Kusuma&background=10B981&color=fff', notes: 'ID photo matches register records.' },
  { id: 17, name: 'Andi Wijaya', type: 'Individual Buyer', tab: 'buyer', file: 'KTP_Andi_Wijaya.pdf', date: 'Jun 18, 2026', time: '10:10 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Andi+Wijaya&background=F59E0B&color=fff', notes: '' },
  { id: 18, name: 'Dewi Lestari', type: 'Individual Buyer', tab: 'buyer', file: 'KTP_Dewi_Lestari.pdf', date: 'Jun 18, 2026', time: '15:45 PM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Dewi+Lestari&background=F59E0B&color=fff', notes: '' },

  // Couriers
  { id: 10, name: 'Alex Green', type: 'Eco-Courier Partner', tab: 'kurir', file: 'SIM_Alex_Green.pdf', date: 'Oct 25, 2023', time: '08:30 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Alex+Green&background=EF4444&color=fff', notes: '' },
  { id: 11, name: 'Joko Susilo', type: 'Motorcycle Courier', tab: 'kurir', file: 'SIM_Joko_Susilo.pdf', date: 'Oct 24, 2023', time: '16:00 PM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Joko+Susilo&background=EF4444&color=fff', notes: '' },
  { id: 12, name: 'Rudi Hermawan', type: 'Electric Bike Courier', tab: 'kurir', file: 'SIM_Rudi_Hermawan.pdf', date: 'Oct 23, 2023', time: '13:15 PM', status: 'APPROVED', avatar: 'https://ui-avatars.com/api/?name=Rudi+Hermawan&background=10B981&color=fff', notes: 'Active driving license confirmed.' },
  { id: 19, name: 'Hendra Setiawan', type: 'Motorcycle Courier', tab: 'kurir', file: 'SIM_Hendra_Setiawan.pdf', date: 'Jun 18, 2026', time: '07:45 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Hendra+Setiawan&background=EF4444&color=fff', notes: '' },
  { id: 20, name: 'Siti Rahma', type: 'Electric Bike Courier', tab: 'kurir', file: 'SIM_Siti_Rahma.pdf', date: 'Jun 18, 2026', time: '13:00 PM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Siti+Rahma&background=EF4444&color=fff', notes: '' }
];

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set) => ({
      applicants: INITIAL_APPLICANTS,
      updateStatus: (id, status) =>
        set((state) => ({
          applicants: state.applicants.map((app) =>
            app.id === id ? { ...app, status } : app
          )
        })),
      updateNotes: (id, notes) =>
        set((state) => ({
          applicants: state.applicants.map((app) =>
            app.id === id ? { ...app, notes } : app
          )
        }))
    }),
    {
      name: 'ecoeat-verification-store',
      version: 2,
    }
  )
);
