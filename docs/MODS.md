# Mod 分层与协议

通过补丁和生成器构建派生本体，房间开关决定规则与数据集，每个拓展可独立关闭。

新增内容延续独立可选 Mod 的方式：默认关闭，明确来源与范围，服务端验证开关，联机与重连保留本局设置。当前实现是构建时补丁与资料生成器，并不提供 MC 式运行时插件加载器；共用引擎的兼容修改仍须随上游更新验证。不会为新增内容自动启用其他拓展。

六人模式的维护评估见 [SIX-PLAYER-ASSESSMENT.md](SIX-PLAYER-ASSESSMENT.md)，当前保留四人。

更多阵营（莱茵生命与卡兹戴尔）、收藏品、新干员和伤害统计等玩法移植自其他作者的扩展项目；来源仓库、作者、固定提交与适配范围见 [来源与署名](../notices/SOURCES.md)。本页描述的是整合后的协议与运行行为。

## 拓展介绍与来源

| 拓展 | 玩法 | 来源项目 |
|---|---|---|
| 额外 4 回合 | 常规模式 14→18 回合、短单人 9→13 回合，Boss 仍在最后一关；默认关闭。 | 本整合包实现，沿用 [sganggs/Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol) 的回合系统。 |
| 更多阵营 | 莱茵生命与卡兹戴尔两组阵营、科研装置、亡魂与众魂炮；谬因按约定归入莱茵生命。 | [YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine)；谬因二技能来自 [SrC2O4/Stronghold-Protocol](https://github.com/SrC2O4/Stronghold-Protocol)。 |
| 收藏品 | 战后奖励、逆风补给、护盾与本局增益。 | [UNDFFIO/Stronghold-Protocol-dlc](https://github.com/UNDFFIO/Stronghold-Protocol-dlc)。 |
| 新干员 | 结城理、娜仁图亚、予愿安洁莉娜与丰川祥子，含技能和模组。 | [remember-4/Stronghold-Protocol-Rem](https://github.com/remember-4/Stronghold-Protocol-Rem)。 |
| 伤害统计 | 显示实际扣血排行，召唤物归属干员，只保存本轮和上一轮。 | [Stardust-minus/Stronghold-Protocol](https://github.com/Stardust-minus/Stronghold-Protocol)。 |
| 恭喜发财 | 每个席位随机获得不同五阶开局干员，照常消耗共享牌库。 | [RiZhiZhaoYi/Stronghold-Protocol](https://github.com/RiZhiZhaoYi/Stronghold-Protocol)。 |
| 额外干员包 | 望、赤刃明霄陈、凯尔希·思衡托、维什戴尔；避免与其他包重复注册丰川祥子。 | [Lunac1a/Stronghold-Protocol](https://github.com/Lunac1a/Stronghold-Protocol)。 |
| 定向甄选 | 晋升奖励第一位偏向主要盟约，后两位随机；第 6 回合起转职装备提高权重。 | [Strinova-xinghui/Stronghold-Protocol](https://github.com/Strinova-xinghui/Stronghold-Protocol)。 |

这里列出各项实际玩法来源；准确引用提交、移植范围及许可边界见 [来源与署名](../notices/SOURCES.md)。引用不代表原作者参与或认可本整合版。

| 内容 | room.create 字段 | 等待室消息 |
|---|---|---|
| +4 回合 | doubleRounds | room.setRounds {enabled} |
| 更多阵营（源码兼容名：莱茵） | rhineEnabled | room.setRhine {enabled} |
| 收藏品 | relicsEnabled | room.setMod {mod:"relics",enabled} |
| 新干员 | operatorsEnabled | room.setMod {mod:"operators",enabled} |
| 伤害统计 | damageEnabled | room.setMod {mod:"damage",enabled} |
| 恭喜发财 | luckyEnabled | room.setMod {mod:"lucky",enabled} |
| 额外干员包 | recruitsEnabled | room.setMod {mod:"recruits",enabled} |
| 定向甄选 | targetedEnabled | room.setMod {mod:"targeted",enabled} |

默认 false。等待室由房主修改、清除真人准备、广播 room.state。开局后数据和标志固定，重连恢复本局设置。

八套资料集：vanilla、rhine、vanilla-extra、rhine-extra，以及这四套各自的 -custom 版本。`rhine` 现在包含莱茵生命与卡兹戴尔；对外开关仍为 `rhineEnabled`。客户端异步载入有代际屏障，换牌库检查/清理不适用的调配。原版共享牌库机制保留；新干员仅进入开启的资料集。

+4 内部沿用历史 _double / doubleRounds 命名，实际增加四回合；常规 14 → 18，短单人 9 → 13，Boss 最后一关，延长模式无额外隐藏关。

收藏品奖励、逆风补给、护盾和增益在服务器结算，客户端提交选择；断线或托管由服务器处理未完成选择。新干员包有普通/精英、技能与模组，没有来源 fork 的全局拥有属性加成和敌人禁用规则。

伤害统计每秒采样已有实际扣血计数，推送 m.damage，召唤物归干员，装置/其他单列。联防与 Boss 按当前参与者展示，结算冻结、重连重推。保存本轮和上一轮，无永久战绩、逐击历史或新增 worker 池。

原生 checkbox 在前，名称和说明在后，多列排版。非房主、断线、请求中、开局后禁用，服务端另行验证权限。每项附带圈形叹号，点击弹出说明，非房主和开局锁定时也可阅读。

SP_FRIENDS 朋友服配置限制缓存、会话、房间、发送队列并保留重连；资源参数在 .env 调整。AI 托管占用服务器 CPU，负载随阵容和对局规模变化。

更多阵营数据刷新先生成莱茵，再生成卡兹戴尔与谬因，随后重建干员资料集，不清空原版或 +4 配置。莱茵科研装置为生态维持仪、能量谐振仪和九人解锁的激光钻机。生态仪兼顾治疗、减速、护盾和束缚；能量仪随突破阶段扩大充能和脉冲；钻机锁定面板生命最高的敌人，持续增伤并造成少量百分比真实伤害。卡兹戴尔10名成员采用3/6/9人档位：3人首次阵亡召亡魂，6人炮击含友方伤害，9人阶段仅伤害敌方。机制概览与来源见 [更多阵营玩法说明](MORE-FACTIONS.md)。

新干员包同时开启来源联防复活修复，通过 Battle 输入的 operatorFixesEnabled 同步到演算端；普通击倒沿用 0.2.0 的吞噬结束后站位扫描、首次击倒与剩余额度；可选联防入场例外先由阿戈尔处理，再使用分队额度。关闭新干员包时保留原版联防退场规则。普通合成重置棋子计数属于共享引擎错误修复，因此各资料集均应用；玩家资金和盟约层数不重置。

额外干员包仅开放望、陈、维什戴尔三技能和凯尔希二技能。原包丰川祥子保留，新增包不注册另一个丰川。生成器合并召唤物变体，保留官方 DIY 变体；服务器演算支持望手动落子、幂等扣费、在线重连快照与操作序号。

定向甄选仅在 targetedEnabled 开启时读取 config/custom-rules.json；关闭时采用原抽取逻辑。晋升奖励第一个位置只给人数最多的活跃盟约 2.6 倍权重，后两个随机；第6回合起装备对主要盟约转职给 2.6 倍权重。候选为空时保持原等级并随机，仍使用共享卡池。

谬因归入 rhineEnabled，不增加第九个开关。来源 SrC2O4 的谬因专用适配，取五阶普通/精锐，仅开放二技能。整合加入覆盖整张战场的直线波束，按原天赋把中继器存在时间校正为 25 秒，保留中继器增攻和友军穿抗。友军波束折射尚作简化，三技能不开放，界面说明明确范围。原版关闭莱茵时不加入固定卡池。
