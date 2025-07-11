
/**
 * Utility functions for handling Supabase data with proper TypeScript safety
 */

// Type guard to check if a valid user object
export function isValidUserData(userData: any): userData is { email: string; full_name: string | null } {
  return userData && 
    typeof userData === 'object' && 
    !('error' in userData) && 
    userData !== null &&
    typeof userData.email === 'string';
}

// Helper function to safely normalize user data from Supabase relationships
export function normalizeUserData(userData: any): { email: string; full_name: string | null } | null {
  if (isValidUserData(userData)) {
    return userData;
  }
  
  // Log para debug quando os dados não são válidos
  if (userData && typeof userData === 'object') {
    console.log("Dados de usuário inválidos:", userData);
  }
  
  return null;
}

// Helper function to safely get user display name or ID
export function getUserDisplay(userData: any, fallbackId: string): string {
  const normalizedUser = normalizeUserData(userData);
  if (normalizedUser?.full_name) {
    return normalizedUser.full_name;
  }
  if (normalizedUser?.email) {
    return normalizedUser.email;
  }
  return fallbackId;
}
