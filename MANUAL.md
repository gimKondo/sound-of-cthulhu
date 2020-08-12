## Discord APIの利用方法

### 権限

アプリケーション作成時に権限が必要になるので、控えておく。

#### 権限
- GENERAL PERMISSIONS
  - View Channel
- Text Permissions
  - Send Messages
- Voice Permissions
  - Connect
  - Speak

### DiscordでBotアプリケーションを作成

以下のURLを参照し、アプリケーションを作成。  
https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot  
https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links  
  
作成したアプリケーションがサーバ上に現れ、Tokenが取得出来る事を確認する。  
招待リンクはこのようになる。  
https://discord.com/api/oauth2/authorize?client_id={YOUR_CLIENT_ID}&permissions=3148800&scope=bot


### Tokenの設定方法

1. 上記のアプリケーション作成時に取得したTokenを控えておく
2. デバイスリストから「Discord API」を選択
3. ダイアログが出て、表示されたパスに設定用のiniファイルが作成される
4. iniファイルにTokenを入力するようになっているので、テキストエディタでTokenを入力する。
5. 再度、デバイスリストから「Discord API」を選択


### アプリケーションをチャンネルに追加する方法

1. Discordのユーザでボイスチャンネルに参加する。
2. テキストチャンネルで「:soc: join」と入力する。

#### 注意事項

現在、custom_emojiで「:soc:」を登録してjoinコマンドを発行しても入力を受け付けない。
これはcustom_emojiのあとに暗黙的にidがつくため、文字列が一致しないため。

### 再生方法

上記までの純美を行い、sound-of-cthulhuで再生ボタンを押す。
他、通常のsound-of-cthuluhと同じ機能が利用可能。

