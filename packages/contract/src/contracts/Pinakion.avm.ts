// contracts
import { ACL } from '@app/contracts/ACL.avm';

// types
import type { IARC0072TokenData } from '@app/types';

export class Pinakion extends ACL {
  // global storage
  public description = GlobalStateKey<string>({ key: 'd' });
  public ids = GlobalStateKey<uint64>();
  public name = GlobalStateKey<string>({ key: 'n' });
  // box storage
  public tokens = BoxMap<uint64, IARC0072TokenData>({ allowPotentialCollisions: true });

  /**
   * life-cycle methods
   */

  public createApplication(): void {
    this.ids.value = 0;
    this.name.value = 'Kibisis Pinakion';
    this.description.value = 'The official Kibisis identity token.';
  }

  /**
   * private methods
   */

  /**
   * Creates a stringified JSON of the metadata based on the token.
   *
   * @param token The token data.
   * @returns The stringified metadata.
   * @private
   */
  private _createMetadataJSON(token: IARC0072TokenData): string {
    const properties =
      '{"deviceID":"' +
      token.deviceID +
      '","founder":' +
      (token.founder ? 'true' : 'false') +
      ',"version":' +
      extract3('0123456789', token.version, 1) +
      '}';

    return (
      '{"name":"' +
      this.name.value +
      '","description":"' +
      this.description.value +
      '","properties":' +
      properties +
      '}'
    );
  }

  /**
   * public methods
   */

  /**
   * Returns the address of the current owner of the pinakion with the given ID.
   *
   * @param id The ID of the pinakion.
   * @returns The current owner of the pinakion.
   * @public
   */
  @abi.readonly
  public arc72_ownerOf(id: uint64): Address {
    if (!this.tokens(id).exists) {
      return Address.zeroAddress;
    }

    return this.tokens(id).value.owner;
  }

  /**
   * Gets the pinakion metadata as a JSON data URI.
   *
   * @param id The ID of the pinakion.
   * @returns The pinakion metadata as a JSON data URI, or an empty string.
   * @public
   */
  @abi.readonly
  public arc72_tokenURI(id: uint64): string {
    let token: IARC0072TokenData;

    if (!this.tokens(id).exists) {
      return '';
    }

    token = this.tokens(id).value;

    return 'data:application/json;utf8,' + this._createMetadataJSON(token);
  }

  /**
   * Gets the total number of minted pinakia.
   *
   * @returns The total number of pinakia.
   * @public
   */
  @abi.readonly
  public arc72_totalSupply(): uint64 {
    return this.ids.value;
  }

  /**
   * Mints a new token.
   *
   * @param to - The address the token is minted to.
   * @param founder - Whether the token is a founder pinakion.
   * @param deviceID - The device ID this pinakion belongs to.
   * @returns The ID of the pinakion.
   * @public
   */
  public mint(to: Address, founder: boolean, deviceID: string): uint64 {
    let id: uint64;

    assert(this._isAdmin(this.txn.sender), 'sender is not authorized to mint a token');

    id = this.ids.value;

    // add the token
    this.tokens(id).value = {
      controller: Address.zeroAddress,
      deviceID: deviceID,
      founder: founder,
      owner: to,
      version: 1,
    };
    this.ids.value = id + 1; // increment the ids for the next mint

    return id;
  }
}
