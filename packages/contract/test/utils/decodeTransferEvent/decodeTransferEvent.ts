import { ABIAddressType, ABIUintType } from 'algosdk';

// types
import type { IResult } from './types';

/**
 * Decodes the transfer emitted when a token has been transferred.
 * @param {Uint8Array} data - The event data that will be present in the log.
 * @returns {IResult} The decoded transfer event data.
 */
export default function decodeTransferEvent(data: Uint8Array): IResult {
  let fromBytes: Uint8Array;
  let offset = 0;
  let toBytes: Uint8Array;
  let tokenIdBytes: Uint8Array;

  // decode the from address 0 - 32 bytes (32 bytes for address)
  fromBytes = data.slice(offset, offset + 32);
  offset += 32;

  // decode the to address 32 - 64 bytes (32 bytes for address)
  toBytes = data.slice(offset, offset + 32);
  offset += 32;

  // decode the tokenId 64 bytes (32 bytes for uint256)
  tokenIdBytes = data.slice(offset, offset + 32);

  return {
    from: new ABIAddressType().decode(fromBytes),
    to: new ABIAddressType().decode(toBytes),
    tokenId: new ABIUintType(256).decode(tokenIdBytes),
  };
}
