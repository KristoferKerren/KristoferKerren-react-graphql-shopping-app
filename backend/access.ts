import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// Add simplest access function:
export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions - check if user has permission
export const permissions = {
  /*
  canManageProducts({ session }: ListAccessArgs): boolean {
    return session?.data.role?.canManageProducts;
  },
  canSeeOtherUsers({ session }: ListAccessArgs): boolean {
    return session?.data.role?.canSeeOtherUsers;
  },
  ...
  */
  // Better way to do this:
  ...generatedPermissions,
};

// Rule based functions: for example: Admin should be able to delete product, but product owner should as well
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have permission?
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, check if its owner?
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageCart({ session })) {
      return true;
    }
    return { user: { id: session.itemId } };
  },
  canManagerOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageCart({ session })) {
      return true;
    }
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    return { id: session.itemId };
  },
};
