# 来源与署名

感谢原作者及各 fork 的贡献者。莱茵生命、收藏品、新干员与伤害统计是从下面的项目选择性移植并适配，不是本仓库从零原创。作者列使用 GitHub 账号；原项目其他贡献者的署名和版权声明同样保留。

## 引用项目与版本

这里记录实际引用的固定提交，不表示持续跟随来源仓库最新版。机器可读记录见 [upstream.lock.json](../upstream.lock.json)。

| 内容 | 来源仓库 | 作者账号 | 引用提交 |
|---|---|---|---|
| 游戏本体、规则、服务端、浏览器客户端及统一启动入口 | [Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol) | [sganggs](https://github.com/sganggs) | [a9dfd17bee029e09527f08c890f8933163e0bbaa](https://github.com/sganggs/Stronghold-Protocol/commit/a9dfd17bee029e09527f08c890f8933163e0bbaa) |
| 莱茵生命扩展 | [Stronghold-Protocol-Rhine](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine) | [YUYUYUYUYUYUYUTOUA](https://github.com/YUYUYUYUYUYUYUTOUA) | [1c520a17e9e161558464853b6aad385c96998af8](https://github.com/YUYUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine/commit/1c520a17e9e161558464853b6aad385c96998af8) |
| 收藏品玩法 | [Stronghold-Protocol-dlc](https://github.com/UNDFFIO/Stronghold-Protocol-dlc) | [UNDFFIO](https://github.com/UNDFFIO) | [17691f155a8fe062d85aecfeec2abe50f0359009](https://github.com/UNDFFIO/Stronghold-Protocol-dlc/commit/17691f155a8fe062d85aecfeec2abe50f0359009) |
| 新干员包 | [Stronghold-Protocol-Rem](https://github.com/remember-4/Stronghold-Protocol-Rem) | [remember-4](https://github.com/remember-4) | [97887cac3abc474f4933ac620ecbd043974c6f3d](https://github.com/remember-4/Stronghold-Protocol-Rem/commit/97887cac3abc474f4933ac620ecbd043974c6f3d) |
| 伤害统计 | [Stronghold-Protocol](https://github.com/Stardust-minus/Stronghold-Protocol) | [Stardust-minus](https://github.com/Stardust-minus) | [9bb6b2d833978c0aa9ef1713ef188d6c1588169f](https://github.com/Stardust-minus/Stronghold-Protocol/commit/9bb6b2d833978c0aa9ef1713ef188d6c1588169f) |

## 移植范围与本仓库改动

- **莱茵生命**：科研装置、莱茵干员、盟约与装备等来自莱茵扩展；本仓库将其适配到固定上游、4 人房间和可选资料集。主要位于 `mods/rhine/`。
- **收藏品**：收藏品内容及相关玩法来自 UNDFFIO 的 dlc 项目；本仓库将其整合为默认关闭的房间选项，并兼容莱茵及服务器演算。
- **新干员**：结城理、娜仁图亚、予愿安洁莉娜、丰川祥子及相应实现来自 remember-4 的 Rem 项目；选择性移植干员、技能与模组，不包含该来源的全局拥有属性加成和敌人禁用规则。
- **伤害统计**：统计实现与面板基础来自 Stardust-minus 的 fork；本仓库适配现有服务器演算、联防、Boss 与重连，仅保留本轮/上一轮，不新增永久战绩。
- 上述三项 party 拓展主要位于 `mods/party/party-code.patch` 与 `mods/party/generate-data.mjs`；它们是整合后的代码补丁与生成器，不是原仓库完整镜像。
- **本仓库新增与整合工作**：额外 4 回合规则、独立房间开关、等待室同步、多资料集隔离、勾选框与多列界面、朋友服资源配置，以及固定版本构建、Docker Compose、更新和回退流程。统一本地启动入口本身来自上游，本仓库补充其 Mod 接入指导。

仓库与部署工具由 [llleeeqi](https://github.com/llleeeqi) 维护。对原代码的修改与整合不改变来源署名；引用不代表原作者参与、授权背书或认可本整合版。

## 许可与素材权属

代码采用 GPL-3.0-or-later，保留原项目 LICENSE、NOTICE 和第三方许可。游戏角色、美术、音频、Spine、官方数据及其他第三方内容仍归相应权利人，代码许可不扩大到这些内容。

详见 [上游声明](UPSTREAM-NOTICE.md)、[莱茵声明](RHINE-NOTICE.md)、[莱茵第三方声明](RHINE-THIRD-PARTY-NOTICES.md) 与 [LICENSE](../LICENSE)。再发布构建或继续移植时须保留相关声明，并同步记录新增来源。

## 2026-10-06 选择性同步

莱茵原覆盖层基于 `cd09d57771f1d3ded43e3330ee47ace2de338130`，科研更新取自 `1c520a17e9e161558464853b6aad385c96998af8`（v0.1.3-rhine.2）。移植六莱茵攻击共享、三阶段能量装置、持续减速、主机上限调整与装置停机/重连反馈；没有整体替换为来源 fork 的六人规则，也没有完整合入该 fork 的本体分支。

新干员原覆盖层基于 `df2488f021e1b069c22c9215f586559ec388b153`，修复取自 `97887cac3abc474f4933ac620ecbd043974c6f3d`。四名自定义干员保持；同步普通合成后的计数重置、拉普兰德刷新重触发与联防复活。联防复活随新干员包开启，适配为沿用当前本体的站位优先三名规则，分队及盟约额度由各玩家独立使用。没有移植来源的自持有 +10%、禁怪或默认 Touch AI。

伤害统计来源的新提交主要为来源部署及网络设置，本轮仍引用原统计提交；收藏品来源没有变化。代码增量在 `patches/source-updates.patch`，数据刷新在 `mods/rhine/refresh-data.mjs`。原有许可、署名及源项目声明继续适用。
