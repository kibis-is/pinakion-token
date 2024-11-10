import { Contract } from '@algorandfoundation/tealscript';

// types
import type { IACLBoxKey } from '@app/types';

/**
 * Manages the access control for the contract.
 *
 * Roles are defined by integers and are as follows:
 * * Admins: 1
 */
export class ACL extends Contract {
  _members = BoxMap<IACLBoxKey, uint64>();

  /**
   * private methods
   */

  private _acl_createMemberKey(address: Address): IACLBoxKey {
    return {
      address: address,
      prefix: 'acl',
    };
  }

  /**
   * Checks if a given address has admin rights.
   *
   * @param address
   * @returns true if the address is an admin, false otherwise.
   */
  private _acl_isAdmin(address: Address): boolean {
    return (
      this.txn.sender === globals.creatorAddress ||
      (this._members(this._acl_createMemberKey(address)).exists &&
        this._members(this._acl_createMemberKey(address)).value === 1)
    );
  }

  /**
   * public methods
   */

  /**
   * Removes a given address from the ACL. Sender must be an admin.
   *
   * @param address The address to remove.
   */
  acl_remove(address: Address): void {
    assert(this._acl_isAdmin(this.txn.sender), 'sender is not authorized');

    this._members(this._acl_createMemberKey(address)).delete();
  }

  /**
   * Sets a given address with the specified role. Sender must be an admin.
   *
   * @param address The address to set.
   * @param role The role to give.
   */
  acl_set(address: Address, role: uint64): void {
    assert(this._acl_isAdmin(this.txn.sender), 'sender is not authorized');

    this._members(this._acl_createMemberKey(address)).value = role;
  }
}
