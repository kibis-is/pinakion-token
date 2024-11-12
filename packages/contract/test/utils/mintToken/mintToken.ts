import { ABIUintType } from 'algosdk';
import { v4 as uuid } from 'uuid';

// types
import type { IResult as ITransferEvent } from '@test/utils/decodeTransferEvent';
import type { IOptions } from './types';

// utils
import decodeTransferEvent from '@test/utils/decodeTransferEvent';

/**
 * Convenience function that mints a new token and parses the token ID.
 * @param {IOptions} options - The contract client, the recipient's address and the extra parameters
 * @returns {bigint} The ID of the newly minted token.
 * @throws {Error} If no token ID is returned.
 */
export default async function mintToken({ client, deviceID = uuid(), founder = true, to }: IOptions): Promise<bigint> {
  const result = await client.mint({
    to,
    founder,
    deviceID,
  });
  let event: ITransferEvent;

  if (!result.confirmation?.logs) {
    throw new Error('no result returned in minting');
  }

  event = decodeTransferEvent(
    result.confirmation.logs[0].slice(4) // remove signature
  );

  return event.tokenId;
}
