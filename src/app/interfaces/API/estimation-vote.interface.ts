import { PokerVoteValue } from "../../enums/poker-points.enum";
import { Story } from "./story.interface";
import { User } from "./user.interface";

export interface EstimationVote {
    id?: number;
    userId: number;
    voteValue: PokerVoteValue;
    storyId: number;
}

export interface Estimation {
    id: number;
    voteValue: string;
    user: User;
    story: Story;
    createdAt?: any;
}