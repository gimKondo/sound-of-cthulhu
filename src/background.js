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
const discordClient = new Discord.Client()

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

function playDiscordSound (connection, filePath, volume, offset) {
  const path = filePath
  const option = { volume: toRealVolume(volume) }
  if (offset !== 0) {
    option['seek'] = offset
  }

  const broadcast = discordClient.voice.createBroadcast()
  const dispatcher = broadcast.play(path, option)
  // const playSound = () => {
  connection.play(broadcast)
  dispatcher.on('error', error => { console.error(error) })
  connection.on('error', error => { console.error(error) })
  dispatcher.on('finish', () => {
    playDiscordSound(connection, filePath, toDisplayVolume(dispatcher.volume), offset)
  })
}

ipcMain.on('discordJoin', (event, data) => {
  discordClient.on('message', async message => {
    if (message.content === ':soc: join') {
      if (message.member.voice.channel) {
        await message.member.voice.channel.join()
      } else {
        message.reply('You need to join a voice channel first!')
      }
    }
  })

  const userHome = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
  const pathConfig = path.join(userHome, 'discord_token.ini')

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
      const selected = dialog.showMessageBox(options)
      if (selected === 0) {
        fs.writeFile(pathConfig, 'discordToken = "your token"', function (err) {
          if (err) throw err
          dialog.showMessageBox({ type: 'info', detail: `Saved!\nWrite your discord token to ${pathConfig}` })
        })
        return
      } else {
        return
      }
    } else {
      dialog.showMessageBox({ type: 'error', detail: error })
    }
  }

  try {
    const config = ini.parse(fs.readFileSync(pathConfig, 'utf-8'))
    console.log(config.discordToken)
  } catch (error) {
    dialog.showMessageBox({ type: 'error', detail: `The format is wrong.\nPlease check to ${pathConfig}` })
  }

  discordClient.login(config.discordToken)
    .then((data) => {
      dialog.showMessageBox({ type: 'info', detail: 'Sucess Discord Login.Please type ":soc: join" to discord workspace.' })
    })
    .catch((e) => {
      dialog.showMessageBox({ type: 'error', detail: `The token is illegal.\nPlease check to ${pathConfig}` })
    })
})

let filePathCurrentPlay
ipcMain.on('discordPlay', (event, data) => {
  const connection = discordClient.voice.connections.first()
  filePathCurrentPlay = data.filePath
  playDiscordSound(connection, data.filePath, data.volume, data.offset)
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
