const Discord = require('discord.js');
const fetch = require('node-fetch')
// Create an instance of a Discord client
const fs = require('fs')
const express = require('express')
const app = express()

app.use(express.json())

const MESSAGES = [
    'Hi,\nI did this project for the times when you don\'t know what to do on discord with your friends, it might interest you. Here is the link: https://funfuel.io/. Any feedback is appreciated',
]

const alreadySeen = new Set(JSON.parse(fs.readFileSync('./already_sent.json', 'utf8')))
console.log('already seen2', alreadySeen)
const toSpam = []

app.post('/user-id', function (req, res) {
    console.log('body:', req.body)
    const userIds = req.body
    if (userIds === undefined || !Array.isArray(req.body)) {
        res.sendStatus(200)
        return
    }
    console.log(userIds)
    for (userId of userIds) {
        console.log('userid', userId)
        if (!alreadySeen.has(userId)) {
            toSpam.push(userId)
        }
    }
    res.sendStatus(200)
})

app.listen(3555, function () {
    console.log('Example app listening on port 3555!')
})

function getHeaders (channelId) {
    return {
        'Host': 'discord.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US',
        'Accept-Encoding': 'gzip, deflate, br',
        'Authorization': 'NzIzNTA4MTU5OTE4MTEyODg4.Xuyp9A.mPApG769ns89goyrhcRHO_m_avk',
        'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2Ojc3LjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvNzcuMCIsImJyb3dzZXJfdmVyc2lvbiI6Ijc3LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiJ3d3cuZ29vZ2xlLmNvbSIsInNlYXJjaF9lbmdpbmVfY3VycmVudCI6Imdvb2dsZSIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjYyMDE4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==',
        'Origin': 'https://discord.com',
        'Connection': 'keep-alive',
        'Referer': `https://discord.com/channels/@me/${channelId}`,
        'TE': 'Trailers',
        'Cookie': '__cfduid=d26cd3889873788d4118c350b4084b36e1591279919; locale=en-US; __cfruid=16a650fe160d083652d9d286917c5f0f87b71b0e-1592568173'
    }

}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function sendMessage (id, message) {
    try {
        const responseCreateChannel = await fetch('https://discord.com/api/v6/users/723508159918112888/channels', {
            method: 'post',
            headers: {
                'Host': 'discord.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
                'Accept-Language': 'en-US',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                'X-Context-Properties': 'e30=',
                'Authorization': 'NzIzNTA4MTU5OTE4MTEyODg4.Xuyp9A.mPApG769ns89goyrhcRHO_m_avk',
                'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2Ojc3LjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvNzcuMCIsImJyb3dzZXJfdmVyc2lvbiI6Ijc3LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiaHR0cHM6Ly9naXRodWIuY29tL1pvbW9YWVovRGlzY29yZC1Cb3QtQ2xpZW50IiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiZ2l0aHViLmNvbSIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjYyMDE4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==',
                'Origin': 'https://discord.com',
                'Connection': 'keep-alive',
                'Referer': 'https://discord.com/channels/723521629338075187/723521629338075190',
                'TE': 'Trailers'
            },
            body: JSON.stringify(
                {
                    "recipients": [id]
                })

        })
        await sleep(200 + Math.random() * 2000)

        const resp = await responseCreateChannel.json()
        const channelId = resp['id']

        const getMessageLimit = await fetch(`https://discord.com/api/v6/channels/${channelId}/messages?limit=50`, {
            method: 'get',
            headers: getHeaders(channelId)
        })

        const sendTyping = await fetch(`https://discord.com/api/v6/channels/${channelId}/typing`, {
            method: 'post',
            headers: getHeaders(channelId)
        })
        await sleep(300 + Math.random() * 2000)
        const sendMessage = await fetch(`https://discord.com/api/v6/channels/${channelId}/messages`,
            {
                method: 'post',
                headers: {
                    'Host': 'discord.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
                    'Accept': '*/*',
                    'Accept-Language': 'en-US',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Content-Type': 'application/json',
                    'Authorization': 'NzIzNTA4MTU5OTE4MTEyODg4.Xuyp9A.mPApG769ns89goyrhcRHO_m_avk',
                    'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2Ojc3LjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvNzcuMCIsImJyb3dzZXJfdmVyc2lvbiI6Ijc3LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiJ3d3cuZ29vZ2xlLmNvbSIsInNlYXJjaF9lbmdpbmVfY3VycmVudCI6Imdvb2dsZSIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjYyMDE4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==',
                    'Origin': 'https://discord.com',
                    'Connection': 'keep-alive',
                    'Referer': 'https://discord.com/channels/@me/723545955638444103',
                    'Cookie': '__cfduid=d26cd3889873788d4118c350b4084b36e1591279919; locale=en-US; __cfruid=16a650fe160d083652d9d286917c5f0f87b71b0e-1592568173',
                    'TE': 'Trailers',
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({ "content": message, "nonce": "", "tts": false })
            })
        console.log('message sent:', sendMessage.ok)
        return true

    }
    catch (error) {
        console.log(error)
        await fetch('https://discordapp.com/api/webhooks/728938366502043680/Y6xuw-xFePhXRnVNclSAgt-t_pduRAkmuu62DJddHRwksJnD8we0vYvrqTOEgLuFt_ii',
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: error.toString()
                })
            })
        return false
    }
}
(async () => {
    while (true) {
        if (toSpam.length !== 0) {
            const user = toSpam.pop()
            alreadySeen.add(user)
            await sendMessage(user, MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
        }
        if (alreadySeen.size % 50 === 0) {
            fs.writeFileSync('./already_sent.json', JSON.stringify([...alreadySeen]))
        }
        await sleep(500 + Math.random() * 5000)
    }
})();
process.on('SIGINT', function () {
    console.log('writing seen', alreadySeen.size)
    fs.writeFileSync('./already_sent.json', JSON.stringify([...alreadySeen]))
    process.exit()
});