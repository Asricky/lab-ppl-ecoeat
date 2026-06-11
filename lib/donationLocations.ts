/**
 * Katalog lokasi penerima donasi (contoh kurasi gaya open data / komunitas OSM).
 * Koordinat perkiraan untuk demo; produksi bisa mengganti dengan Overpass API / dataset resmi.
 */

export type DonationCategoryKey =
  | 'panti-asuhan'
  | 'panti-jompo'
  | 'shelter'
  | 'food-bank'
  | 'dapur-sosial'
  | 'lembaga-sosial';

export type DonationLocation = {
  id: number;
  name: string;
  /** Label kategori tampilan (ID) */
  category: string;
  categoryKey: DonationCategoryKey;
  distanceStr: string;
  address: string;
  description: string;
  image: string;
  coords: [number, number];
  phone: string;
  /** Mitra yang muncul di wizard tab Donate */
  forWizard: boolean;
  /** Sumber / lisensi data (transparansi open data) */
  dataSource: string;
};

export const DONATION_CATEGORY_OPTIONS: { key: DonationCategoryKey | 'all'; label: string }[] = [
  { key: 'all', label: 'Semua kategori' },
  { key: 'panti-asuhan', label: 'Panti asuhan' },
  { key: 'panti-jompo', label: 'Panti jompo / Lansia' },
  { key: 'shelter', label: 'Shelter / Panti tunawisma' },
  { key: 'food-bank', label: 'Food bank' },
  { key: 'dapur-sosial', label: 'Dapur sosial' },
  { key: 'lembaga-sosial', label: 'Lembaga kesejahteraan sosial' },
];

export const REFERENCE_LOCATION_PRESETS: {
  id: string;
  label: string;
  coords: [number, number];
}[] = [
  { id: 'jakarta', label: 'Jakarta Pusat', coords: [-6.1944, 106.8229] },
  { id: 'bandung', label: 'Bandung', coords: [-6.9175, 107.6191] },
  { id: 'surabaya', label: 'Surabaya', coords: [-7.2575, 112.7521] },
  { id: 'yogyakarta', label: 'Yogyakarta', coords: [-7.7956, 110.3695] },
  { id: 'semarang', label: 'Semarang', coords: [-6.9667, 110.4167] },
  { id: 'medan', label: 'Medan', coords: [3.5952, 98.6722] },
  { id: 'makassar', label: 'Makassar', coords: [-5.1477, 119.4327] },
  { id: 'denpasar', label: 'Denpasar', coords: [-8.65, 115.2164] },
];

/** Radius dalam km; 0 = tanpa batas (seluruh Indonesia) */
export const RADIUS_OPTIONS: { value: number; label: string }[] = [
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
  { value: 250, label: '250 km' },
  { value: 500, label: '500 km' },
  { value: 0, label: 'Tanpa batas (nasional)' },
];

export const DONATION_LOCATIONS: DonationLocation[] = [
  {
    id: 1,
    name: 'City Food Bank',
    category: 'Food bank',
    categoryKey: 'food-bank',
    distanceStr: '—',
    address: 'Jl. Kemang Raya No. 120, Jakarta Selatan',
    description:
      'Pusat distribusi pangan perkotaan; contoh fasilitas sejenis amenity=social_facility di OSM.',
    image: 'https://images.unsplash.com/photo-1593113565694-c6f8716c0296?w=400&q=80',
    coords: [-6.2, 106.816666],
    phone: '+62 812-3456-7890',
    forWizard: true,
    dataSource: 'Curated sample (OSM tagging: social_facility / food bank)',
  },
  {
    id: 2,
    name: 'Green Valley Kitchen',
    category: 'Dapur sosial',
    categoryKey: 'dapur-sosial',
    distanceStr: '—',
    address: 'Jl. Dago No. 45, Bandung',
    description: 'Dapur komunitas untuk makanan bergizi — setara community kitchen open data.',
    image: 'https://images.unsplash.com/photo-1574314050516-e56593a1fa06?w=400&q=80',
    coords: [-6.914744, 107.60981],
    phone: '+62 856-1111-2222',
    forWizard: true,
    dataSource: 'Curated sample',
  },
  {
    id: 3,
    name: 'Hope Harbor Shelter',
    category: 'Shelter',
    categoryKey: 'shelter',
    distanceStr: '—',
    address: 'Jl. Harbor Indah No. 202, Jakarta Utara',
    description: 'Shelter dengan akses pangan — kategori shelter / social_facility.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    coords: [-6.22, 106.836666],
    phone: '+62 813-9999-8888',
    forWizard: true,
    dataSource: 'Curated sample',
  },
  {
    id: 4,
    name: 'Panti Asuhan Kasih Bunda',
    category: 'Panti asuhan',
    categoryKey: 'panti-asuhan',
    distanceStr: '—',
    address: 'Jl. Manyar Kertoarjo V, Surabaya',
    description: 'Panti asuhan anak — contoh organisasi sosial di permukiman perkotaan.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80',
    coords: [-7.265, 112.745],
    phone: '+62 811-2000-301',
    forWizard: false,
    dataSource: 'Demo coords; verify via OpenStreetMap / registri pemda',
  },
  {
    id: 5,
    name: 'Panti Jompo Harapan Sejahtera',
    category: 'Panti jompo / Lansia',
    categoryKey: 'panti-jompo',
    distanceStr: '—',
    address: 'Jl. Kaliurang km 8, Sleman, DI Yogyakarta',
    description: 'Layanan lansia dan rehabilitasi sosial.',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&q=80',
    coords: [-7.736, 110.408],
    phone: '+62 274-889-100',
    forWizard: false,
    dataSource: 'Demo coords; model amenity=social_facility + social_facility=nursing_home',
  },
  {
    id: 6,
    name: 'Shelter Malam Peduli',
    category: 'Shelter',
    categoryKey: 'shelter',
    distanceStr: '—',
    address: 'Jl. Sisingamangaraja, Medan',
    description: 'Shelter malam dan konseling untuk tunawisma.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    coords: [3.589, 98.658],
    phone: '+62 61-4500-900',
    forWizard: false,
    dataSource: 'Demo coords',
  },
  {
    id: 7,
    name: 'Food Bank Nusantara Hub',
    category: 'Food bank',
    categoryKey: 'food-bank',
    distanceStr: '—',
    address: 'Jl. Letjen S. Parman, Jakarta Barat',
    description: 'Hub distribusi surplus pangan ke mitra LKS.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    coords: [-6.1783, 106.7648],
    phone: '+62 821-3000-440',
    forWizard: false,
    dataSource: 'Demo coords',
  },
  {
    id: 8,
    name: 'Dapur Bergizi Masyarakat',
    category: 'Dapur sosial',
    categoryKey: 'dapur-sosial',
    distanceStr: '—',
    address: 'Jl. Pandanaran, Semarang',
    description: 'Dapur umum dan program makan bergizi untuk keluarga rentan.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80',
    coords: [-6.983, 110.41],
    phone: '+62 24-7600-120',
    forWizard: false,
    dataSource: 'Demo coords',
  },
  {
    id: 9,
    name: 'Panti Asuhan Al-Firdaus',
    category: 'Panti asuhan',
    categoryKey: 'panti-asuhan',
    distanceStr: '—',
    address: 'Jl. Ijen, Malang',
    description: 'Panti asuhan dan pendidikan karakter.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
    coords: [-7.962, 112.618],
    phone: '+62 341-550-200',
    forWizard: false,
    dataSource: 'Demo coords',
  },
  {
    id: 10,
    name: 'LKS Bhakti Luhur Bali',
    category: 'Lembaga kesejahteraan sosial',
    categoryKey: 'lembaga-sosial',
    distanceStr: '—',
    address: 'Jl. Mahendradatta, Denpasar',
    description: 'LKS penyaluran bantuan sosial dan koordinasi donasi pangan.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    coords: [-8.631, 115.198],
    phone: '+62 361-900-880',
    forWizard: false,
    dataSource: 'Demo coords',
  },
];

const DEFAULT_LKS_IMAGE = DONATION_LOCATIONS[0]?.image ?? '';

/** Nama penerima lawas / variasi → nama kanonikal di katalog */
const RECIPIENT_NAME_ALIASES: Record<string, string> = {
  'green valley community kitchen': 'Green Valley Kitchen',
};

export type ResolvedLksDisplay = {
  image: string;
  category: string | null;
  address: string | null;
};

/**
 * Gambar & info LKS untuk UI (ringkasan transaksi), dari nama penerima + katalog.
 */
export function resolveLksMetaForRecipient(
  recipientName: string,
  storedImage?: string
): ResolvedLksDisplay {
  const raw = recipientName.trim();
  if (!raw) {
    return {
      image: storedImage || DEFAULT_LKS_IMAGE,
      category: null,
      address: null,
    };
  }
  const key = raw.toLowerCase();
  const canonical =
    RECIPIENT_NAME_ALIASES[key] ??
    DONATION_LOCATIONS.find((l) => l.name.toLowerCase() === key)?.name ??
    raw;

  const byExact = DONATION_LOCATIONS.find(
    (l) => l.name.toLowerCase() === canonical.toLowerCase()
  );
  if (byExact) {
    return {
      image: byExact.image,
      category: byExact.category,
      address: byExact.address,
    };
  }

  const byPartial = DONATION_LOCATIONS.find((l) => {
    const n = l.name.toLowerCase();
    return key.includes(n) || n.includes(key);
  });
  if (byPartial) {
    return {
      image: byPartial.image,
      category: byPartial.category,
      address: byPartial.address,
    };
  }

  return {
    image: storedImage || DEFAULT_LKS_IMAGE,
    category: null,
    address: null,
  };
}
