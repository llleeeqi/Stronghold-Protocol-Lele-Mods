# 本地统一开服入口与 Agent 适配

适用于 DSH、WorkBuddy、OpenCode 或其他能读文件、执行命令的 Agent。工具名称不影响部署方式，先确认目标系统、Node/Docker 环境、端口和朋友的接入方式。

## 两个目录，两个职责

本仓库是 Mod 构建工具包，不是整合好的游戏本体。`stage.sh` 生成的 `state/stages/NAME/source` 才是带 Mod 的游戏目录。上游整合包可以用于原版游玩，但直接运行它不会加载本工具包的拓展。

上游统一开服入口包括 `scripts/start-windows.bat`、`scripts/start.sh` 和共用的 `scripts/launch.mjs`：检查环境、准备资源、启动 Node 服务并打开浏览器。该入口已存在于本工具包当前固定上游版本；它不是独立渲染客户端，也不会自动安装本仓库的补丁。

优先保留这个入口，接入已生成的 Mod 目录，不另写一套游戏服务器。官方整合包或其他外部启动器的最新版仍需单独检查，不能仅凭“能打开页面”判定 Mod 兼容。

## 推荐路径

云服务器仍按 README 使用 Docker Compose，无需桌面启动器。Windows 本地构建可先使用 WSL 与 Docker；当前未提供原生 Windows 一键 Mod 安装器。先按 `stage.sh` 流程完成补丁、所有资料集、资源和测试，得到 READY 候选。

需要本机 Node 启动时，安装 Node.js 22 或 24。在已构建游戏目录运行；资源已经准备好的候选可使用统一入口的 `--no-setup`，避免启动时再次执行资源准备流程。不要同时在相同端口运行 Compose 服务。

Linux/macOS 示例（宿主机已具备 Node 和本平台运行依赖）：

```bash
cd /abs/Stronghold-Protocol-Lele-Mods/state/stages/NAME/source
SP_COMBAT=server SP_VERIFY=off SP_FRIENDS=1 \
  node scripts/launch.mjs --no-setup --port 3000
```

Windows PowerShell 示例（Mod 候选已构建并复制到本机，依赖与资源已检查）：

```powershell
Set-Location 'C:\Games\Stronghold-Modded'
$env:SP_COMBAT = 'server'
$env:SP_VERIFY = 'off'
$env:SP_FRIENDS = '1'
node scripts/launch.mjs --no-setup --port 3000
```

本地直接启动不会读取工具包的 `.env` 或自动继承 Compose 的内存/CPU限制。Agent 应按目标机器设置实际环境变量与资源限制。跨系统搬运时不要默认 Linux `node_modules` 适用于 Windows；依照锁文件在目标系统安装运行依赖并检查 `public/vendor`，不要重建或覆盖 Mod 数据。以上是接入指导，不代表已完成 Windows/macOS 实机验收。

## 跟进新上游时

1. 先比较新旧 `scripts/launch.mjs`、启动包装脚本、`tools/setup.mjs` 和 `package.json`；确认参数、环境继承、资源下载与数据生成行为。
2. 在新候选适配补丁和生成器，不覆盖干净基线，不直接把最新整合包当作 `--source`。该参数要求完整 SHA 对应的干净 Git checkout。
3. 素材可通过 `--assets-from` 复用；同版本本地提取资源还需核对 `data/local-assets.json` 与引用文件，不能只复制贴图。原版 setup 也不会替你补全莱茵、新干员和收藏品资源。
4. 验证五个拓展默认关闭、等待室切换同步、资料集隔离、开局锁定、多人和在线断线重连；服务器演算保持 `SP_COMBAT=server`，不要因启动入口默认值退回浏览器演算。
5. 检查端口对应的实际进程和版本。上游启动器发现已有游戏服务时可能直接打开旧服务；不要把复用旧进程误认成新候选已上线。

通过后才更新固定版本和部署。启动、下载、数据生成或补丁适配失败时保留旧版本，报告具体问题。

## 朋友如何连接

本机打开 `http://localhost:3000/`；同一局域网的朋友使用主机局域网 IP，跨网朋友需要公网服务或已配置的组网/隧道，并保证 HTTP 与 WebSocket 可达。建房后分享房间链接或密钥，在等待室勾选需要的拓展。

在线重连依赖服务进程仍在运行；关闭本地开服窗口或重启服务器不会保留原有对局。保留上游 NOTICE、LICENSE 与第三方声明，游戏素材及非商业使用要求不因接入启动器而改变。

参考：[上游 README](https://github.com/sganggs/Stronghold-Protocol#快速开始)、[上游部署文档](https://github.com/sganggs/Stronghold-Protocol/blob/main/docs/DEPLOY.md)。具体行为以所选固定提交源码为准。
