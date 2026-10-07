# 部署与更新流程

## 构建顺序

stage.sh 在 `state/stages/NAME/source` 中：

1. 获取固定干净上游并克隆候选。
2. 应用 patches/modpack-code.patch，安装锁文件依赖；新版上游模块保留。
3. 生成莱茵及完整原版快照，再仅生成 +4 回合数据，不复制 UI 覆盖文件。
4. 刷新莱茵科研数据，追加莱茵谬因，再生成原四套及各自 -custom 的八套资料。
5. 校验/下载原版、莱茵（含谬因）、两个干员包和收藏品资源，执行测试。
6. 记录 UPSTREAM_REVISION / MODKIT_REVISION，全部成功才写 READY。

失败保留 build.log，不改变线上。重新构建使用新阶段名，可复用已下载文件。构建默认最多 768 MiB，调整方式：`BUILD_MEMORY=1g bash scripts/stage.sh ...`。运行配置由 .env 读取，构建 BUILD_MEMORY 通过 shell 环境传入。

## 复用与快速检查

```bash
bash scripts/stage.sh --source /abs/clean-upstream --assets-from /abs/old-runtime --name update-001
bash scripts/verify-patches.sh /abs/clean-upstream
```

source 的 HEAD 等于指定 revision。baseline 数据只读，依赖和生成文件写候选。verify-patches.sh 不安装依赖、不下载资源，其候选没有 READY，不能直接部署。

## 更新上游

```bash
git ls-remote https://github.com/sganggs/Stronghold-Protocol.git HEAD
bash scripts/stage.sh --revision FULL_40_CHARACTER_SHA --name update-002
```

核对默认关闭、256 种组合、多人资料载入、准备清除、开局锁定、收藏品与莱茵共存、新干员技能和重连。成功后更新 upstream.lock.json revision，提交补丁适配及验证结果。

0.2.1 的代码补丁导出基线为 upstream.lock.json 的完整官方提交，包含八项拓展的代码，排除 data/ 和运行资源。资料集由独立生成器重建；八项仍由房间开关分别控制。后续新上游必须适配补丁并检查方法模块，不能直接复用旧 UI 覆盖文件。

## 切换与回退

```bash
bash scripts/activate.sh update-002
bash scripts/status.sh
bash scripts/activate.sh first  # 回退至旧 READY 阶段
```

activate.sh 验证 Compose，检查已管理实例 rooms=0/matches=0，原子更新 state/current，再 force-recreate 本游戏。无法启动或 healthz 不可用则恢复旧链接与旧容器；首次部署没有旧版本时停止失败容器。

healthz 表示进程健康，切换后还需验证公网及联机。服务器演算支持在线断线重连，重启进程不保留对局。

Compose 项目名 lele-stronghold，独立于其他项目。迁移已有服务时准备候选后按用户授权确认空闲并释放目标端口。

## 管理

```bash
docker compose logs --tail 100 game
docker compose stop game  # 明确停止本游戏时使用
docker compose start game
bash scripts/status.sh
```

旧阶段保留作回退，确认不再需要后只清理明确指定的目录。公网链接使用 .env 的 PORT，配置反代时检查 WebSocket。

科研来源只选择性移植玩法与校验改动，保留来源署名，不把来源 fork 的 Windows 更新器或服务器配置覆盖到候选目录。
