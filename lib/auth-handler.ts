import { Role, User } from '../store/authStore';

const MOCK_USERS = [
  {
    email: "lukas.buyer@ecoeat.com",
    password: "password",
    full_name: "Lukas Ricky Krisjatmiko",
    role: "buyer",
    balance: 500000
  },
  {
    email: "lukas.seller@ecoeat.com",
    password: "password",
    full_name: "Toko Penyelamat Makanan",
    role: "seller",
    balance: 0
  },
  {
    email: "lukas.kurir@ecoeat.com",
    password: "password",
    full_name: "Lukas Rider Express",
    role: "courier",
    balance: 0
  },
  {
    email: "lukas.lks@ecoeat.com",
    password: "password",
    full_name: "Panti Asuhan Mulia",
    role: "lks",
    balance: 0
  }
];

// Helper to map backend roles to frontend roles
export const mapBackendRoleToFrontend = (role: string): Role => {
  if (role === 'courier') return 'kurir';
  if (role === 'lks') return 'lks-panti';
  return role as Role;
};

// Helper to map frontend roles to backend roles
export const mapFrontendRoleToBackend = (role: Role): string => {
  if (role === 'kurir') return 'courier';
  if (role === 'lks-panti') return 'lks';
  return role || 'buyer';
};

export const authHandler = {
  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error("Email atau password salah!");
    }

    const token = "mock-jwt-token-" + Date.now();

    const user: User = {
      id: "mock-uuid-" + Date.now(),
      name: foundUser.full_name,
      email: foundUser.email,
      role: mapBackendRoleToFrontend(foundUser.role),
      ecoPayBalance: foundUser.balance,
      avatar: undefined,
    };

    return { user, token };
  },

  register: async (data: any, role: Role): Promise<{ user: User, token: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const token = "mock-jwt-token-" + Date.now();

    const user: User = {
      id: "mock-uuid-" + Date.now(),
      name: data.name || data.businessName || "New User",
      email: data.email,
      role: role,
      ecoPayBalance: 0,
      avatar: undefined,
    };

    return { user, token };
  }
};
