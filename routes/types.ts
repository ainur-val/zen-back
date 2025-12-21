import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export type Route = {
  name: string;
  method: Method;
  endpoint: string;
  handler: Handler;
};
