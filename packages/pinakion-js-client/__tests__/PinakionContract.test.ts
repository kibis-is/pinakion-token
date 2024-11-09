import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';

// client
import { KibisisPinakionContractClient } from '@client';

describe('PinakionContract', () => {
  const fixture = algorandFixture();
  let client: KibisisPinakionContractClient;

  beforeAll(async () => {
    await fixture.beforeEach();

    const { testAccount } = fixture.context;
    const { algod } = fixture.algorand.client;

    // create the client
    client = new KibisisPinakionContractClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await client.create.createApplication({});
  });

  beforeEach(async () => {
    await fixture.beforeEach();
  });

  test('sum', async () => {
    const a = 13;
    const b = 37;
    const sum = await client.doMath({ a, b, operation: 'sum' });

    expect(sum.return?.valueOf()).toBe(BigInt(a + b));
  });

  test('difference', async () => {
    const a = 13;
    const b = 37;
    const diff = await client.doMath({ a, b, operation: 'difference' });

    expect(diff.return?.valueOf()).toBe(BigInt(a >= b ? a - b : b - a));
  });

  test('hello', async () => {
    const diff = await client.hello({ name: 'world!' });

    expect(diff.return?.valueOf()).toBe('Hello, world!');
  });
});
