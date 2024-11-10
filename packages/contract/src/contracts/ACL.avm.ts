import { Contract } from '@algorandfoundation/tealscript';

/**
 * Manages the access control for the contract.
 *
 * Roles are defined by integers and are as follows:
 * * Admins: 1
 */
export class ACL extends Contract {
  admins = BoxMap<Address, uint64>({ prefix: 'acl:' });

  /**
   * private methods
   */

  /**
   * Checks if a given address has admin rights.
   *
   * @param address
   * @returns true if the address is an admin, false otherwise.
   */
  private isAdmin(address: Address): boolean {
    return this.admins(address).exists && this.admins(address).value === 1;
  }

  /**
   * public methods
   */

  /**
   * Removes a given address from the ACL. Sender must be an admin.
   *
   * @param address The address to remove.
   * @throws {Error} If the sender is not an admin.
   */
  acl_remove(address: Address): void {
    if (!this.isAdmin(this.txn.sender)) {
      throw Error('address "' + this.txn.sender + '" is not authorized');
    }

    this.admins(address).delete();
  }

  /**
   * Sets a given address with the specified role. Sender must be an admin.
   *
   * @param address The address to set.
   * @param role The role to give.
   * @throws {Error} If the sender is not an admin.
   */
  acl_set(address: Address, role: uint64): void {
    if (!this.isAdmin(this.txn.sender)) {
      throw Error('address "' + this.txn.sender + '" is not authorized');
    }

    this.admins(address).value = role;
  }
}
