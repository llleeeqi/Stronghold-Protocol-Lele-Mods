# 2026-10-09：官方 0.2.2 与拓展来源复核

官方固定提交 `62eb113419123d9a3a63606107bbf85230c5dd2f`。同步潜能／练度、日语语音、浏览器本地最近30局统计、AI后选设置、推拉失衡与整帧战斗修复。服务器仍不存长期战绩；四人、服务器演算、等待室切换与重连保留。

- **更多阵营**（旧界面名称“莱茵生命”）：来自 [YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine)，采用提交 `1d20c21a3a18519ab2965d15bc8e952c0e51ad99`。莱茵生命加入星源与多萝西，生态维持仪兼顾减速、治疗与突破护盾，能量装置重做，9人解锁激光钻机；卡兹戴尔10名成员，3人亡魂、6人众魂炮含友伤、9人取消友伤。谬因来自 [SrC2O4/Stronghold-Protocol](https://github.com/SrC2O4/Stronghold-Protocol)，仍归入莱茵生命开关。维什戴尔在两个干员包同时开启时只进入卡兹戴尔资料集一次。
- **定向甄选**：来自 [Strinova-xinghui/Stronghold-Protocol](https://github.com/Strinova-xinghui/Stronghold-Protocol)，采用提交 `e9bc8c578e1beef7bc7e3deaa226f73f10dd66ba`。只给第一位主要盟约 ×2.6 权重，后两位随机；第6回合起转职装备 ×2.6。当前装备等级无候选时保持等级并随机，不采用来源降级 fallback；不带欠债、抽奖、控制台或全局回合/Boss节奏。

## 其他拓展来源检查

下表区分“工具包实际移植的固定提交”和 2026-10-09 检查到的来源仓库 HEAD。检查到较新的分支提交不代表整包复制；只移植与朋友服兼容的独立玩法。

| 拓展 | 来源项目 | 实际移植提交 | 检查到的最新 HEAD 与处理 |
|---|---|---|---|
| 收藏品 | [UNDFFIO / Stronghold-Protocol-dlc](https://github.com/UNDFFIO/Stronghold-Protocol-dlc) | `17691f155a8fe062d85aecfeec2abe50f0359009` | `cd46ac8bd79b34c9b20ff4c3c0fb62d1c25ab01b`。新分支增加鸭梨手机、时间机器、木棍等 6 件收藏品和超限模拟抽奖，包含全队降难、反转扣血、敌人转移、遮蔽界面数字等跨回合／全局效果；这轮保留已适配的 39 件，不把整套核心和 UI 改动带进朋友服。 |
| 新干员包 | [remember-4 / Stronghold-Protocol-Rem](https://github.com/remember-4/Stronghold-Protocol-Rem) | `97887cac3abc474f4933ac620ecbd043974c6f3d` | `97887cac3abc474f4933ac620ecbd043974c6f3d`，当前分支与采用提交一致。 |
| 伤害统计 | [Stardust-minus / Stronghold-Protocol](https://github.com/Stardust-minus/Stronghold-Protocol) | `9bb6b2d833978c0aa9ef1713ef188d6c1588169f` | `9f6b6d5441934c01fcc4e9e7f7f0130281e0239b`。分支继续同步本体并增加语音设置和实验性联机内容；本服保留实际扣血排行与最近两轮，不引入额外房间容量或长期记录。 |
| 恭喜发财 | [RiZhiZhaoYi / Stronghold-Protocol](https://github.com/RiZhiZhaoYi/Stronghold-Protocol) | `941e6ef25c6b50a7a1b8e3a3fd73798b39d79c21` | `c54aeb2455714720b1e9a2698a2ad515b5dfbdba`。新分支合并上游 0.2.1 并保留随机五阶开局；本体已独立更新到 0.2.2，沿用四人共享牌库适配。 |
| 额外干员包 | [Lunac1a / Stronghold-Protocol](https://github.com/Lunac1a/Stronghold-Protocol) | `c8141334266fd1d5971ed996d62ac59addb92b5d` | `c8141334266fd1d5971ed996d62ac59addb92b5d`，当前分支与采用提交一致。 |
| 谬因 | [SrC2O4 / Stronghold-Protocol](https://github.com/SrC2O4/Stronghold-Protocol) | `c76a81fb5cd8ca5bb360ff10f834cc9a166b0c88` | `c76a81fb5cd8ca5bb360ff10f834cc9a166b0c88`，当前分支与采用提交一致。 |
| 定向甄选 | [Strinova-xinghui / Stronghold-Protocol](https://github.com/Strinova-xinghui/Stronghold-Protocol) | `e9bc8c578e1beef7bc7e3deaa226f73f10dd66ba` | `e9bc8c578e1beef7bc7e3deaa226f73f10dd66ba`，当前分支与采用提交一致。 |
| 更多阵营 | [YUYUYUYUYUYUYUTOUA / Stronghold-Protocol-Rhine](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine) | `1d20c21a3a18519ab2965d15bc8e952c0e51ad99` | `1d20c21a3a18519ab2965d15bc8e952c0e51ad99`，已采用该分支的装置重做及卡兹戴尔内容；没有更晚的玩法提交。 |

所有 8 项的玩法和来源也列在 [拓展说明](MODS.md)、[README](../README.md) 和 [来源署名表](../notices/SOURCES.md)。收藏品与统计分支的其他改动已检查，但因横跨难度／战斗流程或实验联机，未作为本轮稳定小服更新合入。

本轮整合包专项回归 **757 项通过、0 项失败**；额外 full-potential 检查 4 项通过，2 项因缺少原始游戏缓存跳过。覆盖更多阵营、资料集隔离、等待室切换、断线重连、定向权重及 0.2.2 兼容修复。

# 2026-10-08：官方 0.2.1 兼容更新

固定官方提交 `c2a2ef778cf728ff29b953b9842b2a39b1e9cbea`，保留八项默认关闭的独立拓展、四人和服务器演算。同步满潜能资料、保留本回合地形的联防、跨半场突袭、消耗装备替换、Touch/凋亡及战斗加载消息修复。

适配浏览器演算的 pending battle 队列，同时保留资料切换取消屏障、望落子操作序号和重连。消耗装备优先空槽规则与莱茵专属装备组合选择共同保留；Boss 输入同时携带可选干员修复标志和上游敌人缩放。数据从干净新基线重建八套资料，原版快照保留官方 0.2.1 数据。结城理、娜仁图亚也使用新满潜能构建器，更新旧低潜数值断言，未为通过测试削弱技能。

Linux 候选验证：670 项，664 通过、6 项环境条件跳过、零失败；涵盖所有 Mod、256 种开关组合、服务器战斗、联防地图、跨半场突袭、加载期间接管/结束/清空以及原版满潜能。跳过项为 Alpine 未提供 zip 工具的 4 项官方打包检查，以及未下载原始 character_table 缓存的 2 项重推导检查。Windows 本地上游 ZIP 检查受到宿主机 zip/tar 的中文文件名编码影响；未修改上游 ZIP 读取器，也不把上述跳过项算为通过。统一启动和更新启动校验的其他测试通过，Mod 版不使用官方 ZIP 覆盖升级。

真实双浏览器验证八项介绍、房主权限、等待室修改与准备清除、八套资料切换、全部拓展开局、实际伤害面板及对局重连，两个页面均无异常；手机横屏介绍及多列布局通过。

官方新增校验更新包不适用于 Mod 目录覆盖更新，见 [本地启动说明](LOCAL-LAUNCHER.md)。六人来源评估后暂不加入，原因见 [维护评估](SIX-PLAYER-ASSESSMENT.md)。

# 2026-10-07：八项可选拓展

莱茵新增谬因（二技能自动战斗适配、折射简化、三技能未开放）；新增恭喜发财、额外干员包、定向甄选，默认关闭、等待室可切换。全部八项增加点击式圆圈叹号介绍，大厅和等待室共用，手机可用，客人可查看。两干员包可同时开，丰川祥子保留原实现；四位新增干员开放技能见 README。八套资料集与 256 种开关组合独立，服务器演算支持望放棋子及重连。

资料与战斗检查加入 scripts/test.sh、补丁重放与 CI。新增素材使用增量下载器，原清单保留。来源与固定提交见 [SOURCES.md](../notices/SOURCES.md)。

本轮验证：GitHub CI 563 项，561 通过、2 项因未下载美术资源跳过、零失败。完整素材服务器检查中，原先唯一失败是加入谬因后旧七人阵容测试人数变化，已固定该测试使用原阵容；受影响文件的 16 项全部通过。最终补丁从干净官方基线重放，308 个代码文件与部署候选一致。真实双浏览器验证了全部八项点击介绍、非房主查看、三/二/一列布局、手机横屏说明、等待室同步与准备清除、八项开局、实际伤害排行和断线重连，两端无页面异常。另在独立服务器演算测试房验证望的真实点击落子、刷新后操作序号恢复和谬因战场显示。

修复旧阵容回归后已重新通过 CI；Actions checkout 更新至 v5，固定 Ubuntu 24.04，避免旧 Action Node 运行时警告及 runner 自动换版本。

# 2026-10-07：官方 0.2.0 与莱茵 .3

- 官方基线：补位、自选编队、71 名可选干员、多语言、自定义快捷键、联防地图与规则修复。保留新版方法模块，迁移 Mod 调用。
- 莱茵：梅尔靠有效装置工作产层（普通 +1 / 精锐 +2），装置每层攻击 4；伊芙利特继承最高单台有效装置 100% / 150%；同步溯光星源盟约与客户端校验。
- 收藏品、新干员、统计来源没有新增玩法提交；保留四人服务器演算、五个默认关闭勾选和等待室切换。
- 构建改为完整可重放代码补丁 `patches/modpack-code.patch`；+4 生成器仅写数据，原版数据递归复制，包含 0.2.0 的 backups 与 i18n。其他来源的 Windows 更新器与实验 AI 未合入。

完整固定提交及来源见 [SOURCES.md](../notices/SOURCES.md)。修改过的 Mod 文本没有英文译文时沿用中文；官方翻译按原版资料验证，不强行套用已经过时的译文。

已验证：干净官方基线可完整重放补丁和四套资料，生成源码与部署候选一致；服务器回归 493 项全部通过，另有 93 项新版功能专项通过。真实双浏览器验证了默认关闭、等待室权限与准备清除、资料集同步、开局、伤害统计和断线重连，两端无页面异常；科研格子范围、Boss 镜像、充能脉冲和生态重连 4 项 Chrome 检查通过。资源包含 683 个可用模型；公开资源源缺少部分召唤物模型，客户端仍使用后备显示，不承诺模型全齐。

# 2026-10-06 Mod 更新

来源和完整提交见 notices/SOURCES.md、upstream.lock.json。选择性同步玩法，不整体覆盖其他作者的部署配置。

- 莱茵：六成员攻击共享（15% / 25%）、一级 120% 群攻、二级全场技能充能、三级 25 格脉冲；满充无目标保留；生态持续 50% 减速；研究主机解除旧攻击上限；停机/恢复/重连视觉同步。
- 新干员：仍为结城理、娜仁图亚、予愿安洁莉娜、丰川祥子；合成精锐后重置棋子计数，拉普兰德下一次主动刷新可重触发；可选包开启联防入场盟约/分队复活，适配原站位优先规则。
- 保留额外 4 回合、收藏品、伤害统计及独立勾选。原版资料集与四人服务器演算保留；不携带实验 AI 补丁。

新代码通过 patches/source-updates.patch 重放，refresh-data.mjs 刷新科研，再生成四套资料集。stage.sh 不重启现有游戏。切换前运行 scripts/test.sh 并验证真实浏览器的房主权限、多人同步、等待室修改、开局锁定及重连。

已验证：服务器完整回归 407 项通过；真实双浏览器等待室/开局/伤害面板/重连通过且无页面异常；科研范围、Boss 镜像、充能反馈及生态重连 4 项真实 Chrome 测试通过。另增 5 项开关传递及关闭隔离回归，15 项相关测试通过。构建资源含 551 个基础模型；部分原有语音/图标仍使用客户端 fallback。
