import { User } from "./user.interface"

export interface Team {
    id?: number;
    name: string;
    description: string;
    members?: User[];
    user?: User;
    createdAt?: any;
}