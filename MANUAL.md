# Sound of Cthulhu マニュアル

## Discord APIの利用方法

この機能を使うにはDiscordワークスペースの管理者権限が必要です。

### DiscordでBotアプリケーションの設定

1. ブラウザで[Discordにログイン](https://discordapp.com/login)する
2. [Developer Portal](https://discord.com/developers/applications)でApplicationを作成し、Botを追加する
    - [公式リファレンス](https://discordjs.guide/preparations/setting-up-a-bot-application.html)を参照
    - アプリ名やBot名、アイコン等は任意で良い
3. BotのTokenを取得して、控えておく
    1. SETTINGS-Botを開く
    2. Build-A-BotのTOKENにあるCopyボタンを押すとクリップボードにコピーされる
4. 招待リンクを作成する
    1. SETTINGS-OAuth2を開く
    2. SCOPESのbotをチェック
    3. BOT PERMISSIONSで以下をチェック
        - GENERAL PERMISSIONS
          - View Channel
        - Text Permissions
          - Send Messages
        - Voice Permissions
          - Connect
          - Speak
    4. SCOPES欄に招待リンクが作成される
5. 招待リンクをブラウザで開く
6. 利用したいDiscordサーバを選択し、追加する
7. 対象のサーバに追加されたことを確認する
    - 対象サーバのgeneralに、追加された旨のメッセージがポストされることで確認できる

### Tokenの設定方法

1. アプリケーション作成時に取得しておいたTokenを用意する。
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
他、通常のsound-of-cthulhuと同じ機能が利用可能。
