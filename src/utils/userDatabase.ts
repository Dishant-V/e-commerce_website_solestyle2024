// User Database Management System
// Handles user registration, authentication, and data persistence

export interface UserData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  stylePreference?: string;
  registrationDate: string;
  lastLogin?: string;
  isActive: boolean;
  loginCount: number;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  orderHistory: string[]; // Array of order IDs
  wishlistItems: string[]; // Array of product IDs
}

class UserDatabaseManager {
  private readonly STORAGE_KEY = 'solestyle_users_database';
  private readonly CURRENT_USER_KEY = 'solestyle_current_user';
  private users: Map<string, UserData> = new Map();

  constructor() {
    this.loadUsersFromStorage();
  }

  // Load users from localStorage
  private loadUsersFromStorage(): void {
    try {
      const savedUsers = localStorage.getItem(this.STORAGE_KEY);
      if (savedUsers) {
        const usersArray = JSON.parse(savedUsers);
        this.users = new Map(usersArray.map((user: UserData) => [user.email, user]));
        console.log(`Loaded ${this.users.size} users from storage`);
      }
    } catch (error) {
      console.error('Error loading users from storage:', error);
      this.users = new Map();
    }
  }

  // Save users to localStorage
  private saveUsersToStorage(): void {
    try {
      const usersArray = Array.from(this.users.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usersArray));
      console.log(`Saved ${usersArray.length} users to storage`);
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  // Register new user
  registerUser(email: string, name: string, password: string, phone?: string): UserData {
    if (this.users.has(email)) {
      throw new Error('User already exists with this email');
    }

    const newUser: UserData = {
      id: Date.now().toString(),
      email,
      name,
      phone,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      loginCount: 1,
      preferences: {
        newsletter: true,
        notifications: true,
        theme: 'auto'
      },
      orderHistory: [],
      wishlistItems: []
    };

    this.users.set(email, newUser);
    this.saveUsersToStorage();
    this.setCurrentUser(newUser);

    console.log('New user registered:', { email, name, id: newUser.id });
    return newUser;
  }

  // Authenticate user login
  loginUser(email: string, password: string): UserData {
    const user = this.users.get(email);
    if (!user) {
      throw new Error('NEW_USER'); // Special error for new users
    }

    // Update login information
    user.lastLogin = new Date().toISOString();
    user.loginCount += 1;
    user.isActive = true;

    this.users.set(email, user);
    this.saveUsersToStorage();
    this.setCurrentUser(user);

    console.log('User logged in:', { email, loginCount: user.loginCount });
    return user;
  }

  // Set current logged-in user
  private setCurrentUser(user: UserData): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  // Get current logged-in user
  getCurrentUser(): UserData | null {
    try {
      const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Logout user
  logoutUser(): void {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  }

  // Update user data
  updateUser(email: string, updates: Partial<UserData>): UserData | null {
    const user = this.users.get(email);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(email, updatedUser);
    this.saveUsersToStorage();

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email === email) {
      this.setCurrentUser(updatedUser);
    }

    console.log('User updated:', { email, updates: Object.keys(updates) });
    return updatedUser;
  }

  // Update user style preference
  updateStylePreference(email: string, stylePreference: string): UserData | null {
    return this.updateUser(email, { stylePreference });
  }

  // Get all users (for admin panel)
  getAllUsers(): UserData[] {
    return Array.from(this.users.values()).sort((a, b) => 
      new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
    );
  }

  // Get user by email
  getUserByEmail(email: string): UserData | null {
    return this.users.get(email) || null;
  }

  // Get user by ID
  getUserById(id: string): UserData | null {
    return Array.from(this.users.values()).find(user => user.id === id) || null;
  }

  // Delete user
  deleteUser(email: string): boolean {
    const deleted = this.users.delete(email);
    if (deleted) {
      this.saveUsersToStorage();
      console.log('User deleted:', email);
    }
    return deleted;
  }

  // Get user statistics
  getUserStats() {
    const users = this.getAllUsers();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.isActive).length,
      newUsersThisMonth: users.filter(user => 
        new Date(user.registrationDate) > thirtyDaysAgo
      ).length,
      newUsersThisWeek: users.filter(user => 
        new Date(user.registrationDate) > sevenDaysAgo
      ).length,
      usersWithOrders: users.filter(user => user.orderHistory.length > 0).length,
      averageLoginCount: users.reduce((sum, user) => sum + user.loginCount, 0) / users.length || 0
    };
  }

  // Search users
  searchUsers(query: string): UserData[] {
    const searchTerm = query.toLowerCase();
    return this.getAllUsers().filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      (user.phone && user.phone.includes(searchTerm))
    );
  }

  // Export user data (for backup)
  exportUserData() {
    return {
      users: Array.from(this.users.values()),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }

  // Import user data (for restore)
  importUserData(data: any): boolean {
    try {
      if (data.users && Array.isArray(data.users)) {
        this.users = new Map(data.users.map((user: UserData) => [user.email, user]));
        this.saveUsersToStorage();
        console.log(`Imported ${data.users.length} users`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }

  // Clear all user data (for testing/reset)
  clearAllUsers(): void {
    this.users.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    console.log('All user data cleared');
  }
}

// Create singleton instance
export const userDatabase = new UserDatabaseManager();

// Export convenience functions
export const registerUser = (email: string, name: string, password: string, phone?: string) => 
  userDatabase.registerUser(email, name, password, phone);

export const loginUser = (email: string, password: string) => 
  userDatabase.loginUser(email, password);

export const getCurrentUser = () => userDatabase.getCurrentUser();
export const logoutUser = () => userDatabase.logoutUser();
export const updateUser = (email: string, updates: Partial<UserData>) => 
  userDatabase.updateUser(email, updates);

export const updateStylePreference = (email: string, stylePreference: string) => 
  userDatabase.updateStylePreference(email, stylePreference);

export const getAllUsers = () => userDatabase.getAllUsers();
export const getUserByEmail = (email: string) => userDatabase.getUserByEmail(email);
export const getUserById = (id: string) => userDatabase.getUserById(id);
export const getUserStats = () => userDatabase.getUserStats();
export const searchUsers = (query: string) => userDatabase.searchUsers(query);