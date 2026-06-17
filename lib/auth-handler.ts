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
  },
  {
    email: "admin@ecoeat.com",
    password: "password",
    full_name: "Admin EcoEat",
    role: "admin",
    balance: 0
  }
];

// Helper to map backend roles to frontend roles
export const mapBackendRoleToFrontend = (role: string): Role => {
  if (role === 'courier') return 'kurir';
  if (role === 'lks') return 'lks-panti';
  if (role === 'admin') return 'admin';
  return role as Role;
};

// Helper to map frontend roles to backend roles
export const mapFrontendRoleToBackend = (role: Role): string => {
  if (role === 'kurir') return 'courier';
  if (role === 'lks-panti') return 'lks';
  if (role === 'admin') return 'admin';
  return role || 'buyer';
};

export const authHandler = {
  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.user) {
        const user: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: mapBackendRoleToFrontend(result.user.role),
          ecoPayBalance: result.user.ecoPayBalance,
          avatar: undefined,
        };
        return { user, token: result.token };
      }

      // If database login failed, check mock fallback
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (foundUser) {
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
      }

      throw new Error(result?.message || "Email atau password salah!");
    } catch (dbError: any) {
      // If network fails entirely or something throws, try mock fallback as absolute last resort
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (foundUser) {
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
      }
      throw new Error(dbError?.message || "Email atau password salah!");
    }
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
