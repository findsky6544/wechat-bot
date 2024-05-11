从 [wechat-bot](https://github.com/wangrongding/wechat-bot)项目魔改而来的骰娘机器人，删除了对接AI的代码

## 功能
目前指令：

.coc [数字] //coc人物做成
.en <技能名称> (技能点数)：成长检定
.help：显示帮助
.r [掷骰表达式] ([掷骰原因])：投掷骰子
.rh：暗骰1D100
.sc：理智检定

目前掷骰表达式还不能太复杂，后面慢慢改吧


## 安装
1.环境：centOS,其他环境没试过

2.安装nodejs，据说版本要v18.0以上

3.在控制台运行
```
git clone https://github.com/findsky6544/wechat-dice-bot.git
cd wechat-bot
npm install
```

## 运行
```
npm run start
```
第一次应该要扫码

后台运行：
```
nohup npm run start & exit
```
如果想关闭可以
```
ps -A //查询pid
kill [pid]
```

## 自定义
修改/src/wechaty/sendMessage.js，改完后重启即可

## 错误处理
### npm install报javascript heap out of memory
内存较小，可以尝试运行
```
node --max-old-space-size=8000 $(which npm) install
```
