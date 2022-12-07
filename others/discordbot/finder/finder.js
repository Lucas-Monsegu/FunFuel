const Discord = require('discord.js');
const fetch = require('node-fetch')
// Create an instance of a Discord client
const client = new Discord.Client();


discordURLS = ['https://discord.gg/msV7x2']

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */


async function joinDiscord (discordUrl) {
    const urltoken = discordUrl.slice(discordUrl.lastIndexOf('/') + 1, discordUrl.length)
    return fetch(`https://discord.com/api/v6/invites/${urltoken}`, {
        method: 'post',
        body: {},
        headers: {
            'Host': 'discord.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US',
            'Accept-Encoding': 'gzip, deflate, br',
            'X-Context-Properties': 'eyJsb2NhdGlvbiI6IkFjY2VwdCBJbnZpdGUgUGFnZSIsImxvY2F0aW9uX2d1aWxkX2lkIjoiNzIzNTIxNjI5MzM4MDc1MTg3IiwibG9jYXRpb25fY2hhbm5lbF9pZCI6IjcyMzUyMTYyOTMzODA3NTE5MCIsImxvY2F0aW9uX2NoYW5uZWxfdHlwZSI6MH0=',
            'Authorization': 'NzIzNTA4MTU5OTE4MTEyODg4.Xuy26g.n9abWd3pDcxUlbqT-J2g3ey3TJw',
            'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2Ojc3LjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvNzcuMCIsImJyb3dzZXJfdmVyc2lvbiI6Ijc3LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiaHR0cHM6Ly9naXRodWIuY29tL1pvbW9YWVovRGlzY29yZC1Cb3QtQ2xpZW50IiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiZ2l0aHViLmNvbSIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjYyMDE4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==',
            'Origin': 'https://discord.com',
            'Connection': 'keep-alive',
            'Referer': discordUrl,
            'Content-Length': '0',
            'TE': 'Trailers'
        }
    })
}

async function sendIds (ids) {
    try {
        await fetch('http://localhost:3555/user-id', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids)
        })
    }
    catch (error) {
        console.log('no spammer avaible')
        process.exit()
    }
}

client.on('ready', async () => {
    console.log('I am ready!');
    sendIds()
    for (let guild of client.guilds.values()) {
        console.log('members:', guild.members.keys())

        sendIds([...guild.members.keys()])
    }
});

(async () => {
    for (let discordUrl of discordURLS) {
        await joinDiscord(discordUrl)
    }
})();
// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login('NzIzNTA4MTU5OTE4MTEyODg4.Xuyp9A.mPApG769ns89goyrhcRHO_m_avk');