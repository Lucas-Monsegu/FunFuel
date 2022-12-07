import passport from "passport"
import { OAuth2Strategy as googleStrat, Profile, VerifyFunction } from "passport-google-oauth"
import { Strategy as discordStrat } from "passport-discord"
import { User, APIType } from "../models/User"
import userAccess from "../data_access/userAccess"
import { isProd } from "."

async function discordConnect(profile: discordStrat.Profile, done: VerifyFunction) {
    console.log(profile)
    const user = await userAccess.getUserByApiId(profile.id)
    console.log(user)
    if (!user) {
        const added = await userAccess.addUser(profile.username, APIType.Discord, profile.id, profile.email === undefined ? '' : profile.email)
        return done(null, added)
    }
    // if (profile.avatar != user.avatar && user.syncName) {
    //     const updated = await userAccess.updateUserWithAvatar(user.id, profile.username, profile.avatar)
    //     if (!updated) {
    //         return done(new Error("Error while updating user"), updated)
    //     }
    //     return done(null, updated)
    // }
    else if (profile.username !== user.username) {
        let updated = undefined
        if (user.syncName) {
            updated = await userAccess.updateUser(user.id, profile.username)
        }
        else {
            updated = await userAccess.updateUserOnlyApiName(user.id, profile.username)
        }
        if (!updated) {
            return done(new Error("Error while updating user"), updated)
        }
        return done(null, updated)
    }
    done(null, user)
}

async function googleConnect(profile: Profile, done: VerifyFunction) {
    console.log(profile)
    const user = await userAccess.getUserByApiId(profile.id)
    console.log(!user)
    if (!user) {
        const email = profile.emails === undefined ? '' : profile.emails[0].value
        const added = await userAccess.addUser(profile.displayName, APIType.Google, profile.id, email)
        return done(null, added)
    }
    // if (profile._json['picture'] != undefined && profile._json['picture'] != user.avatar) {
    //     const updated = await userAccess.updateUserWithAvatar(user.id, profile.displayName, profile._json['picture'])
    //     if (!updated) {
    //         return done(new Error("Error while updating user"), updated)
    //     }
    //     return done(null, updated)
    // }
    else if (profile.displayName !== user.username) {
        console.log('in if')
        let updated = undefined
        if (user.syncName) {
            updated = await userAccess.updateUser(user.id, profile.displayName)
        }
        else {
            updated = await userAccess.updateUserOnlyApiName(user.id, profile.displayName)
        }
        console.log('updated ?')
        if (!updated) {
            return done(new Error("Error while updating user"), updated)
        }
        return done(null, updated)
    }
    console.log('done')
    return done(null, user)
}

passport.serializeUser((user: User, done) => {
    done(null, user.id)
})


passport.deserializeUser((id: string, done) => {
    userAccess.getUser(id).then(user => {
        done(null, user)
    })
})

passport.use(new discordStrat({
    clientID: "684398458538688535",
    clientSecret: "aatclk3CBLhH01Zl0Fykd96cM7QGP9O5",
    callbackURL: isProd ? "http://funfuel.io/api/auth/discord/redirect" : "http://localhost:3010/api/auth/discord/redirect"
}, (accessToken, refreshToken, profile, done) => {
    discordConnect(profile, done)
}))

passport.use(new googleStrat({
    clientID: "480092180893-lrq38ee10kp227kavt38558e3tb26ld5.apps.googleusercontent.com",
    clientSecret: "8HxEVXWxEYNl7AKMS8bJOEcr",
    callbackURL: isProd ? "https://funfuel.io/api/auth/google/redirect" : "http://localhost:3010/api/auth/google/redirect",
}, (accessToken, refreshToken, profile, done) => {
    googleConnect(profile, done)
}))

export default passport