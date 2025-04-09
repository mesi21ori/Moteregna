import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      profile:string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }

  interface User {
    id: string;
    firstName: string;
    profile:string;
    lastName: string;
    email: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName: string;
    profile:string;
    lastName: string;
    email: string;
    role: string;
  }
}

