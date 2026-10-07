# 来源与署名

感谢原作者及各 fork 的贡献者。莱茵生命、收藏品、新干员与伤害统计是从下面的项目选择性移植并适配，不是本仓库从零原创。作者列使用 GitHub 账号；原项目其他贡献者的署名和版权声明同样保留。

## 引用项目与版本

这里记录实际引用的固定提交，不表示持续跟随来源仓库最新版。机器可读记录见 [upstream.lock.json](../upstream.lock.json)。

| 内容 | 来源仓库 | 作者账号 | 引用提交 |
|---|---|---|---|
| 游戏本体、规则、服务端、浏览器客户端及统一启动入口 | [Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol) | [sganggs](https://github.com/sganggs) | [1303321407f9a9b80c68e0a4d47b40871a5d06c3](https://github.com/sganggs/Stronghold-Protocol/commit/1303321407f9a9b80c68e0a4d47b40871a5d06c3) |
| 莱茵生命扩展 | [Stronghold-Protocol-Rhine](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine) | [YUYUYUYUYUYUYUTOUA](https://github.com/YUYUYUYUYUYUYUTOUA) | [12d418cc6efc7b19d3ddc418d902ed07e526c2a2](https://github.com/YUYUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine/commit/12d418cc6efc7b19d3ddc418d902ed07e526c2a2) |
| 收藏品玩法 | [Stronghold-Protocol-dlc](https://github.com/UNDFFIO/Stronghold-Protocol-dlc) | [UNDFFIO](https://github.com/UNDFFIO) | [17691f155a8fe062d85aecfeec2abe50f0359009](https://github.com/UNDFFIO/Stronghold-Protocol-dlc/commit/17691f155a8fe062d85aecfeec2abe50f0359009) |
| 新干员包 | [Stronghold-Protocol-Rem](https://github.com/remember-4/Stronghold-Protocol-Rem) | [remember-4](https://github.com/remember-4) | [97887cac3abc474f4933ac620ecbd043974c6f3d](https://github.com/remember-4/Stronghold-Protocol-Rem/commit/97887cac3abc474f4933ac620ecbd043974c6f3d) |
| 伤害统计 | [Stronghold-Protocol](https://github.com/Stardust-minus/Stronghold-Protocol) | [Stardust-minus](https://github.com/Stardust-minus) | [9bb6b2d833978c0aa9ef1713ef188d6c1588169f](https://github.com/Stardust-minus/Stronghold-Protocol/commit/9bb6b2d833978c0aa9ef1713ef188d6c1588169f) |

## 移植范围与本仓库改动

- **莱茵生命**：科研装置、莱茵干员、盟约与装备等来自莱茵扩展；本仓库将其适配到固定上游、4 人房间和可选资料集。数据生成器主要位于 `mods/rhine/`，0.2.0 代码统一收录于 `patches/modpack-code.patch`。
- **收藏品**：收藏品内容及相关玩法来自 UNDFFIO 的 dlc 项目；本仓库将其整合为默认关闭的房间选项，并兼容莱茵及服务器演算。
- **新干员**：结城理、娜仁图亚、予愿安洁莉娜、丰川祥子及相应实现来自 remember-4 的 Rem 项目；选择性移植干员、技能与模组，不包含该来源的全局拥有属性加成和敌人禁用规则。
- **伤害统计**：统计实现与面板基础来自 Stardust-minus 的 fork；本仓库适配现有服务器演算、联防、Boss 与重连，仅保留本轮/上一轮，不新增永久战绩。
- 上述三项 party 拓展主要位于 `patches/modpack-code.patch` 与 `mods/party/generate-data.mjs`；它们是整合后的代码补丁与生成器，不是原仓库完整镜像。
- **本仓库新增与整合工作**：额外 4 回合规则、独立房间开关、等待室同步、多资料集隔离、勾选框与多列界面、朋友服资源配置，以及固定版本构建、Docker Compose、更新和回退流程。统一本地启动入口本身来自上游，本仓库补充其 Mod 接入指导。

仓库与部署工具由 [llleeeqi](https://github.com/llleeeqi) 维护。对原代码的修改与整合不改变来源署名；引用不代表原作者参与、授权背书或认可本整合版。

## 许可与素材权属

代码采用 GPL-3.0-or-later，保留原项目 LICENSE、NOTICE 和第三方许可。游戏角色、美术、音频、Spine、官方数据及其他第三方内容仍归相应权利人，代码许可不扩大到这些内容。

详见 [上游声明](UPSTREAM-NOTICE.md)、[莱茵声明](RHINE-NOTICE.md)、[莱茵第三方声明](RHINE-THIRD-PARTY-NOTICES.md) 与 [LICENSE](../LICENSE)。再发布构建或继续移植时须保留相关声明，并同步记录新增来源。

## 2026-10-06 选择性同步

莱茵原覆盖层基于 `cd09d57771f1d3ded43e3330ee47ace2de338130`，科研更新取自 `1c520a17e9e161558464853b6aad385c96998af8`（v0.1.3-rhine.2）。移植六莱茵攻击共享、三阶段能量装置、持续减速、主机上限调整与装置停机/重连反馈；没有整体替换为来源 fork 的六人规则，也没有完整合入该 fork 的本体分支。

新干员原覆盖层基于 `df2488f021e1b069c22c9215f586559ec388b153`，修复取自 `97887cac3abc474f4933ac620ecbd043974c6f3d`。四名自定义干员保持；同步普通合成后的计数重置、拉普兰德刷新重触发与联防复活。联防复活随新干员包开启，适配为沿用当前本体的站位优先三名规则，分队及盟约额度由各玩家独立使用。没有移植来源的自持有 +10%、禁怪或默认 Touch AI。

伤害统计来源的新提交主要为来源部署及网络设置，本轮仍引用原统计提交；收藏品来源没有变化。代码增量在 `patches/source-updates.patch`，数据刷新在 `mods/rhine/refresh-data.mjs`。原有许可、署名及源项目声明继续适用。

## 2026-10-07 官方 0.2.0 与莱茵 .3

官方基线固定为 `1303321407f9a9b80c68e0a4d47b40871a5d06c3`。保留上游补位、自选编队、i18n、快捷键、Boss 按存活玩家数计血及新版阿戈尔吞噬后按站位扫描复活机制。新干员包的联防入场复活例外仍独立可选，未退回旧版固定前三名实现。

莱茵来源固定为 `12d418cc6efc7b19d3ddc418d902ed07e526c2a2`：选择性移植 v0.1.3-rhine.3 的梅尔有效装置工作产层（普通 +1、精锐 +2）、每层装置攻击 4、伊芙利特继承最高单台有效装置基础攻击 100% / 150%、溯光星源资金特质莱茵归属与客户端产层校验。来源后续 Windows 配置保留/便携升级脚本不在本轮移植范围。收藏品、新干员与统计仍使用表中固定玩法提交。

0.2.0 把方法拆到独立模块，本工具包迁移了对应调用和资料切换屏障；代码补丁统一为 `patches/modpack-code.patch`，数据仍由独立生成器产生，五项开关默认关闭。

## 2026-10-07：三个可选拓展与全部 Mod 说明

- `lucky`：[来源 RiZhiZhaoYi/Stronghold-Protocol](https://github.com/RiZhiZhaoYi/Stronghold-Protocol)，固定提交 `941e6ef25c6b50a7a1b8e3a3fd73798b39d79c21`。
- `recruits`：[来源 Lunac1a/Stronghold-Protocol](https://github.com/Lunac1a/Stronghold-Protocol)，固定提交 `c8141334266fd1d5971ed996d62ac59addb92b5d`。
- `targeted`：[来源 Strinova-xinghui/Stronghold-Protocol](https://github.com/Strinova-xinghui/Stronghold-Protocol)，固定提交 `dcea3f7c97216bd638aaa90fbb74e1a905c2904b`。

恭喜发财选择性移植每席位不同五阶开局，保留共享卡池份数。额外干员选择性移植四名，排除丰川祥子重复实现及来源强制保留盟约的全局规则；开放望、陈、维什戴尔三技能与凯尔希二技能。来源机制资料哈希保留于派生源码 docs/custom-operators-provenance.json。定向甄选移植规则、奖励与装备筛选，但增加默认关闭房间开关，保留官方 DIY 私池。全部八项的点击说明、多资料集联机适配及服务器手动落子兼容由本仓库整合。来源代码继续按 GPL-3.0-or-later 及原署名保留，资源归各权利人。

谬因选择性取自 [SrC2O4 / Stronghold-Protocol](https://github.com/SrC2O4/Stronghold-Protocol)，固定提交 `c76a81fb5cd8ca5bb360ff10f834cc9a166b0c88`，GPL-3.0-or-later。保留专用技能适配与工具函数，只加入五阶普通/精锐二技能；按朋友版约定从来源协防归入莱茵生命。修正直线覆盖范围和中继器 25 秒生命周期，未开放三技能及完整友军折射。
