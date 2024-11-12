// client
import type { PinakionClient } from '@client';

interface IOptions {
  client: PinakionClient;
  deviceID?: string;
  founder?: boolean;
  to: string;
}

export default IOptions;
