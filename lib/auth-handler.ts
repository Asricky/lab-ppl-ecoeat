import { Role, User } from '../store/authStore';

export const authHandler = {
  login: async (email: string, password: string):Promise<{user: User, token: string}> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let role: Role = 'buyer';
    if (email.includes('admin')) role = 'admin';
    else if (email.includes('seller') || email.includes('business')) role = 'seller';
    else if (email.includes('kurir') || email.includes('courier')) role = 'kurir';

    const user: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      email,
      role,
      ecoPayBalance: Math.floor(Math.random() * 500000), // Random balance for simulation
    };

    return {
      user,
      token: `mock_token_${Date.now()}`,
    };
  },

  register: async (data: any, role: Role):Promise<{user: User, token: string}> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name || data.email.split('@')[0],
      email: data.email,
      role,
      ecoPayBalance: 0,
    };

    return {
      user,
      token: `mock_token_${Date.now()}`,
    };
  }
}
