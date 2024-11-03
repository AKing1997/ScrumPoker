import { Room } from "./room.interface"

export interface Story {
    id: number
    title: string
    description: string
    estimatedPoint: number
    isOpen: boolean
    room?: Room
}
export interface CreateStory {
    title: string;
    description: string;
    roomId: number;
}