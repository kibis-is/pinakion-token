import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import type { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import type {
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  AppReference,
} from '@algorandfoundation/algokit-utils/types/app';
import { type Account, bigIntToBytes, generateAccount } from 'algosdk';
import { v4 as uuid } from 'uuid';

// client
import { MethodReturn, PinakionClient, Pinakion } from '@client';

// utils
import createACLBoxReference from '@test/utils/createACLBoxReference';
import isZeroAddress from '@test/utils/isZeroAddress';
import mintToken from '@test/utils/mintToken';

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
        tokenId: 100,
      });
      const owner = result.return?.valueOf();

      if (!owner) {
        throw new Error('no result returned');
      }

      expect(isZeroAddress(owner)).toBe(true);
    });
  });

  describe('arc72_tokenByIndex', () => {
    it('should return the index', async () => {
      const result = await client.arc72TokenByIndex({
        index: 100,
      });

      expect(result.return?.valueOf()).toEqual(BigInt(100));
    });
  });

  describe('arc72_tokenURI', () => {
    it('should return an empty string if the token does not exist', async () => {
      const metadataURI = await client.arc72TokenUri({
        tokenId: 100,
      });

      expect(metadataURI.return?.valueOf()).toBe('');
    });

    it('should return the metadata for the token', async () => {
      // arrange
      const deviceID = uuid();
      const founder = true;
      const toAddress = generateAccount().addr;
      const tokenID = await mintToken({
        client,
        deviceID,
        founder,
        to: toAddress,
      });
      let metadataURI: AppCallTransactionResultOfType<MethodReturn<keyof Pinakion['methods']>> &
        AppCallTransactionResult;
      let metadata: Record<string, any>;

      // act
      metadataURI = await client.arc72TokenUri({
        tokenId: tokenID,
      });

      if (!metadataURI.return) {
        throw new Error('no result returned when getting metadata');
      }

      // assert
      metadata = JSON.parse((metadataURI.return.valueOf() as string).replace('data:application/json;utf8,', ''));

      expect(metadata.description).toBe('The official Kibisis identity token.');
      expect(metadata.name).toBe('Kibisis Pinakion');
      expect(metadata.properties.deviceID).toBe(deviceID);
      expect(metadata.properties.founder).toBe(founder);
      expect(metadata.properties.version).toBe(1);
    });
  });

  describe('arc72_totalSupply', () => {
    it('should default to zero', async () => {
      const totalSupply = await client.arc72TotalSupply({});

      expect(totalSupply.return?.valueOf()).toEqual(BigInt(0));
    });
  });

  describe('arc72_transferFrom', () => {
    it('should error when the token does not exist', async () => {
      const tokenId = 100;

      try {
        await client.arc72TransferFrom(
          {
            from: generateAccount().addr,
            to: generateAccount().addr,
            tokenId,
          },
          {
            boxes: [
              {
                appId: appReference.appId,
                name: bigIntToBytes(tokenId, 64),
              },
            ],
          }
        );
      } catch (error) {
        expect((error as any).message).toContain('assert failed');
      }
    });

    it('should transfer to new owner', async () => {
      // arrange
      const to = generateAccount().addr;
      const tokenId = await mintToken({
        client,
        to: creatorAccount.addr,
      });
      let owner = await client.arc72OwnerOf({
        tokenId,
      });

      expect(owner.return?.valueOf()).toBe(creatorAccount.addr);

      // act
      await client.arc72TransferFrom(
        {
          from: creatorAccount.addr,
          to,
          tokenId,
        },
        {
          boxes: [
            {
              appId: appReference.appId,
              name: bigIntToBytes(tokenId, 64),
            },
          ],
        }
      );

      // assert
      owner = await client.arc72OwnerOf({
        tokenId,
      });

      expect(owner.return?.valueOf()).toBe(to);
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
