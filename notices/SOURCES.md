> 2026-10-14：更多阵营选择性同步至 `19f8f2d853144c94cd71554c0989d7550ad9de65`，保留四人、默认关闭、谬因与官方0.2.6。伤害统计兼容修复来自 Stardust-minus 的 `b442d41ec719b7c85ac3b9468604acda9f4eff19`，适配本包面板布局。

> 2026-10-13：本体固定版本更新到官方 0.2.6；拓展来源的采用提交保持不变，本轮仅做新版兼容。

# 来源与署名

本仓库做选择性移植、四人兼容、可选开关与部署封装。玩法、原代码及创意归原贡献者；感谢下面所有项目作者及贡献者，引用不代表作者参与或认可本整合版。

## 实际引用版本与最近检查的来源版本

“实际移植提交”用于重建当前功能；“最近检查 HEAD”记录截至 2026-10-09 对来源仓库默认分支的核对点，不表示整仓移植。差异与取舍见 [更新记录](../docs/MOD-UPDATES.md)。

| 内容 | 来源项目 / 作者 | 实际移植提交 | 最近检查 HEAD（2026-10-09） |
|---|---|---|
| 本体、统一启动入口 | [sganggs / Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol) | `488db49f11daf862b67ce26fa4cf89aa6cba2466` | `488db49f11daf862b67ce26fa4cf89aa6cba2466` |
| 更多阵营：莱茵生命、卡兹戴尔 | [YUYUYUYUYUYUYUTOUA / Stronghold-Protocol-Rhine](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine) | `19f8f2d853144c94cd71554c0989d7550ad9de65` | `19f8f2d853144c94cd71554c0989d7550ad9de65` |
| 谬因二技能（本整合归入莱茵生命） | [SrC2O4 / Stronghold-Protocol](https://github.com/SrC2O4/Stronghold-Protocol) | `c76a81fb5cd8ca5bb360ff10f834cc9a166b0c88` | `c76a81fb5cd8ca5bb360ff10f834cc9a166b0c88` |
| 收藏品玩法（46 件） | [UNDFFIO / Stronghold-Protocol-dlc](https://github.com/UNDFFIO/Stronghold-Protocol-dlc) | `7edfb9662f26a7b8e829f378a069a847b341a583` | `7edfb9662f26a7b8e829f378a069a847b341a583` |
| 新干员包 | [remember-4 / Stronghold-Protocol-Rem](https://github.com/remember-4/Stronghold-Protocol-Rem) | `97887cac3abc474f4933ac620ecbd043974c6f3d` | `97887cac3abc474f4933ac620ecbd043974c6f3d` |
| 伤害统计（当前与上一轮） | [Stardust-minus / Stronghold-Protocol](https://github.com/Stardust-minus/Stronghold-Protocol) | `9bb6b2d833978c0aa9ef1713ef188d6c1588169f` | `c7521500f506cdf02467bffa9c169a25e1a82cbb` |
| 恭喜发财 | [RiZhiZhaoYi / Stronghold-Protocol](https://github.com/RiZhiZhaoYi/Stronghold-Protocol) | `941e6ef25c6b50a7a1b8e3a3fd73798b39d79c21` | `83bfd9de5f2b28870ea15946796a5abcb0fe87f7` |
| 额外干员包 | [Lunac1a / Stronghold-Protocol](https://github.com/Lunac1a/Stronghold-Protocol) | `c8141334266fd1d5971ed996d62ac59addb92b5d` | `c8141334266fd1d5971ed996d62ac59addb92b5d` |
| 定向甄选 | [Strinova-xinghui / Stronghold-Protocol](https://github.com/Strinova-xinghui/Stronghold-Protocol) | `e9bc8c578e1beef7bc7e3deaa226f73f10dd66ba` | `68560faec2187a5ada5757e27b44aa195cbfdfe5` |
| 额外4回合及整合适配 | [llleeeqi / Stronghold-Protocol-Lele-Mods](https://github.com/llleeeqi/Stronghold-Protocol-Lele-Mods)，基于上游回合系统 | 本仓库实现 | 不适用 |

## 移植边界与许可

更多阵营选择性移植装置重做、阵营、干员、装备与美术下载计划，保留四人，不合并来源六人规则。维什戴尔在两个包同时开启时只使用卡兹戴尔版本。定向甄选只移植第一位奖励与装备权重，保留卡池与装备等级；不带欠债、抽奖、控制台及来源节奏。Rem 包不带全局拥有加成或禁怪；统计只保留当前/上一轮。所有拓展默认关闭，等待室可切换。

代码 GPL-3.0-or-later，保留作者、LICENSE、NOTICE 和第三方声明。《明日方舟》的角色、美术、音频和官方数据归对应权利人，代码许可不扩大到素材。见 [LICENSE](../LICENSE)、[上游声明](UPSTREAM-NOTICE.md)、[莱茵声明](RHINE-NOTICE.md)、[第三方声明](RHINE-THIRD-PARTY-NOTICES.md)。

## 2026-10-09 更新

实际同步本体0.2.2、更多阵营与定向甄选，完整范围见 [MOD-UPDATES.md](../docs/MOD-UPDATES.md)。其他来源已检查，保留表中实际引用提交。八项点击说明均有来源作者与项目链接。

## 历史移植记录

## 2026-10-06 选择性同步

莱茵原覆盖层基于 `cd09d57771f1d3ded43e3330ee47ace2de338130`，科研更新取自 `1c520a17e9e161558464853b6aad385c96998af8`（v0.1.3-rhine.2）。移植六莱茵攻击共享、三阶段能量装置、持续减速、主机上限调整与装置停机/重连反馈；没有整体替换为来源 fork 的六人规则，也没有完整合入该 fork 的本体分支。

新干员原覆盖层基于 `df2488f021e1b069c22c9215f586559ec388b153`，修复取自 `97887cac3abc474f4933ac620ecbd043974c6f3d`。四名自定义干员保持；同步普通合成后的计数重置、拉普兰德刷新重触发与联防复活。联防复活随新干员包开启，适配为沿用当前本体的站位优先三名规则，分队及盟约额度由各玩家独立使用。没有移植来源的自持有 +10%、禁怪或默认 Touch AI。

伤害统计来源的新提交主要为来源部署及网络设置，本轮仍引用原统计提交；收藏品来源没有变化。代码增量在 `patches/source-updates.patch`，数据刷新在 `mods/rhine/refresh-data.mjs`。原有许可、署名及源项目声明继续适用。

## 2026-10-07 官方 0.2.0 与莱茵 .3

官方基线固定为 `c2a2ef778cf728ff29b953b9842b2a39b1e9cbea`。保留上游补位、自选编队、i18n、快捷键、Boss 按存活玩家数计血及新版阿戈尔吞噬后按站位扫描复活机制。新干员包的联防入场复活例外仍独立可选，未退回旧版固定前三名实现。

莱茵来源固定为 `12d418cc6efc7b19d3ddc418d902ed07e526c2a2`：选择性移植 v0.1.3-rhine.3 的梅尔有效装置工作产层（普通 +1、精锐 +2）、每层装置攻击 4、伊芙利特继承最高单台有效装置基础攻击 100% / 150%、溯光星源资金特质莱茵归属与客户端产层校验。来源后续 Windows 配置保留/便携升级脚本不在本轮移植范围。收藏品、新干员与统计仍使用表中固定玩法提交。

0.2.0 把方法拆到独立模块，本工具包迁移了对应调用和资料切换屏障；代码补丁统一为 `patches/modpack-code.patch`，数据仍由独立生成器产生，五项开关默认关闭。

## 2026-10-07：三个可选拓展与全部 Mod 说明

- `lucky`：[来源 RiZhiZhaoYi/Stronghold-Protocol](https://github.com/RiZhiZhaoYi/Stronghold-Protocol)，固定提交 `941e6ef25c6b50a7a1b8e3a3fd73798b39d79c21`。
- `recruits`：[来源 Lunac1a/Stronghold-Protocol](https://github.com/Lunac1a/Stronghold-Protocol)，固定提交 `c8141334266fd1d5971ed996d62ac59addb92b5d`。
- `targeted`：[来源 Strinova-xinghui/Stronghold-Protocol](https://github.com/Strinova-xinghui/Stronghold-Protocol)，固定提交 `dcea3f7c97216bd638aaa90fbb74e1a905c2904b`。

恭喜发财选择性移植每席位不同五阶开局，保留共享卡池份数。额外干员选择性移植四名，排除丰川祥子重复实现及来源强制保留盟约的全局规则；开放望、陈、维什戴尔三技能与凯尔希二技能。来源机制资料哈希保留于派生源码 docs/custom-operators-provenance.json。定向甄选移植规则、奖励与装备筛选，但增加默认关闭房间开关，保留官方 DIY 私池。全部八项的点击说明、多资料集联机适配及服务器手动落子兼容由本仓库整合。来源代码继续按 GPL-3.0-or-later 及原署名保留，资源归各权利人。

谬因选择性取自 [SrC2O4 / Stronghold-Protocol](https://github.com/SrC2O4/Stronghold-Protocol)，固定提交 `c76a81fb5cd8ca5bb360ff10f834cc9a166b0c88`，GPL-3.0-or-later。保留专用技能适配与工具函数，只加入五阶普通/精锐二技能；按朋友版约定从来源协防归入莱茵生命。修正直线覆盖范围和中继器 25 秒生命周期，未开放三技能及完整友军折射。

## 2026-10-08 官方 0.2.1 兼容

官方基线更新为 `c2a2ef778cf728ff29b953b9842b2a39b1e9cbea`，同步上游满潜能、联防地形、跨半场突袭及加载消息修复；Mod 来源固定提交保持不变。保留所有来源署名和选择性移植范围。六人来源只做维护评估，本轮没有加入六人功能。

## 2026-10-14 新增同步

更多阵营移植 YUYUYUYUYUYUYUTOUA 的转职装备、完整原生魂灵机制和科研更新；收藏品移植 UNDFFIO 的七件新收藏品及复活／转移／数字遮蔽配套逻辑，总计46件，暂不带鸭梨手机及超限模拟。来源原创收藏品图片和方块字体继续归来源贡献者，PRTS素材归原权利人。伤害统计另参考 Stardust-minus `b442d41ec719b7c85ac3b9468604acda9f4eff19` 的旧浏览器视口兼容修复。
