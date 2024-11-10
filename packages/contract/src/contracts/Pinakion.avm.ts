// contracts
import { ACL } from '@app/contracts/ACL.avm';

// types
import type { IARC0072TokenData } from '@app/types';

export class Pinakion extends ACL {
  ids = GlobalStateKey<uint256>();
  tokens = BoxMap<uint256, IARC0072TokenData>({ allowPotentialCollisions: true });

  /**
   * life-cycle methods
   */

  createApplication(): void {
    this.ids.value = 0 as uint256;
  }

  /**
   * public methods
   */

  /**
   * Returns the address of the current owner of the Pinakion with the given ID.
   *
   * @param id The ID of the Pinakion.
   * @returns The current owner of the Pinakion.
   */
  @abi.readonly
  arc72_ownerOf(id: uint256): Address {
    if (!this.tokens(id).exists) {
      return Address.zeroAddress;
    }

    return this.tokens(id).value.owner;
  }

  /**
   * Gets the total number of minted Pinakia.
   */
  @abi.readonly
  arc72_totalSupply(): uint256 {
    return this.ids.value;
  }

  /**
   *
   * @param to
   * @param founder
   * @param deviceID
   */
  mint(to: Address, founder: boolean, deviceID: string): void {
    assert(this._isAdmin(this.txn.sender), 'sender is not authorized to mint a token');
    const id = this.ids.value;

    // add the token
    this.tokens(id).value = {
      controller: Address.zeroAddress,
      owner: to,
      metadataURI: 'https://github.com/algorandfoundation/ARCs',
    };
    this.ids.value = id + 1; // increment the ids for the next mint
  }
}
