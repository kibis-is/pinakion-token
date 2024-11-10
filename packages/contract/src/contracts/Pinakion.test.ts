import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import type { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import type { AppReference } from '@algorandfoundation/algokit-utils/types/app';
import { type Account, generateAccount } from 'algosdk';
import { v4 as uuid } from 'uuid';

// client
import { PinakionClient } from '@client';

// utils
import createACLBoxReference from '@test/utils/createACLBoxReference';
import isZeroAddress from '@test/utils/isZeroAddress';

describe('Pinakion', () => {
  const fixture = algorandFixture();
  let appReference: AppReference;
  let client: PinakionClient;
  let creatorAccount: Account & TransactionSignerAccount;

  beforeEach(async () => {
    await fixture.beforeEach();

    creatorAccount = fixture.context.testAccount;
    client = new PinakionClient(
      {
        id: 0,
        resolveBy: 'id',
        sender: creatorAccount,
      },
      fixture.algorand.client.algod
    );

    // deploy the contract
    await client.create.createApplication({});
    // fund the account
    await client.appClient.fundAppAccount({
      amount: AlgoAmount.Algos(1),
      sender: creatorAccount,
    });

    appReference = await client.appClient.getAppReference();
  });

  describe('arc72_ownerOf', () => {
    it(`should return a zero address if the token doesn't exist`, async () => {
      const result = await client.arc72OwnerOf({
        id: 100,
      });
      const owner = result.return?.valueOf();

      if (!owner) {
        throw new Error('no result returned');
      }

      expect(isZeroAddress(owner)).toBe(true);
    });
  });

  describe('arc72_totalSupply', () => {
    it('should default to zero', async () => {
      const totalSupply = await client.arc72TotalSupply({});

      expect(totalSupply.return?.valueOf()).toEqual(BigInt(0));
    });
  });

  describe('mint', () => {
    it('should fail if the sender is not the creator', async () => {
      const address = generateAccount().addr;
      const nonAdminAccount = await fixture.context.generateAccount({
        initialFunds: AlgoAmount.Algos(10),
      });
      const _client = new PinakionClient(
        {
          id: appReference.appId,
          resolveBy: 'id',
          sender: nonAdminAccount,
        },
        fixture.algorand.client.algod
      );

      try {
        await _client.mint(
          {
            to: address,
            founder: true,
            deviceID: uuid(),
          },
          {
            boxes: [
              createACLBoxReference({
                address: nonAdminAccount.addr,
                appID: appReference.appId as number,
              }),
            ],
          }
        );
      } catch (error) {
        expect((error as any).traces[0].message).toContain('assert failed');
      }
    });

    it('should mint a new token', async () => {
      // arrange
      const address = generateAccount().addr;
      let totalSupply = await client.arc72TotalSupply({});

      expect(totalSupply.return?.valueOf()).toEqual(BigInt(0));

      // act
      await client.mint({
        to: address,
        founder: true,
        deviceID: uuid(),
      });

      // assert
      totalSupply = await client.arc72TotalSupply({});

      expect(totalSupply.return?.valueOf()).toEqual(BigInt(1));
    });
  });
});
