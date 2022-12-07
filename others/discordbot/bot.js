const Discord = require('discord.js');
const fetch = require('node-fetch')
const youtubedl = require('youtube-dl')
const { exec } = require("child_process");
const fs = require('fs')
const fsPromises = fs.promises
const del = require('del');
const { v4: uuidv4 } = require('uuid');
const awsCli = require('aws-cli-js');
const Options = awsCli.Options;
const Aws = awsCli.Aws;

const aws = new Aws()

let channel = undefined

const client = new Discord.Client();
function streamToJson (stream) {
    console.log('in streamToJson')
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8'))))
    })
}
function secondsToString (seconds) {
    let date = new Date(0);
    date.setSeconds(seconds); // specify value for SECONDS here
    let timeString = date.toISOString().substr(11, 8);
    return timeString
}
function getDuration (strSecond) {
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

function downloadVideo (url, n, folder, startTime, duration) {
    return new Promise((resolve, reject) => {
        console.log('-o', `./${folder}/${n}-uncuted.%(ext)s`)
        console.log({ startTime })
        const strStartTime = secondsToString(startTime)
        const dura = getDuration(duration)
        const strEndTime = secondsToString(dura)
        youtubedl.exec(url, ['-v', '-x', '--audio-format', 'mp3', '-o', `./${folder}/${n}-uncuted.%(ext)s`], {}, function (err, output) {
            if (err) {
                console.log(err)
                resolve(false)
                return
            }
            console.log(`ffmpeg -ss ${strStartTime} -i ./${folder}/${n}-uncuted.mp3 -t ${strEndTime} -c copy ./${folder}/${n}.mp3`)
            exec(`ffmpeg -ss ${strStartTime} -i ./${folder}/${n}-uncuted.mp3 -t ${strEndTime} -c copy ./${folder}/${n}.mp3`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    resolve(false)
                    return
                }

                console.log(`stdout: ${stdout}`);
                resolve(true)
                return
            })

        })
    })

}
async function downloadPlayList (playList, folder) {
    fs.mkdirSync(`./${folder}`)
    let n = 0
    for (video of playList) {
        console.log('video:', video)
        const good = await downloadVideo(video.url, n, folder, video.startTime, video.duration)
        if (!good) {
            console.log('failed to download ', video.url)
            channel.send(`failed to download: ${video.answer}`)
            return false
        }
        try {
            await fsPromises.unlink(`./${folder}/${n}-uncuted.mp3`)
        } catch (error) {
            console.log(error)
            channel.send(`error while deleting: ./${folder}/${n}-uncuted.mp3`)
        }
        n += 1
    }
    return true
}
async function createPlayListIndex (playListName, playList, answerType) {
    const tmpFileName = `${uuidv4()}.json`
    let index = []
    let n = 0
    for (let video of playList) {
        index.push([video.answer, playListName, answerType, n])
        n += 1
    }
    fsPromises.writeFile(`./${tmpFileName}`, JSON.stringify(index))
    await aws.command(`s3 cp ./${tmpFileName} "s3://funfuelbucket/blindtest/${playListName}/index.json"  --acl public-read-write --region eu-west-3`, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log(data.command)
    }
    )
    await del(tmpFileName)
}
async function acceptedPlayList (message, content) {
    console.log({ content })
    const playListName = content.title

    const answerType = content.answerType
    //do checks
    const res = await fetch(message.attachments.values().next().value.attachment, { method: "GET" })
    console.log(res.body)
    const folder = `tmp${uuidv4()}`
    let playList = undefined
    try {
        playList = await streamToJson(res.body)
    } catch (error) {
        console.log(error)
        throw "Invalid file"
    }
    const gooddownload = await downloadPlayList(playList, folder)
    if (!gooddownload) {
        await del(`${folder}`)
        throw "Failed while downloading a video"
    }
    const destName = playListName
    await aws.command(`s3 sync ./${folder} "s3://funfuelbucket/blindtest/${destName}" --acl public-read-write --region eu-west-3`, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log(data.command)
    }
    )
    await createPlayListIndex(destName, playList, answerType)
    const file = await fetch('https://funfuelbucket.s3.amazonaws.com/blindtest/playLists.json', { method: 'GET' })
    const playlistfile = await file.json()
    playlistfile[destName] = answerType
    await fsPromises.writeFile('./playLists.json', JSON.stringify(playlistfile, null, 2))
    console.log(fs.readFileSync('./playLists.json').toString())
    await aws.command(`s3 cp ./playLists.json s3://funfuelbucket/blindtest/playLists_2.json --acl public-read-write --region eu-west-3`, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log(data.command)
    }
    )
    await aws.command(`s3 rm s3://funfuelbucket/blindtest/playLists.json --region eu-west-3`, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log(data.command)
    }
    )
    await aws.command(`s3 mv s3://funfuelbucket/blindtest/playLists_2.json s3://funfuelbucket/blindtest/playLists.json --acl public-read-write --region eu-west-3`, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log(data.command)
    }
    )
    await del(`${folder}`)
}

function isMessageValid (message, res) {


    try {
        if (message.attachments.values().next().value.attachment === undefined) {
            console.log('attachement fail')
            return false
        }
        if (res.answerType && res.title) {
            return true
        }
    } catch (error) {
        console.log(error)
        return false
    }
    return false
}

client.once('ready', () => {
    console.log('Ready!')
})
const filter = (reaction, user) => {
    return (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') && user.username !== 'FunFuel'
}


client.on('message', message => {
    console.log(message.content, message.author.username, message.channel.name)
    //|| message.author.name !== 'BlindTest'
    if (message.channel.name !== 'newplaylists' || message.author.username === 'FunFuel') {
        return
    }
    if (channel === undefined) {
        channel = message.channel
    }
    let lines = message.content.split('\n')
    lines.splice(0, 1)
    lines.splice(lines.length - 1, 1)
    let content = {}
    try {
        content = JSON.parse(lines.join(''))
    }
    catch{
        message.channel.send(`Error while parsing the JSON (dont forget to add codeblock)`)
        return
    }
    if (!isMessageValid(message, content)) {
        message.channel.send("Invalid Message")
    }
    message.react('👍')
    message.react('👎')
    const collector = message.createReactionCollector(filter);
    collector.on('collect', async (reaction, user) => {
        console.log('collector detect')
        const playListName = content.title
        collector.stop()

        if (reaction.emoji.name !== '👍') {
            message.channel.send(`PlayList ${playListName} rejected`)
        }
        const waiting = await message.channel.send('Downloading playlist ...')
        try {
            await acceptedPlayList(message, content)
            await waiting.delete()
            message.channel.send('Successfully uploaded: ' + playListName + ' 👍')
        }
        catch (error) {
            await waiting.delete()
            channel.send("Failed to upload playList: " + error.toString())
        }
    });
});



client.login('Njg0Mzk4NDU4NTM4Njg4NTM1.Xr1B7Q.4-EJtRsNznrdwCHlMdUUv2HlsMY');
