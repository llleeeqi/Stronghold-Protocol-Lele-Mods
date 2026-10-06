# 乐勒砳特供 · Stronghold Protocol Mods

为朋友小服整理的独立 Mod 工具包，基于 [Stronghold Protocol](https://github.com/sganggs/Stronghold-Protocol)。采用可重放补丁与数据生成器：保留干净上游，构建单独运行目录，再交给 Docker Compose。适配版本见 [upstream.lock.json](upstream.lock.json)。

莱茵生命、收藏品、新干员和伤害统计来自其他作者的项目，本仓库做选择性移植、兼容整合与部署封装。感谢 [sganggs](https://github.com/sganggs) 及各拓展作者；这些玩法的原有实现与创意归原贡献者，不以本仓库名义宣称原创。

| 可选内容 | 开启后的效果 | 来源项目 / 作者 |
|---|---|---|
| 额外 4 回合 | 常规 14 → 18，短单人 9 → 13，Boss 在最后一关；延长模式关闭额外隐藏关 | 本仓库新增规则与开关，基于上游回合系统 |
| 莱茵生命 | 科研装置、莱茵干员、盟约和装备 | [Stronghold-Protocol-Rhine / YUYUYUYUYUYUYUTOUA](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine) |
| 收藏品玩法 | 39 件收藏品，战后三选一，逆风补给与护盾，本局持续增益 | [Stronghold-Protocol-dlc / UNDFFIO](https://github.com/UNDFFIO/Stronghold-Protocol-dlc) |
| 新干员包 | 结城理、娜仁图亚、予愿安洁莉娜、丰川祥子，实际技能与模组 | [Stronghold-Protocol-Rem / remember-4](https://github.com/remember-4/Stronghold-Protocol-Rem) |
| 伤害统计 | 实际扣血排行，召唤物归属干员，保存本轮/上一轮，不写战绩 | [Stronghold-Protocol / Stardust-minus](https://github.com/Stardust-minus/Stronghold-Protocol) |

游戏本体来自 [sganggs / Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol)。本仓库主要补充独立房间开关、+4 回合、多资料集联机适配、朋友服配置、界面整合与 Docker 部署流程。[完整来源、引用提交与移植范围](notices/SOURCES.md) 可供核对；引用不代表来源作者参与或认可本整合版。

2026-10-06 已同步莱茵 `v0.1.3-rhine.2` 的科研玩法与新干员来源修复，详见 [更新说明](docs/MOD-UPDATES.md)；四人房和五个独立开关保留。

所有拓展默认关闭，可自由组合。大厅和等待室统一用勾选框：宽屏三列、中等屏两列、窄屏一列。房主在等待室切换，无需重建房间；切换清除玩家准备，开局后锁定，重连保留本局设置。

服务器演算，最多 4 人合作；原版/莱茵 × 新干员关闭/开启四套资料隔离。

## 首次部署

### 推荐：交给 Agent 部署

建议优先交给 Agent 完成部署。可以使用 DSH、WorkBuddy、OpenCode 等能读仓库并执行命令的 Agent。把仓库链接与下面这段话交给它，提供目标电脑或服务器的实际环境即可；这些工具不是本项目的运行依赖。

> 请部署这个仓库的 Mod 版。先阅读 AGENTS.md、README.md 和 docs/DEPLOYMENT.md，按 upstream.lock.json 固定版本，在独立目录构建并验证，保留五个默认关闭的拓展开关。云服务器优先 Docker Compose；本地开服请按 docs/LOCAL-LAUNCHER.md 使用上游统一启动入口，必须启动带 Mod 的构建目录。保护已有服务和活跃房间，部署后验证多人同步与重连，最后给我可用地址。

上游整合包和本地统一启动入口的接入说明见 [本地开服与 Agent 适配指引](docs/LOCAL-LAUNCHER.md)。当前工具包默认仍用 Docker 构建（Windows 可用 WSL），不宣称提供原生 Windows 一键 Mod 安装器，也不自动兼容未经验证的最新上游。

### 手动部署

推荐 Linux 服务器或 WSL，安装 Git、Python 3、Docker Engine 和 Compose v2。宿主机无需安装 Node。预留资源下载和候选版本的磁盘空间；小内存服务器建议配置至少 2 GB swap。

```bash
git clone https://github.com/llleeeqi/Stronghold-Protocol-Lele-Mods.git
cd Stronghold-Protocol-Lele-Mods
cp .env.example .env
# 按需修改 PORT，默认 33000
bash scripts/stage.sh --name first
bash scripts/activate.sh first
bash scripts/status.sh
```

打开 `http://服务器公网IP:33000/`，在安全组/防火墙放行实际 PORT 的 TCP。域名和 HTTPS 可接已有反向代理。首次构建需访问 GitHub、npm 和资源站点，图片、模型和音频由脚本下载到本机。

Compose 默认限制 640 MiB、Node heap 384 MiB、1 CPU，只读运行目录、受限权限和滚动日志。朋友服保留在线断线重连，并限制闲置房间和队列；重启进程会结束原有房间和对局。

## 部署、更新与回退

- [Agent 操作说明](AGENTS.md)
- [部署与更新流程](docs/DEPLOYMENT.md)
- [Mod 分层与开关协议](docs/MODS.md)
- [AI 托管、漏怪与实验结果](docs/AI-STATUS.md)
- [来源与许可](notices/SOURCES.md)

`stage.sh` 只构建候选；`activate.sh` 才切换线上，存在房间或对局会拒绝切换，启动检查失败自动回退。上游更新先在隔离目录验证补丁与联机，再修改固定版本。

GitHub 的 Code → Download ZIP 下载本工具包；游戏本体由脚本获取。

## 版权

代码 GPL-3.0-or-later，见 [LICENSE](LICENSE)。保留上游与扩展作者署名。《明日方舟》的角色、美术、音频、官方数据等归相应权利人所有，不因本仓库 GPL 获得许可；详见 [上游声明](notices/UPSTREAM-NOTICE.md) 和莱茵相关声明。
