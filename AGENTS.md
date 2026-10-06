# Agent 部署说明

这是独立 Mod 构建工具包。先读 README.md、docs/DEPLOYMENT.md、docs/MODS.md、upstream.lock.json。

## 部署信息与授权

确认目标服务器、目录、资源余量、Docker/Compose v2、公网端口或反代入口。检查已有服务、端口和游戏 healthz。用户已有的信息和授权继续有效，无需重复询问。

## 目录规则

- upstream.lock.json 固定完整上游提交，保持干净 checkout 不变。
- mods/rhine 是莱茵补丁；long-session-build.mjs 独立生成 +4 规则。
- mods/party 是收藏品、新干员、伤害统计适配补丁及数据生成器。
- patches/friends-profile.patch 是朋友服资源限制；compose.yml 是部署默认值。
- state/、.env 为本机私有状态。凭据、SSH 信息、会话令牌、真实主机配置和日志留在本机。

## 执行流程

1. 复制 .env.example 为 .env，确定 PORT，执行 `bash scripts/stage.sh --name NAME`。
2. 可用 `--source /abs/upstream` 指定已有干净 checkout：HEAD 等于指定 revision，tracked 文件无修改。
3. 可用 `--assets-from /abs/runtime` 复用资源和下载缓存，脚本仍验证/补全。
4. 记录候选目录和测试输出；检查五个开关、四个资料集、房主权限、准备清除、开局锁定、服务器演算、多人及重连。
5. 已授权部署且 healthz rooms=0/matches=0 时执行 `bash scripts/activate.sh NAME`。有等待室或对局时保留候选，空闲后继续。stage.sh 永远不重启游戏。
6. 从公网验证页面、WebSocket、多人和重连，用 status.sh 检查健康与占用。最终给用户可用链接。

## 更新与失败处理

用 `--revision FULL_SHA` 构建新上游候选，成功后更新 lock。保持完整提交固定；git apply、数据生成、资源下载或测试失败时停止切换。

有冲突时在新 worktree 适配补丁，保留默认关闭、4 席、原版数据隔离与最后一关 Boss 规则，复测后切换。回退使用旧 READY 阶段：`bash scripts/activate.sh PREVIOUS_NAME`。

更改其他服务依照用户具体授权。清理自建测试客户端、房间和容器，保留可回退版本。

## 交付

提交补丁、脚本、固定版本和说明，资源及运行状态保存在 state/。区分短局占用与长期峰值、在线重连与跨重启恢复，报告真实验证结果。
