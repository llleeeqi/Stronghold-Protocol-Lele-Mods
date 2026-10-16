# 乐勒砳特供 · Stronghold Protocol Plugins

同一项目下的八个独立玩法插件，适配官方 **0.3.0**。各项可以单独安装、选择和移除，也提供整套下载。默认全部关闭，使用上游自带的插件面板与内容校验。

**目前需要本仓库的宿主适配 API 1，不能直接装到纯原版 0.3.0。** 科研装置、魂灵、收藏品复活等流程还没有完整的上游插件接口，因此仍保留版本固定的共享宿主补丁；八个插件负责各自数据和启用状态。缺少兼容层时明确拒绝加载。详见 [插件与兼容边界](docs/PLUGINS.md)。

## 首次部署：建议交给 Agent

DSH、WorkBuddy、OpenCode 等能读仓库和执行命令的 Agent 均可使用。把仓库地址与下面这段话交给它：

> 请部署这个仓库的0.3.0插件版。先读AGENTS.md、docs/PLUGINS.md、docs/DEPLOYMENT.md和upstream.lock.json。构建带Lele宿主兼容层的独立候选，安装八个插件，默认全部关闭。不要只把插件放进纯原版目录。云服务器使用Docker Compose，保留其他服务与正在进行的对局，空闲后切换并验证公网、房间内容校验和在线重连，最后给我可用链接。

```bash
git clone https://github.com/llleeeqi/Stronghold-Protocol-Lele-Mods.git
cd Stronghold-Protocol-Lele-Mods
cp .env.example .env
bash scripts/stage.sh --name plugins-030
bash scripts/activate.sh plugins-030
```

已有本仓库0.3.0适配宿主时，可单独安装：`node scripts/install-plugins.mjs /abs/game lele-factions lele-relics`。安装器不覆盖其他插件或服务器配置。游戏默认端口33000；本地开服见 [启动端接入](docs/LOCAL-LAUNCHER.md)。

## 八个插件

| 可选内容 | 开启后的效果 | 来源项目 / 作者 |
|---|---|---|
| 额外 4 回合 | 常规 14 → 18，短单人 9 → 13，Boss 在最后一关；延长模式关闭额外隐藏关 | 本仓库新增规则与开关，基于上游回合系统 |
| 更多阵营 | 莱茵生命：生态治疗/减速/护盾、能量充能、九人激光钻机；卡兹戴尔：10名成员、完整技能魂灵、21格众魂炮与转职装备；保留谬因 | [Stronghold-Protocol-Rhine / YUYUYUYUYUYUYUTOUA](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine)；谬因来自 [SrC2O4](https://github.com/SrC2O4/Stronghold-Protocol) |
| 收藏品玩法 | 46 件收藏品，战后三选一；包含一次复活、敌人转移、治疗屏障与组合减伤，默认关闭 | [Stronghold-Protocol-dlc / UNDFFIO](https://github.com/UNDFFIO/Stronghold-Protocol-dlc) |
| 新干员包 | 结城理、娜仁图亚、予愿安洁莉娜、丰川祥子，实际技能与模组 | [Stronghold-Protocol-Rem / remember-4](https://github.com/remember-4/Stronghold-Protocol-Rem) |
| 伤害统计 | 实际扣血排行，召唤物归属干员，保存本轮/上一轮，不写战绩 | [Stronghold-Protocol / Stardust-minus](https://github.com/Stardust-minus/Stronghold-Protocol) |
| 恭喜发财 | 每席位随机不同五阶开局，照常消耗共享卡池份数 | [RiZhiZhaoYi](https://github.com/RiZhiZhaoYi/Stronghold-Protocol) |
| 额外干员包 | 望、赤刃明霄陈、凯尔希·思衡托、维什戴尔；不重复丰川祥子，同时开启更多阵营时采用卡兹戴尔维什戴尔 | [Lunac1a](https://github.com/Lunac1a/Stronghold-Protocol) |
| 定向甄选 | 晋升奖励仅第一位向主要盟约加权 ×2.6，后两位随机；第6回合起转职装备加权 ×2.6 | [Strinova-xinghui](https://github.com/Strinova-xinghui/Stronghold-Protocol) |


插件目录为 `plugins/lele-rounds`、`lele-factions`、`lele-relics`、`lele-operators`、`lele-damage`、`lele-lucky`、`lele-recruits`、`lele-targeted`。每项均有说明与来源。房主在等待室插件面板连续勾选时只暂存选择，点击“加载所选插件”（或关闭面板）后统一应用一次，显示启动与内容校验进度；所有玩家校验并重新准备后开局。开局锁定，在线重连保留同一份内容。

0.3.0没有把固定自定义干员所需的缺失补位形态变出来：缺失官方补位资料的新增干员按PRESET本人上场。更多阵营与额外干员同时开启时，只保留卡兹戴尔维什戴尔。鸭梨手机继续不加入；训练模式不延长。

## 来源与更新

本体来自 [sganggs/Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol)。除额外回合与本仓库整合外，多数玩法来自社区作者；感谢各来源贡献者，原有创意和实现不以本仓库名义宣称原创。

准确仓库、作者、完整提交和选择性移植范围见 [notices/SOURCES.md](notices/SOURCES.md)。本次迁移保留2026-10-14已核对的玩法版本，升级本体及插件安装链路，不把迁移工作称为已同步所有来源的新HEAD。

- [插件、安装与兼容边界](docs/PLUGINS.md)
- [部署、更新与回退](docs/DEPLOYMENT.md)
- [更多阵营玩法](docs/MORE-FACTIONS.md)
- [46件收藏品](docs/COLLECTIBLES.md)
- [更新记录](docs/MOD-UPDATES.md)

朋友服Compose默认640MiB内存、384MiB Node heap、1CPU、服务器演算、不写永久战绩。限制不是满载保证；活跃内容集会使用上游独立对局宿主。重启不恢复进行中的对局。上游插件工作台沿用本机/LAN访问规则。
