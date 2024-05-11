// 定义机器人的名称，这里是为了防止群聊消息太多，所以只有艾特机器人才会回复，
// 这里不要把@去掉，在@后面加上你启动机器人账号的微信名称
export const botName = '@荣顶'

// 群聊白名单，白名单内的群聊才会自动回复
export const roomWhiteList = ['群名称', '前端超人⑤【WeChat-Bot】']

// 联系人白名单，白名单内的联系人才会自动回复
export const aliasWhiteList = ['备注名或微信名', '张三', '李四']

export const help = {
    'default':
        `——微信骰娘使用指南——
已经开发的功能有：
.coc [n]：生成n张COC人物卡（默认为1）
.en <技能名称> (技能点数)：成长检定
.help：显示本页面
.r [掷骰表达式] ([掷骰原因])：投掷骰子
.rh：暗骰1D100
.sc：理智检定
备注：
[]内为选填，<>内为必填；填写命令时不需要写括号。
有些指令有单独的帮助页面，输入.help+该项目（如.help r）查看帮助。`,
    'r':
        `——R功能使用指南——
.r [掷骰表达式] [掷骰原因]
[掷骰表达式]：([掷骰次数]#)[骰子个数]d[骰子面数](b[奖励骰个数])(p[惩罚骰个数])(k[取点数最大的骰子数])
默认为骰1D100`,
    'sc':
        `——SC功能使用指南——
.sc <x /y>：理智检定，若成功则减少x点理智，失败则减少y点理智`,
    'en':
        `——EN功能使用指南——
.en <技能名称> (技能点数)：骰D100，若点数大于技能点数，属性成长1d10`
}

export function formatNewPlayerTips(name) { return `${name}，这是新的调查员数据：` }
export function formatErrTips() { return `格式错误，请检查` }
export function formatNewPropertyTips(property) { return `\n力量STR：${property[0]}，体质CON：${property[1]}，体型SIZ：${property[2]}，敏捷DEX：${property[3]}，外貌APP：${property[4]}，智力INT：${property[5]}，意志POW：${property[6]}，教育EDU：${property[7]}，幸运LUK：${property[8]}，总和(不含幸运)SUM：${property[9]}(${property[10]})` }
export function formaEnSuccessTips(name, skill,target, result, addValue) {
    return `${name}的“${skill}”成长检定：
D100=${result}/${target} 成功
“${skill}”增加了1d10=${addValue}点，当前为${parseInt(target) + parseInt(addValue)}点`
}
export function formaEnFailedTips(name, skill, target, result) {
    return `${name}的“${skill}”成长检定：
D100=${result}/${target} 失败
“${skill}”成长失败了！`
}