import * as config from './config.js'

/**
 * 默认消息发送
 * @param msg
 * @param bot
 * @returns {Promise<void>}
 */
export async function defaultMessage(msg, bot) {
    const contact = msg.talker() // 发消息人
    const receiver = msg.to() // 消息接收人
    const content = msg.text() // 消息内容
    const room = msg.room() // 是否是群消息
    const roomName = (await room?.topic()) || null // 群名称
    const alias = (await contact.alias()) || (await contact.name()) // 发消息人昵称
    const remarkName = await contact.alias() // 备注名称
    const name = await contact.name() // 微信名称
    const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
    const isRoomWhite = config.roomWhiteList.includes(roomName) // 是否在群聊白名单内
    const isAt = content.includes(`${config.botName}`) //艾特了机器人
    const isAlias = config.aliasWhiteList.includes(remarkName) || config.aliasWhiteList.includes(name) // 发消息的人是否在联系人白名单内
    const isBotSelf = config.botName === remarkName || config.botName === name // 是否是机器人自己
    // TODO 你们可以根据自己的需求修改这里的逻辑
    if (isBotSelf || !isText) return // 如果是机器人自己发送的消息或者消息类型不是文本则不处理
    try {
        // 区分群聊和私聊
        if (room) {
            let content = msg.text();
            if (isAt) {
                content = await msg.mentionText() || content.replace(`${botName}`, '') // 去掉艾特的消息主体
            }
            console.log(roomName + ":" + name + ': ', content)
            const response = await getReply(name, content)
            if (response != '') {
                const date = new Date()
                console.log(date + ":" + response)
                await room.say(response)
            }
        }
        // 私人聊天，白名单内的直接发送
        if (!room) {
            console.log(name + ': ', content)
            const response = await getReply(name, content)

            if (response != '') {
                const date = new Date()
                console.log(date + ":" + response)
                await contact.say(response)
            }
        }
    } catch (e) {
        console.error(e)
    }

}

async function getReply(name, text) {
    var str = ''
    if (text.startsWith('.coc')) {
        var order = text.slice(4).trim()

        str = config.formatNewPlayerTips(name)
        var count = 1;

        if (order.length > 0) {
            count = Number(order);
            if (!Number.isInteger(count)) {
                str = config.formatErrTips()
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
            str += config.formatNewPropertyTips(property)

        }
    }
    else if (text.startsWith(".en")) {
        var order = text.slice(3).trim()
        var array = order.split(' ')
        if (array.length == 2 && Number.isInteger(Number(array[1]))) {
            var result = getRandomInt(100);
            if (result > array[1]) {
                var addValue = getRandomInt(10)
                str = config.formaEnSuccessTips(name, array[0], array[1], result, addValue)
            }
            else {
                str = config.formaEnFailedTips(name, array[0], array[1], result)
            }
        }
        else {
            str = config.formatErrTips()
        }
    }
    else if (text.startsWith(".help")) {
        var order = text.slice(5).trim()

        if (order.length == 0) {
            str = config.help["default"];
        }
        else if (order in config.help) {
            str = config.help[order];
        }
        else {
            str = config.formatErrTips()
        }
    }
    else if (text.startsWith(".r")) {
        var order = text.slice(2).trim()
        if (order.length > 0) {
            var funcReg = /^(((\d+d\d+)|\d+)#)?((\d*d\d*)([\*xX\+](((\d*d\d*)|\d*)#)?((\d*d\d*)|\d*))*|([bp]\d*))$/

            var firstBlankIndex = order.indexOf(' ')
            if (firstBlankIndex == -1) {
                if (funcReg.test(order)) {
                    str = `${name} 掷出了${getRResult(order)}`
                }
                else {
                    str = `由于${order}，${name}掷出了${getRResult('d100')}`
                }
            }
            else {
                var diceFunc = order.slice(0, firstBlankIndex);
                var reason = order.slice(firstBlankIndex+1)
                str = `由于${reason}，${name}掷出了${getRResult(diceFunc)}`
            }
        }
        else {
            str = `${name} 掷出了${getRResult('d100')}`
        }
    }
    return str;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function getRResult(rStr) {
    var result = ''
    if (rStr.includes('b') && rStr.includes('p')) {
        result = 'b和p不能同时使用'
    }
    else if ((rStr.match(/b\d*/) != null && rStr.match(/b\d*/).length > 1) || (rStr.match(/p\d*/) != null && rStr.match(/p\d*/).length > 1)) {
        result = config.formatErrTips()
    }
    else {
        var baseReg = /\d+d\d+/

        var runTime = 1

        var sharpReg = /((\d+d\d+)|\d+)#/
        if (sharpReg.test(rStr)) {
            var sharpStr = rStr.match(sharpReg)[0].replace('#', '')
            if (baseReg.test(sharpStr)) {
                var r = getDiceResult(sharpStr)
                runTime = r.value
            }
            else {
                runTime = Number(sharpStr)
            }
            result = `掷骰${runTime}次：`
            for (var i = 0; i < runTime; i++) {
                var diceFunc = rStr.replace(sharpReg, '')
                var diceResult = getDiceResult(diceFunc)
                result += `\n${diceFunc}=${diceResult.detail}=${diceResult.value}`
            }
        }
        else {
            var diceResult = getDiceResult(rStr)
            if (/\[.*\]/.test(diceResult.detail)) {
                result = `${rStr}=${diceResult.detail}=${diceResult.value}`
            }
            else {
                result = `${rStr}=${diceResult.value}`
            }
        }
    }
    if (/d=/.test(result)) {
        result = result.replace('d', 'd100')
    }
    return result
}

function getDiceResult(diceFunc) {
    var result = { "detail": '', "value": 0 }
    if (diceFunc.includes('b')) {
        result.detail += '奖励'

        var bCount = 1
        if (/b\d+/.test(diceFunc )) {
            bCount = Number(diceFunc.match(/b\d+/)[0].replace('b', ''))
        }
        var baseResult = getDiceResult('d100')

        for (var i = 0; i < bCount; i++) {
            var bValue = getDiceResult('1d10')
            bValue.value -= 1
            result.detail += ' ' + bValue.value
            if (baseResult.value / 10 > bValue.value) {
                baseResult.value = bValue.value * 10 + baseResult.value % 10
            }
        }
        result.value = baseResult.value
        result.detail = `[${baseResult.detail},${result.detail}]`
    }
    else if (diceFunc.includes('p')) {
        result.detail += '惩罚'

        var pCount = 1
        if (/p\d+/.test(diceFunc)) {
            pCount = Number(diceFunc.match(/p\d+/)[0].replace('p', ''))
        }
        var baseResult = getDiceResult('d100')

        for (var i = 0; i < pCount; i++) {
            var pValue = getDiceResult('1d10')
            pValue.value -= 1
            result.detail += ' ' + pValue.value
            if (baseResult.value / 10 < pValue.value) {
                baseResult.value = pValue.value * 10 + baseResult.value % 10
            }
        }
        result.value = baseResult.value
        result.detail = `[${baseResult.detail},${result.detail}]`
    }
    else if (diceFunc.includes('+')) {
        var multiValue = Number(diceFunc.match(/\+\d+/)[0].replace(/\+/, ''))
        var currentResult = getDiceResult(diceFunc.replace(/\+\d+/, ''));
        if (!/\d+\[/.test(currentResult.detail)) {
            currentResult.detail = currentResult.value+currentResult.detail
        }
        result.detail = `${currentResult.detail} + ${multiValue}`
        result.value = currentResult.value + multiValue
    }
    else if (/[*xX]/.test(diceFunc )) {
        var multiValue = Number(diceFunc.match(/[*xX]\d+/)[0].replace(/[*xX]/, ''))
        var currentResult = getDiceResult(diceFunc.replace(/[*xX]\d+/, ''));
        if (!/\d+\[/.test(currentResult.detail)) {
            currentResult.detail = currentResult.value+currentResult.detail
        }
        result.detail = `${currentResult.detail} * ${multiValue}`
        result.value = currentResult.value * multiValue
    }
    else if (/^\d*d\d*$/.test(diceFunc )) {
        var runTime = 1;
        var diceMax = 100;

        if (/\d+d/.test(diceFunc)) {
            runTime = diceFunc.match(/\d+d/)[0].replace('d', '');
        }
        if (/d\d+/.test(diceFunc )) {
            diceMax = diceFunc.match(/d\d+/)[0].replace('d', '');
        }

        var sum = 0;
        for (var i = 0; i < runTime; i++) {
            var currentValue = getRandomInt(diceMax);
            result.detail += `+${currentValue}`
            sum += currentValue
        }
        if (runTime > 1) {
            result.detail = `[${result.detail.slice(1)}]`;
        }
        else {
            result.detail = `${diceFunc}=${sum}`;
        }

        result.value = sum
    }
    return result
}