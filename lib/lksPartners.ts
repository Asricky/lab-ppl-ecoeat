/**
 * Mitra LKS untuk wizard donasi — subset lokasi dengan forWizard = true.
 * Katalog lengkap: `DONATION_LOCATIONS` di `donationLocations.ts`.
 */

import {
  DONATION_LOCATIONS,
  type DonationLocation,
} from '@/lib/donationLocations';

export type LksPartner = DonationLocation;

export const LKS_PARTNERS: LksPartner[] = DONATION_LOCATIONS.filter((l) => l.forWizard);

export const ALL_DONATION_LOCATIONS = DONATION_LOCATIONS;
