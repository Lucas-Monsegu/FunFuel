import pool from "../data_access/pool";
import { User } from "../models/User";
import { log } from "util";
import UserAccess from "../data_access/userAccess";

const awsCli = require('aws-cli-js');
const Options = awsCli.Options;
const Aws = awsCli.Aws;

const aws = new Aws()

const ItemsDirectory = ['avatar', 'pattern']


export default class ItemPool {

    static pool: { [key: string]: Set<number> }

    private static weightRandom(weights: number[]) {
        var totalWeight = 0,
            i, random;
        for (i = 0; i < weights.length; i++) {
            totalWeight += weights[i]
        }
        random = Math.random() * totalWeight
        for (i = 0; i < weights.length; i++) {
            if (random < weights[i]) {
                return i
            }
            random -= weights[i]
        }
        return -1
    }
    private static getUnlockablesFromPoolName(poolName: string, user: User) {
        switch (poolName) {
            case 'avatar':
                return user.unlockables.uAvatar
            case 'pattern':
                return user.unlockables.uPattern
        }
    }
    private static setDifference<T>(a: Set<T>, b: Set<T>) {
        let cpy = new Set(a)
        b.forEach(v => {
            if (cpy.has(v)) cpy.delete(v)
        })
        return cpy
    }

    static getDbCall(poolName: string) {
        switch (poolName) {
            case 'avatar':
                return UserAccess.unlockAvatar
            case 'pattern':
                return UserAccess.unlockPattern
            default:
                console.error('CRITICAL ERROR GET DBCALL WRONG NAME', poolName);

                return UserAccess.unlockAvatar
        }
    }

    static getItemToUnlock(user: User): [string, number] {
        const weights = Object.values(this.pool).map(el => { return el.size })
        const itemType = this.weightRandom(weights)
        const poolName = Object.keys(this.pool)[itemType]
        const selectedPool = this.pool[poolName]
        const mypool = Array.from(this.setDifference(selectedPool, new Set(this.getUnlockablesFromPoolName(poolName, user)?.split('').map(el => { return el.charCodeAt(0) }))))
        const itemsWeights = mypool.map(el => { return this.rarityToWeight(el) })
        const itemIndex = this.weightRandom(itemsWeights)
        return [poolName, mypool[itemIndex]]
    }

    private static rarityToWeight(category: number): number { //category inclus [1,2,3,4]
        category = Math.floor(category / 1000)
        switch (category) {
            case 1:
                return 45
            case 2:
                return 35
            case 3:
                return 15
            case 4:
                return 5
            default:
                console.error('error in weight', category);
                throw "ERROR IN WEIGHT"
        }
    }

    static async init() {
        const res = await this.updateItems()
        if (!res) {
            return false
        }
        setInterval(this.updateItems, 86400000)
        return true
    }

    static async updateItems(): Promise<boolean> {
        try {
            console.log('fetching all items ...')
            const allItems: { [key: string]: Set<number> } = {}
            for (let directory of ItemsDirectory) {
                const res = await aws.command(`s3api list-objects-v2 --bucket funfuelbucket --prefix ${directory} --region eu-west-3`)
                if (Object.keys(res.object.Contents).length === 0) {
                    throw 'Error while fetching' + directory
                }
                const li = res.object.Contents
                allItems[directory] = new Set()

                const items = li.map((el: any) => { return el.Key.match(/[0-9]+/)[0] })
                for (const item of items) {
                    const numberCat = Math.floor(item / 1000)
                    if (numberCat <= 0 || numberCat > 4) {
                        continue
                    }
                    try {
                        const itemint = parseInt(item)
                        if ([4006, 4008, 4009].includes(itemint)) {
                            continue
                        }
                        allItems[directory].add(itemint)
                    }
                    catch{
                        continue
                    }
                }
            }

            console.log('Successfully fetched all items')
            this.pool = allItems
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}