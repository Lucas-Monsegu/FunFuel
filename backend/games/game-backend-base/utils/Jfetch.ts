import fetch, { Response } from "node-fetch"

export default class Jfetch {
    static async get(url: string): Promise<Response> {
        return fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
    }

    static async post(url: string, body: object): Promise<Response> {

        return fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }

    static async delete(url: string, body: object): Promise<Response> {
        return fetch(url, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
    }
    static async patch(url: string, body: object): Promise<Response> {
        return fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }
    static async generic(url: string, method: string, body: object): Promise<Response> {
        return fetch(url, {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }
}
