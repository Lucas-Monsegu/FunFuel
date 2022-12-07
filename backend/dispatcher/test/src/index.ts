import fetch from "node-fetch"
import { dispatchToken } from "./config"

function addService(game: string, path: string) {
    fetch("http://localhost:3010/services", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            serviceToken: dispatchToken,
            game: game,
            path: path
        })
    }).then(res => console.log(res))
}

async function addRoom(roomName: string, game: string): Promise<string> {
    const res = await fetch("http://localhost:3010/rooms", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            serviceToken: dispatchToken,
            game: game,
            name: roomName,
            maxPlayers: 8,
            isPrivate: true,
        })
    })
    const text = await res.json()
    return text
}

function connectRoom(numberPlayers: number, token: string) {
    fetch("http://localhost:3010/rooms", {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            serviceToken: dispatchToken,
            numberPlayers: numberPlayers,
            token: token
        })
    }).then(res => console.log(res))
}

function deleteRoom(game: string, token: string) {
    fetch("http://localhost:3010/rooms", {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            serviceToken: dispatchToken,
            game: game,
            token: token
        })
    }).then(res => console.log(res))
}

async function listRooms(game: string): Promise<string> {
    const res = await fetch(`http://localhost:3010/rooms?game=${game}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
    return await res.json()
}

const goodRes = "[{\"currentNumberOfPlayers\":4,\"isPrivate\":true,\"maximumNumberOfPlayers\":8,\"name\":\"room2\",\"service\":{\"playersInGame\":4,\"path\":\"http://game2\",\"game\":\"game1\"}},{\"currentNumberOfPlayers\":2,\"isPrivate\":true,\"maximumNumberOfPlayers\":8,\"name\":\"room3\",\"service\":{\"playersInGame\":2,\"path\":\"http://game1\",\"game\":\"game1\"}},{\"currentNumberOfPlayers\":0,\"isPrivate\":true,\"maximumNumberOfPlayers\":8,\"name\":\"room4\",\"service\":{\"playersInGame\":4,\"path\":\"http://game2\",\"game\":\"game1\"}},{\"currentNumberOfPlayers\":0,\"isPrivate\":true,\"maximumNumberOfPlayers\":8,\"name\":\"room5\",\"service\":{\"playersInGame\":2,\"path\":\"http://game1\",\"game\":\"game1\"}}]";

(async () => {
    addService("game1", "http://game1")
    addService("game1", "http://game2")
    const token1 = await addRoom("room1", "game1")
    connectRoom(3, token1)
    const token2 = await addRoom("room2", "game1")
    connectRoom(4, token2)
    const token3 = await addRoom("room3", "game1")
    connectRoom(2, token3)
    const token4 = await addRoom("room4", "game1")
    deleteRoom("game1", token1)
    const token5 = await addRoom("room5", "game1")
    const test = goodRes === JSON.stringify(await listRooms("game1"))
    console.log(test ? "PASS" : "FAIL")
})()