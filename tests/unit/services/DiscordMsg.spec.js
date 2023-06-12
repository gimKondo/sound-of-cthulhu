import * as DiscordMsg from '../../../src/services/DiscordMsg'

describe('DiscordMsg', () => {
  describe.each`
  type         | expected                       | msg
  ${'join'}    | ${DiscordMsg.MSG_TYPE_JOIN}    | ${':soc: join'}
  ${'join'}    | ${DiscordMsg.MSG_TYPE_JOIN}    | ${'<:soc:12334244343> join'}
  ${'leave'}   | ${DiscordMsg.MSG_TYPE_LEAVE}   | ${':soc: leave'}
  ${'invalid'} | ${DiscordMsg.MSG_TYPE_INVALID} | ${'test'}
  `('judgeType', ({ type, expected, msg }) => {
    test(`${type}("${msg}")`, () => {
      const type = DiscordMsg.judgeType(msg)
      expect(type).toBe(expected)
    })
  })
})
