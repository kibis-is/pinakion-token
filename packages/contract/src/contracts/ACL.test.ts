import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import type { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import type { AppReference } from '@algorandfoundation/algokit-utils/types/app';
import { type Account, generateAccount } from 'algosdk';

// client
import { PinakionClient } from '@client';

// utils
import createACLBoxReference from '@test/utils/createACLBoxReference';

describe('ACL', () => {
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

  describe('acl_remove', () => {
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
        await _client.aclRemove(
          {
            address,
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

    it('should remove the member if the sender is the creator', async () => {
      const address = generateAccount().addr;

      await client.appClient.fundAppAccount({
        amount: AlgoAmount.Algos(1),
        sender: creatorAccount,
      });
      await client.aclRemove({
        address,
      });
    });
  });

  describe('acl_set', () => {
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
        await _client.aclSet(
          {
            address,
            role: 1,
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

    it('should set the member if the sender is the creator', async () => {
      const address = generateAccount().addr;

      await client.aclSet({
        address,
        role: 1,
      });
    });
  });
});
