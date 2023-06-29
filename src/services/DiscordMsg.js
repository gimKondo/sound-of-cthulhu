// Discord message type ID
const MSG_TYPE_INVALID = -1
const MSG_TYPE_JOIN = 1
const MSG_TYPE_LEAVE = 2

/**
 * Judge message type of Discord text message
 *
 * Some of messages that start with ":soc:" are judge as special message.
 * Also EMOJI ":soc:" is supported.
 * If ":soc:" is defined as EMOJI, message is converted to "<:soc:nnnnnnnnn>".
 *
 * @param {String} msg text message on Discord text channel
 * @return {Number} message type ID
 */
const judgeType = (msg) => {
  const matched = msg.match(/^<?:soc:\d*>?\s+([a-z]+)/)
  if (matched === null || matched.length !== 2) {
    return MSG_TYPE_INVALID
  }
  const cmdText = matched[1]
  switch (cmdText) {
    case 'join': return MSG_TYPE_JOIN
    case 'leave': return MSG_TYPE_LEAVE
    default: return MSG_TYPE_INVALID
  }
}

export {
  MSG_TYPE_INVALID,
  MSG_TYPE_JOIN,
  MSG_TYPE_LEAVE,
  judgeType
}
