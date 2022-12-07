import WebSocket from "ws"
import Player from "./Player"
export default interface LobbyInterface {
    SetOptions(data: any, player: Player): void
    GetOptions(data: any, player: Player): void
    GetStateOfTheGame(data: any, player: Player): void
    startGame(): void
    ResetGame(data: any, player: Player): void
}