import { botName, roomWhiteList, aliasWhiteList } from '../../config.js'

/**
 * 默认消息发送
 * @param msg
 * @param bot
 * @returns {Promise<void>}
 */
export async function defaultMessage(msg, bot) {
    console.log('defaultMessage')
    const contact = msg.talker() // 发消息人
    const receiver = msg.to() // 消息接收人
    const content = msg.text() // 消息内容
    const room = msg.room() // 是否是群消息
    const roomName = (await room?.topic()) || null // 群名称
    const alias = (await contact.alias()) || (await contact.name()) // 发消息人昵称
    const remarkName = await contact.alias() // 备注名称
    const name = await contact.name() // 微信名称
    const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
    const isRoomWhite = roomWhiteList.includes(roomName) // 是否在群聊白名单内
    const isAt = content.includes(`${botName}`) //艾特了机器人
    const isAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name) // 发消息的人是否在联系人白名单内
    const isBotSelf = botName === remarkName || botName === name // 是否是机器人自己
    // TODO 你们可以根据自己的需求修改这里的逻辑
console.log(msg.type() )
    if (isBotSelf || !isText) return // 如果是机器人自己发送的消息或者消息类型不是文本则不处理
    try {
        // 区分群聊和私聊
        if (room) {
            let content =msg.text();
            if (isAt) {
                content = await msg.mentionText() || content.replace(`${botName}`, '') // 去掉艾特的消息主体
            }
            console.log(name + ': ', content)
            const response = await getReply(name, content)
            console.log(response)
            await room.say(response)
        }
        // 私人聊天，白名单内的直接发送
        if (!room) {
            console.log(name + ': ', content)
            const response = await getReply(name, content)
            console.log(response)
            await contact.say(response)
        }
    } catch (e) {
        console.error(e)
    }

}

async function getReply(name, text) {
    var str = ''
    if (text.slice(0, 4) == '.coc') {
        str = `${name}，这是新的调查员数据：`
        var count = 1;
        if (text.length > 4) {
            count = Number(text.slice(4).trim());
            if (!Number.isInteger(count)) {
                return '格式错误，请输入.coc [数字]';
            }
        }
        var property = [11]
        for (let i = 0; i < count; i++) {
            property[0] = (getRandomInt(6) + getRandomInt(6) + getRandomInt(6)) * 5;//力量3d6*5
            property[1] = (getRandomInt(6) + getRandomInt(6) + getRandomInt(6)) * 5;//体质3d6*5
            property[2] = (getRandomInt(6) + getRandomInt(6) + 6) * 5;//体型(2d6+6)*5
            property[3] = (getRandomInt(6) + getRandomInt(6) + getRandomInt(6)) * 5;//敏捷3d6*5
            property[4] = (getRandomInt(6) + getRandomInt(6) + getRandomInt(6)) * 5;//外貌3d6*5
            property[5] = (getRandomInt(6) + getRandomInt(6) + 6) * 5;//智力(2d6+6)*5
            property[6] = (getRandomInt(6) + getRandomInt(6) + getRandomInt(6)) * 5;//意志3d6*5
            property[7] = (getRandomInt(6) + getRandomInt(6) + 6) * 5;//教育(2d6+6)*5
            property[8] = (getRandomInt(6) + getRandomInt(6) + getRandomInt(6)) * 5;//幸运3d6*5

            property[9] = property[0] + property[1] + property[2] + property[3] + property[4] + property[5] + property[6] + property[7];
            property[10] = property[0] + property[1] + property[2] + property[3] + property[4] + property[5] + property[6] + property[7] + property[8];
            str += '\n----------------------------------------'
            str += '\n力量STR：' + property[0] + ',体质CON：' + property[1] + ',体型SIZ：' + property[2] + ',敏捷DEX：' + property[3] + ',外貌APP：' + property[4] + ',智力INT：' + property[5] + ',意志POW：' + property[6] + ',教育EDU：' + property[7] + ',幸运LUK：' + property[8] + ',总和(不含幸运)SUM：' + property[9] + '(' + property[10] + ')'

        }
    }
    return str;
}

function getRandomInt(max){
	return Math.floor(Math.random() * max)+1;
}