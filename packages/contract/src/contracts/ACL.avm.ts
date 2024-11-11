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
  protected members = BoxMap<IACLBoxKey, uint64>();

  /**
   * private methods
   */

  /**
   * Creates the member key used in the members box.
   *
   * @param address The address of the member.
   * @returns The member box key based on the address.
   * @private
   */
  private _createMemberKey(address: Address): IACLBoxKey {
    return {
      address: address,
      prefix: 'acl',
    };
  }

  /**
   * protected methods
   */

  /**
   * Checks if a given address has admin rights.
   *
   * @param address
   * @returns true if the address is an admin, false otherwise.
   * @protected
   */
  protected _isAdmin(address: Address): boolean {
    return (
      this.txn.sender === globals.creatorAddress ||
      (this.members(this._createMemberKey(address)).exists && this.members(this._createMemberKey(address)).value === 1)
    );
  }

  /**
   * public methods
   */

  /**
   * Removes a given address from the ACL. Sender must have "Admin" role.
   *
   * @param address The address to remove.
   * @public
   */
  public acl_remove(address: Address): void {
    assert(this._isAdmin(this.txn.sender), 'sender is not authorized');

    this.members(this._createMemberKey(address)).delete();
  }

  /**
   * Sets a given address with the specified role. Sender must have "Admin" role.
   *
   * @param address The address to set.
   * @param role The role to give.
   * @public
   */
  public acl_set(address: Address, role: uint64): void {
    assert(this._isAdmin(this.txn.sender), 'sender is not authorized');

    this.members(this._createMemberKey(address)).value = role;
  }
}
