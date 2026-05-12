export type GameStatus = "waiting" | "in-progress" | "finished";
export type ParticipantStatus = "alive" | "dead";
export type UserStandByStatus = "waiting" | "ready" | "playing";

export interface User {
    id: string;
    name: string;
}

export interface SnakeState {
    direction: string;
    body: { x: number; y: number }[];
}

export interface GameState {
    score: number;
    isAlive: boolean;
}


export interface ExtendedWebSocket extends WebSocket {
    user: User;
    snake: SnakeState;
    color: string;
    gameState: GameState;
    standByStatus: UserStandByStatus;
    status: ParticipantStatus;
}