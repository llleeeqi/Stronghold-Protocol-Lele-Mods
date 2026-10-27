# 本地统一开服端接入

当前固定官方0.3.3，保留其 scripts/start-windows.bat、scripts/start.sh 和 scripts/launch.mjs 统一入口。先按 [部署说明](DEPLOYMENT.md) 构建带宿主API1与八个插件的游戏候选，不能把本工具包目录直接当游戏本体，也不能把插件直接装到未适配的官方整合包。

云服继续用Docker Compose。Windows构建建议WSL与Docker；本仓库没有额外的原生Windows安装器。构建完成后可以复制候选到本机，安装与目标平台匹配的Node依赖和资源，使用Node22或24。

在已构建游戏目录运行：

```bash
SP_COMBAT=server SP_VERIFY=off SP_FRIENDS=1 node scripts/launch.mjs --no-setup --port 3000
```

PowerShell：

```powershell
$env:SP_COMBAT='server'
$env:SP_VERIFY='off'
$env:SP_FRIENDS='1'
node scripts/launch.mjs --no-setup --port 3000
```

--no-setup只适用于资源与依赖已准备完成的候选。不要同时在相同端口启动Compose和本机Node服务。外部启动器更新不会自动重做本仓库宿主适配；升级时重新构建候选并验证。

玩家在房间内使用官方插件面板选择和准备。工作台/studio/沿用官方本机/LAN管理规则，远程使用SSH转发。该启动端仍以浏览器游玩，不是安卓APK或独立渲染客户端。
