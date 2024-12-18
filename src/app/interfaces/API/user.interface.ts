export interface User {
    id?: number;
    userName: string;
    password?: string;
    email?: string;
    name?: string;
    lastName?: string;
    isVerified?: boolean;
    isConnectedWS?: boolean;
    verificationToken?: any;
    verificationTokenExpiry?: any;
    createdAt?: any;
}