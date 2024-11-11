import { Story } from "./story.interface"
import { Team } from "./team.interface"
import { User } from "./user.interface"

export interface Room {
    id?: number;
    name: string;
    description: string;
    isOpen?: boolean;
    teams?: Team[];
    stories?: Story[];
    user?: User;
    createdAt?: any;
}






