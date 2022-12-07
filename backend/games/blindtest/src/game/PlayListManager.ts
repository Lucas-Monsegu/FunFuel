import Player from "../base/lobby/Player";
import Jfetch from "../base/utils/Jfetch";
import fs from 'fs'
import discord from 'discord.js'
import moment from 'moment'
import { mainUrl, dispatchToken } from "../config";


// const hook = new Webhook("https://discordapp.com/api/webhooks/710090375112556584/pcShHGRYIuhNawVv2XFFqky7KwvCwymvZIQC_peHCXsh9mQXjiqXzPgP_F4UmRRYL0Sl")

const unblockable = []

export default class PlayListManager {
    static blockedUsers: Set<string> = new Set()


    static isBlocked(player: Player) {
        return this.blockedUsers.has(player.id)
    }
    static async isAlreadyExist(name: string) {
        try {
            const res = await Jfetch.get(`https://funfuelbucket.s3.amazonaws.com/blindtest/${name}/index.json`)
            console.log(res.status)
            if (res.status == 200) {
                return true
            }
        } catch (error) {
            return true
        }
        return false
    }
    private static getIdFromUrl(url: string) {
        const urlRes = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
        return (urlRes[2] !== undefined) ? urlRes[2].split(/[^0-9a-z_-]/i)[0] : ''
    }
    private static getDuration(strSecond: string) {
        try {
            const sec = parseInt(strSecond)
            if (sec >= 5 && sec <= 30) {
                return sec
            }
            return 30
        } catch (error) {
            return 30
        }
    }
    static async checkYoutubeViews(playlist: Array<{ [key: string]: any }>) {
        try {
            for (let video of playlist) {
                const url = video.url
                const videoId = this.getIdFromUrl(url)
                if (videoId === '') {
                    return false
                }
                console.log(url, videoId)
                const durationInt = this.getDuration(video.duration)
                const res = await Jfetch.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=AIzaSyASPBYaeicOS2Bru9NdzFh0TPl5sOxWOGc`)
                const jsonRes = await res.json()
                moment.duration('ewqewq').seconds
                const isgood = jsonRes.items && jsonRes.items.length > 0 && jsonRes.items[0].statistics && jsonRes.items[0].statistics.viewCount
                    && jsonRes.items[0].contentDetails && jsonRes.items[0].contentDetails.duration
                if (!isgood) {
                    console.log('is not good')
                    return false
                }

                const videoSeconds = moment.duration(jsonRes.items[0].contentDetails.duration).asSeconds()
                console.log(videoSeconds)
                video.startTime = Math.min(videoSeconds - durationInt, video.startTime !== undefined ? video.startTime : 0)
                if (video.startTime < 0) {
                    video.startTime = 0
                }
                if (videoSeconds - video.startTime < video.duration) {
                    video.duration = videoSeconds - video.startTime
                }
            }
        } catch (error) {
            return false
        }
        return true
    }
    private static async getEmail(player: Player): Promise<string> {
        try {
            if (player.userData.public_id === '') {
                return player.userData.username
            }
            const t = await Jfetch.post(`${mainUrl}/user-email`, {
                token: dispatchToken,
                publicId: player.userData.public_id
            })
            console.log(t)
            const json = await t.json()
            console.log(json)
            return json.email
        } catch (error) {
            console.log(error)
            return player.userData.username
        }
    }
    static async PostPlayList(data: any, player: Player) {
        console.log('sending playlist')
        const email = await this.getEmail(player)
        console.log(email)
        const r = Buffer.from(JSON.stringify(data.playList), 'utf8');
        const webhook = new discord.WebhookClient('710090375112556584', 'pcShHGRYIuhNawVv2XFFqky7KwvCwymvZIQC_peHCXsh9mQXjiqXzPgP_F4UmRRYL0Sl')
        const infos = {
            answerType: data.answerType,
            title: data.playListName
        }
        webhook.send(JSON.stringify(infos, null, 2), {
            username: email,
            code: "json",
            files: [{
                attachment: r,
                name: 'playlist.json'
            }]
        })

    }
}