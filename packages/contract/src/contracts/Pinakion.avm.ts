// contracts
import { ACL } from '@app/contracts/ACL.avm';

// types
import type { IARC0072TokenData } from '@app/types';

export class Pinakion extends ACL {
  // global storage
  public description = GlobalStateKey<string>({ key: 'd' });
  public ids = GlobalStateKey<uint256>();
  public name = GlobalStateKey<string>({ key: 'n' });
  // box storage
  public tokens = BoxMap<uint256, IARC0072TokenData>({ allowPotentialCollisions: true });
  // events
  arc72_Transfer = new EventLogger<{
    from: Address;
    to: Address;
    tokenId: uint256;
  }>();

  /**
   * life-cycle methods
   */

  public createApplication(): void {
    this.ids.value = 0 as uint256;
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
      token.version.toString() +
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
   * @param tokenId The ID of the pinakion.
   * @returns The current owner of the pinakion.
   * @public
   */
  @abi.readonly
  public arc72_ownerOf(tokenId: uint256): Address {
    if (!this.tokens(tokenId).exists) {
      return Address.zeroAddress;
    }

    return this.tokens(tokenId).value.owner;
  }

  /**
   * Returns the pinakion token index amongst all pinakion indexes.
   *
   * @param index The index of the pinakion.
   * @returns The pinakion index amongst all pinakion indexes.
   * @public
   */
  @abi.readonly
  public arc72_tokenByIndex(index: uint256): uint256 {
    return index;
  }

  /**
   * Gets the pinakion metadata as a JSON data URI.
   *
   * @param tokenId The ID of the pinakion.
   * @returns The pinakion metadata as a JSON data URI, or an empty string.
   * @public
   */
  @abi.readonly
  public arc72_tokenURI(tokenId: uint256): string {
    let token: IARC0072TokenData;

    if (!this.tokens(tokenId).exists) {
      return '';
    }

    token = this.tokens(tokenId).value;

    return 'data:application/json;utf8,' + this._createMetadataJSON(token);
  }

  /**
   * Gets the total number of minted pinakia.
   *
   * @returns The total number of pinakia.
   * @public
   */
  @abi.readonly
  public arc72_totalSupply(): uint256 {
    return this.ids.value;
  }

  public arc72_transferFrom(from: Address, to: Address, tokenId: uint256): void {
    let owner: Address;

    assert(this.tokens(tokenId).exists, 'token does not exist');

    owner = this.tokens(tokenId).value.owner;

    assert(from === owner, 'from address must be the owner of the token');
    assert(this.txn.sender === owner, 'from address must be the owner or approved');

    // transfer the token and reset the approved controller
    this.tokens(tokenId).value.owner = to;
    this.tokens(tokenId).value.controller = Address.zeroAddress;

    // emit a transfer event
    this.arc72_Transfer.log({
      from: from,
      to: to,
      tokenId: tokenId,
    });
  }

  /**
   * Mints a new token. Requires the sender to have an "Admin" role.
   *
   * @param to - The address the token is minted to.
   * @param founder - Whether the token is a founder pinakion.
   * @param deviceID - The device ID this pinakion belongs to.
   * @returns The ID of the pinakion.
   * @public
   */
  public mint(to: Address, founder: boolean, deviceID: string): uint256 {
    let id: uint256;

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

    // emit a transfer event
    this.arc72_Transfer.log({
      from: Address.zeroAddress,
      to: to,
      tokenId: id,
    });

    this.ids.value = id + 1; // increment the ids for the next mint

    return id;
  }
}
