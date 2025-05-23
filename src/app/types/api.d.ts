export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface TransferRequest {
  amount: number;
  pixi: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
}

export interface AccountResponse {
  id: string;
  clientId: string;
  pixi: string;
  suspended: boolean;
  balance: number;
}

export interface TransferResponse {
  id: string;
  createdAt: Date;
  fromPixi: string;
  toPixi: string;
  amount: number;
}

export interface TransfersResponse {
  sent: TransferResponse[];
  received: TransferResponse[];
}

export interface DebugUser {
  email: string;
  password: string;
  id: string;
  name: string;
  refreshToken: string | null;
  createdAt: Date;
}

export interface DebugAccount {
  id: string;
  clientId: string;
  pixi: string;
  suspended: boolean;
  balance: number;
}

export interface DebugData {
  users: DebugUser[];
  accounts: DebugAccount[];
  message?: string;
}
