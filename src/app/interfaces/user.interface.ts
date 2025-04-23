// src/app/interfaces/user.interface.ts
export interface User {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    address?: string;
    role: string;
    imageUrl?: string;
  }