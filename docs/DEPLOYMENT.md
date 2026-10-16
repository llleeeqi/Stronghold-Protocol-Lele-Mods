# 部署、更新与回退（0.3.0）

首次部署建议交给 Agent，先读 README、AGENTS.md 和 [插件兼容边界](PLUGINS.md)。需要 Git、Python 3、Docker Compose；Windows 可用 WSL。复制 `.env.example` 为 `.env`，设置端口和资源限制，保留已有 Compose 项目名与其他服务配置。

```bash
bash scripts/stage.sh --name plugins-030
bash scripts/activate.sh plugins-030
```

stage 在独立目录获取 upstream.lock.json 固定的官方 0.3.0，检查并应用宿主补丁，安装锁文件依赖。历史数据生成器只为准备素材使用；下载完成后恢复官方原版基线，写入 Lele API 1 标记，再安装、严格检查和打包八个插件。最终检查成功才写 READY，不改变运行中的服务。

```bash
bash scripts/stage.sh --source /abs/clean-upstream --assets-from /abs/old-runtime --name update-001
```

干净 source 的 HEAD 必须等于固定上游 SHA。素材使用普通复制，不能用会修改旧版本的硬链接。构建内存默认768MiB，可用 BUILD_MEMORY=1g 调整。Compose运行限制由 .env 设置；构建限制与运行限制独立。

仅检查补丁和插件、不下载素材：`bash scripts/verify-patches.sh /abs/clean-upstream`。该命令安装依赖并准备检查候选，没有 READY，不能直接上线；随后可执行 `bash scripts/test.sh /abs/check/source`。检查围绕插件组合、房间内容校验、重连和相关界面，不重复全量测试。

## 更新插件和本体

已有本仓库适配宿主，可在独立候选运行 `node scripts/install-plugins.mjs /abs/game [lele-id ...]`。它不覆盖 .env、其他作者插件和 plugins/config.json。插件依赖宿主API1，纯原版会明确拒绝，不能跳过检查。

升级本体先适配新的固定 SHA、重做 patches/modpack-code.patch，再更新 lock、插件锁和说明。不能只修改 revision 就声称兼容。生成器负责重建素材输入，plugins/ 保存正式功能数据，运行时不依赖旧八套资料切换。

## 切换和回退

```bash
bash scripts/activate.sh update-001
bash scripts/status.sh
# 回退时传入上一份仍保留的 READY 阶段名
bash scripts/activate.sh PREVIOUS_STAGE
```

activate 检查 rooms=0、matches=0 后原子更新 state/current 并重建游戏容器；健康检查失败恢复旧版。仅重建本游戏。保留上一版本及其干净git基线（候选git可能使用alternates），清理明确不再使用的阶段，不影响其他服务。

切换后检查公网页面、/healthz、/plugins/index.json、WebSocket、等待室插件更改、内容准备和在线重连。服务器演算支持断线重连，进程重启不恢复进行中的对局。朋友进入原游戏链接，在房间插件面板选择；所有拓展默认关闭。

远程管理插件工作台请用SSH转发，保留上游本机/LAN访问规则。公网反代须支持WebSocket。

## 朋友服的插件内存预算

`SP_FRIENDS=1` 时，插件组装缓存只留最近一份，房间服务只额外保留一份闲置内容集；正在使用的房间内容仍保留。对局子进程的堆上限为256MiB，闲置30秒后退出，避免上游768MiB单进程默认值与整个容器640MiB额度冲突。这是资源限制，不改变玩法或内容哈希。

Compose默认物理内存上限仍为 `MEMORY_LIMIT=640m`，`MEMORY_SWAP_LIMIT=1280m` 表示**内存加swap总额**，允许使用最多640MiB主机swap；须先在主机启用swap。此前将两者设成640m实际禁止了容器使用swap。swap用于缓冲短时峰值，不能视为多人多房间的内存保证。

插件应用请求单独等待最多60秒，普通游戏操作超时保持原样；失败在插件面板保留原因和选择。真实部署验证须包含“原版→组合A→关闭→组合B”的多次切换，仅验证全部插件全开不能覆盖缓存累积问题。
