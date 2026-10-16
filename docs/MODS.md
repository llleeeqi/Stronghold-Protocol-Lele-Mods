# 八个玩法插件与共享宿主

当前采用官方0.3.0插件加载、打包、校验和房间选择链路；每项独立目录，默认关闭。深层玩法目前依赖本仓库共享宿主API1，详见 [插件安装与兼容边界](PLUGINS.md)。不再使用0.2.x的room.setMod或八套客户端资料切换。

## 拓展介绍与来源

| 拓展 | 玩法 | 来源项目 |
|---|---|---|
| 额外 4 回合 | 常规模式 14→18 回合、短单人 9→13 回合，Boss 仍在最后一关；默认关闭。 | 本整合包实现，沿用 [sganggs/Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol) 的回合系统。 |
| 更多阵营 | 莱茵生命与卡兹戴尔两组阵营、科研装置、亡魂与众魂炮；谬因按约定归入莱茵生命。 | [YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine)；谬因二技能来自 [SrC2O4/Stronghold-Protocol](https://github.com/SrC2O4/Stronghold-Protocol)。 |
| 收藏品 | 46件战后收藏品：逆风补给、护盾、本局增益、一次复活、敌人转移及治疗屏障。 | [UNDFFIO/Stronghold-Protocol-dlc](https://github.com/UNDFFIO/Stronghold-Protocol-dlc)。 |
| 新干员 | 结城理、娜仁图亚、予愿安洁莉娜与丰川祥子，含技能和模组。 | [remember-4/Stronghold-Protocol-Rem](https://github.com/remember-4/Stronghold-Protocol-Rem)。 |
| 伤害统计 | 显示实际扣血排行，召唤物归属干员，只保存本轮和上一轮。 | [Stardust-minus/Stronghold-Protocol](https://github.com/Stardust-minus/Stronghold-Protocol)。 |
| 恭喜发财 | 每个席位随机获得不同五阶开局干员，照常消耗共享牌库。 | [RiZhiZhaoYi/Stronghold-Protocol](https://github.com/RiZhiZhaoYi/Stronghold-Protocol)。 |
| 额外干员包 | 望、赤刃明霄陈、凯尔希·思衡托、维什戴尔；避免与其他包重复注册丰川祥子。 | [Lunac1a/Stronghold-Protocol](https://github.com/Lunac1a/Stronghold-Protocol)。 |
| 定向甄选 | 晋升奖励第一位偏向主要盟约，后两位随机；第 6 回合起转职装备提高权重。 | [Strinova-xinghui/Stronghold-Protocol](https://github.com/Strinova-xinghui/Stronghold-Protocol)。 |

这里列出各项实际玩法来源；准确引用提交、移植范围及许可边界见 [来源与署名](../notices/SOURCES.md)。引用不代表原作者参与或认可本整合版。

## 房间行为

房主用官方room.setPlugins选择插件，内容变化后重新准备并完成contentReady校验；cs锁定同一份服务端与客户端数据，开局后不可更改，在线重连继续使用本局内容。不支持跨进程重启恢复。仍保持四人，六人模式未加入。

未开启拓展时使用官方原版数据。更多阵营与额外干员包同时开启只保留卡兹戴尔维什戴尔；谬因保留在更多阵营中。+4模式不翻倍，Boss最后，训练不延长。46收藏品由收藏品插件控制，鸭梨手机不加入。伤害统计只保存本轮与上轮，不写永久战绩。

共享战斗、科研和收藏品界面仍随宿主补丁部署；删除插件关闭其内容，不物理移除宿主代码。插件文件分别带来源和说明，功能数据与选中插件一起进入内容哈希。扩展新内容优先用上游API，不另造加载器。

更多阵营机制见 [MORE-FACTIONS.md](MORE-FACTIONS.md)，收藏品见 [COLLECTIBLES.md](COLLECTIBLES.md)。
