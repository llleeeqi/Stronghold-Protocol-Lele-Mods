# Mod 分层与协议

通过补丁和生成器构建派生本体，房间开关决定规则与数据集，每个拓展可独立关闭。

莱茵生命、收藏品、新干员和伤害统计分别移植自其他作者的扩展项目；来源仓库、作者、固定提交与适配范围见 [来源与署名](../notices/SOURCES.md)。本页描述的是整合后的协议与运行行为。

| 内容 | room.create 字段 | 等待室消息 |
|---|---|---|
| +4 回合 | doubleRounds | room.setRounds {enabled} |
| 莱茵 | rhineEnabled | room.setRhine {enabled} |
| 收藏品 | relicsEnabled | room.setMod {mod:"relics",enabled} |
| 新干员 | operatorsEnabled | room.setMod {mod:"operators",enabled} |
| 伤害统计 | damageEnabled | room.setMod {mod:"damage",enabled} |

默认 false。等待室由房主修改、清除真人准备、广播 room.state。开局后数据和标志固定，重连恢复本局设置。

四套资料集：vanilla、rhine、vanilla-extra、rhine-extra。客户端异步载入有代际屏障，换牌库检查/清理不适用的调配。原版共享牌库机制保留；新干员仅进入开启的资料集。

+4 内部沿用历史 _double / doubleRounds 命名，实际增加四回合；常规 14 → 18，短单人 9 → 13，Boss 最后一关，延长模式无额外隐藏关。

收藏品奖励、逆风补给、护盾和增益在服务器结算，客户端提交选择；断线或托管由服务器处理未完成选择。新干员包有普通/精英、技能与模组，没有来源 fork 的全局拥有属性加成和敌人禁用规则。

伤害统计每秒采样已有实际扣血计数，推送 m.damage，召唤物归干员，装置/其他单列。联防与 Boss 按当前参与者展示，结算冻结、重连重推。保存本轮和上一轮，无永久战绩、逐击历史或新增 worker 池。

原生 checkbox 在前，名称和说明在后，多列排版。非房主、断线、请求中、开局后禁用，服务端另行验证权限。

friends-profile 限制缓存、会话、房间、发送队列并保留重连；资源参数在 .env 调整。AI 托管占用服务器 CPU，负载随阵容和对局规模变化。
