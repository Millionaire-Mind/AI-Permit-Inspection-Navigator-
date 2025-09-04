// Global type declarations for packages without official types

declare module 'json2csv' {
  export class Parser {
    constructor(options?: any);
    parse(data: any): string;
  }
}

declare module 'node-fetch' {
  export default function fetch(url: string | Request, init?: RequestInit): Promise<Response>;
  export { Request, Response, Headers, RequestInit, ResponseInit } from 'node-fetch';
}

declare module 'node-cron' {
  export function schedule(expression: string, func: () => void, options?: any): any;
}

declare module 'nodemailer' {
  export function createTransport(options: any): any;
}

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    role: string;
    id: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    id: string;
  }
}