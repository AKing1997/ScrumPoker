import { Estimation } from "./estimation-vote.interface"
import { Room } from "./room.interface"

export interface Story {
    id: number;
    title: string;
    description: string;
    estimatedPoint: number;
    isOpen: boolean;
    room?: Room;
    estimations?: Estimation[];
}
export interface CreateStory {
    title: string;
    description: string;
    roomId: number;
}