import { store } from '../app/store';

export function hasPermission(permission: string): boolean {
  const user = store.getState().auth.user;
  if (!user || !Array.isArray(user.permissions) || !Array.isArray(user.roles)) return false;

  // If user has ROLE_COMPANY, always return true
  if (user.roles.includes('ROLE_COMPANY')) return true;

  // Otherwise, check permissions by name
  return user.permissions.some((perm: { name: string }) => perm.name === permission);
}
