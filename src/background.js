'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

import * as fs from 'fs'
import * as ini from 'ini'
import * as path from 'path'
import * as Discord from 'discord.js'

import * as DiscordMsg from './services/DiscordMsg'

const discordClient = new Discord.Client()
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Standard scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true }
}])
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
    height: 600
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    // Load the index.html when not in development
    createProtocol('app')
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

function playDiscordSoundLoop (connection, filePath, volume, offset) {
  const option = { volume: toRealVolume(volume) }
  if (offset !== 0) {
    option.seek = offset
  }

  const broadcast = discordClient.voice.createBroadcast()
  const dispatcher = broadcast.play(filePath, option)
  connection.play(broadcast)
  dispatcher.on('error', error => { console.error(error) })
  connection.on('error', error => { console.error(error) })
  dispatcher.on('finish', () => {
    if (filePathCurrentPlay === filePath) {
      playDiscordSoundLoop(connection, filePath, toDisplayVolume(dispatcher.volume), offset)
    }
  })
}

function playDiscordSoundOnce (connection, filePath, volume, offset) {
  const option = { volume: toRealVolume(volume) }
  if (offset !== 0) {
    option.seek = offset
  }

  const broadcast = discordClient.voice.createBroadcast()
  const dispatcher = broadcast.play(filePath, option)
  connection.play(broadcast)
  dispatcher.on('error', error => { console.error(error) })
  connection.on('error', error => { console.error(error) })
  dispatcher.on('finish', () => {
    console.log('finish sound on Discord')
    dispatcher.destroy()
  })
}

ipcMain.handle('discordJoin', async (event, data) => {
  discordClient.on('message', async message => {
    const msgType = DiscordMsg.judgeType(message.content)
    switch (msgType) {
      case DiscordMsg.MSG_TYPE_JOIN:
        if (message.member.voice.channel) {
          await message.member.voice.channel.join()
        } else {
          message.reply('You need to join a voice channel first!')
        }
        break
      case DiscordMsg.MSG_TYPE_LEAVE:
        if (message.member.voice.channel) {
          await message.member.voice.channel.leave()
        }
        break
    }
  })

  const userHome = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
  const pathConfig = path.join(userHome, 'sound_of_cthulhu_discord_token.ini')

  try {
    fs.statSync(pathConfig)
  } catch (error) {
    if (error.code === 'ENOENT') {
      const options = {
        type: 'question',
        title: 'No Token File',
        message: 'No Token Config File',
        detail: `There is no discord token configuration file in the ${pathConfig}.\nDo you want to create a template file?`,
        buttons: ['OK', 'Cancel'],
        cancelId: -1
      }
      const selected = dialog.showMessageBoxSync(options)
      if (selected === 0) {
        fs.writeFile(pathConfig, 'discordToken = "your token"', function (err) {
          if (err) throw err
          dialog.showMessageBox({ type: 'info', detail: `Saved!\nWrite your discord token to ${pathConfig}` })
        })
      }
    } else {
      dialog.showMessageBox({ type: 'error', detail: error })
    }
    return { isSuccess: false }
  }

  try {
    const config = ini.parse(fs.readFileSync(pathConfig, 'utf-8'))
    try {
      await discordClient.login(config.discordToken)
      console.log('Success to login Discord.')
      return { isSuccess: true }
    } catch (e) {
      dialog.showMessageBox({ type: 'error', detail: `The token is illegal.\nPlease check to ${pathConfig}` })
    }
  } catch (error) {
    dialog.showMessageBox({ type: 'error', detail: `The format is wrong.\nPlease check to ${pathConfig}\n${error}` })
  }
  return { isSuccess: false }
})

let filePathCurrentPlay
ipcMain.on('discordPlay', (event, data) => {
  const connection = discordClient.voice.connections.first()
  if (data.loop) {
    filePathCurrentPlay = data.filePath
    playDiscordSoundLoop(connection, data.filePath, data.volume, data.offset)
  } else {
    playDiscordSoundOnce(connection, data.filePath, data.volume, data.offset)
  }
})

ipcMain.on('discordStop', (event, data) => {
  if (data.filePath === filePathCurrentPlay) {
    for (const connection of discordClient.voice.connections.values()) {
      const dispatcher = connection.dispatcher.broadcast.dispatcher
      dispatcher.pause()
    }
  }
})

ipcMain.on('discordSoundChange', (event, data) => {
  for (const connection of discordClient.voice.connections.values()) {
    const dispatcher = connection.dispatcher.broadcast.dispatcher
    dispatcher.setVolume(toRealVolume(data.volume))
  }
})

function toRealVolume (displayVolume) {
  return displayVolume / 150
}

function toDisplayVolume (realVolume) {
  return realVolume * 150
}
