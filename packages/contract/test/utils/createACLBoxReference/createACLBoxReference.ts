import { ABIType, type BoxReference } from 'algosdk';

// types
import type { IOptions } from './types';

/**
 * Convenience function that creates the box reference for the ACL contract members box.
 * @param {IOptions} options - The address of the member and the app ID.
 * @returns {BoxReference} An initialized box reference that can be used in a transaction.
 */
export default function createACLBoxReference({ address, appID }: IOptions): BoxReference {
  const keyType = ABIType.from('(address,string)');

  return {
    appIndex: appID,
    name: keyType.encode([address, 'acl']),
  };
}
