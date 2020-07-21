'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

import * as ID3 from 'id3-parser'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const Discord = require('discord.js')
const discordClient = new Discord.Client()
const fs = require('fs')
const REAL_VOLUME = 150

function play (connection, data) {
  const path = data.filePath
  // console.log(data.volume)
  // console.log(data.volume / REAL_VOLUME)
  // console.log(data.offset)
  // console.log(data.filePath)
  const option = { volume: data.volume / REAL_VOLUME }
  if (data.offset !== 0) {
    option['seek'] = data.offset
  }

  const broadcast = discordClient.voice.createBroadcast()
  const dispatcher = broadcast.play(path, option)
  // const playSound = () => {
  connection.play(broadcast)
  dispatcher.on('error', error => { console.error(error) })
  connection.on('error', error => { console.error(error) })
  dispatcher.on('finish', () => {
    // console.log(dispatcher.volume)
    play(connection, { 'filePath': data.filePath, 'volume': dispatcher.volume * REAL_VOLUME })
  })
}

let channel
ipcMain.on('discordJoin', (event, data) => {
  discordClient.on('message', async message => {
    channel = message.channel
    if (message.content === ':soc: join') {
      if (message.member.voice.channel) {
        await message.member.voice.channel.join()
      } else {
        message.reply('You need to join a voice channel first!')
      }
    }
  })

  const tokenConfig = require('./discord_token.js')
  discordClient.login(tokenConfig.token)
})

let strTitle
let filePath
ipcMain.on('discordPlay', (event, data) => {
  const connections = discordClient.voice.connections
  const connection = connections.first()
  filePath = data.filePath

  fs.readFile(data.filePath, (err, mp3data) => {
    if (err) {
      console.log(err)
      return
    }
    const tag = ID3.parse(mp3data)
    // const artist = tag['artist']
    const title = tag['title']
    if (strTitle !== title) {
      strTitle = title
      channel.send(`♪ ${title}`)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error)
    }
  })
  play(connection, data)
})

ipcMain.on('discordStop', (event, data) => {
  if (data.filePath === filePath) {
    for (const connection of discordClient.voice.connections.values()) {
      const dispatcher = connection.dispatcher.broadcast.dispatcher
      dispatcher.pause()
    }
  }
})

ipcMain.on('discordSoundChange', (event, data) => {
  // console.log(data.volume)
  // console.log(data.volume / REAL_VOLUME)
  for (const connection of discordClient.voice.connections.values()) {
    const dispatcher = connection.dispatcher.broadcast.dispatcher
    dispatcher.setVolume(data.volume / REAL_VOLUME)
    console.log(dispatcher.volume)
  }
})
