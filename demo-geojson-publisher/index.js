'use strict'

if (process.argv.length !== 3) {
    console.error("アプリケーション設定ファイルが必要")
    return
}

const fs = require('fs')
const turfmeta = require('@turf/meta')
const mqtt = require('mqtt')
const mongodb = require('mongodb')

const appConfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))

function mqttInit() {
    let client = mqtt.connect(appConfg.mqtt.url, {
        clientId: appConfg.mqtt.deviceId + "-subscriber",
        username: appConfg.mqtt.user,
        password: appConfg.mqtt.password,
        port: appConfg.mqtt.port
    })
    return client
}


function randomMove(m) {
    return Math.floor((Math.random() * (m * 2)) - m) * 0.00001
}


function publish(coord) {
    const mqttClient = mqttInit()
    mqttClient.on('connect', function () {

        const date = new Date()
        let message = JSON.stringify({
            "lat": (Math.round((coord[1] + randomMove(appConfg.randomMove)) * 1000000) / 1000000).toString(),
            "lon": (Math.round((coord[0] + randomMove(appConfg.randomMove)) * 1000000) / 1000000).toString(),
            "alt": "0.00",
            "gpstime": date.toISOString(),
        })

        //console.log(message)
        mqttClient.publish('/' + appConfg.mqtt.deviceId + '/location', message, { qos: 0 })
        mqttClient.end()
    })
}



function loadGeoJson2Coords(appConfg) {
    let geojson = JSON.parse(fs.readFileSync(appConfg.targetPath, 'utf8'))
    let coords = turfmeta.coordAll(geojson)

    //console.log(coords)

    return coords
}

function sleep(msec) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, msec)
    })
}

async function removeCollection() {
    let client
    try {
        client = await mongodb.MongoClient.connect(appConfg.mongodb.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const db = client.db(appConfg.mongodb.db)
        const res = await db
            .collection(appConfg.mongodb.collection)
            .deleteMany({})

        return res
    } catch (error) {
        console.log(error)
    } finally {
        client.close()
    }
}

async function main(appConfg) {

    const coords = loadGeoJson2Coords(appConfg)
    while (true) {

        console.log("start")

        await removeCollection()

        console.log("remove done")

        for (let coord of coords) {
            publish(coord)
            await sleep(appConfg.interval)
        }
    }
}

main(appConfg)
