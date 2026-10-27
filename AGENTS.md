# Agent：部署与维护

先读README.md、docs/PLUGINS.md、docs/DEPLOYMENT.md与upstream.lock.json。继续使用用户已有授权、服务器信息与本会话工作子目录，不重复询问。

这是八个独立插件与固定0.3.3宿主兼容层，不是纯原版即装即用插件，也不是自制新加载器。plugins/lele-*/保存可发布源码；patches/modpack-code.patch保存共享宿主适配。不要掩盖这一依赖，不要绕过官方PLUGIN_*检查。

## 部署

用scripts/stage.sh构建独立候选，复用旧素材缓存；生成器只为素材准备历史数据，finalize-plugin-host.mjs恢复官方原版基线，install-plugins.mjs安装、检查、打包八项插件。全部默认关闭，使用上游room.setPlugins/contentReady/cs流程，勿恢复旧八个私有房间开关或客户端资料切换。

已有适配宿主可用node scripts/install-plugins.mjs /abs/game [lele-id ...]单独安装。不要覆盖.env、plugins/config.json、其他作者插件或凭据。发布单个zip与整套目录包，写清整套包不能当单插件zip导入。

检查既有服务、资源、端口和healthz。候选检查失败不得READY。已有授权且rooms=0、matches=0时用scripts/activate.sh切换；活跃时保留候选等待。保留上一版回退；不要重启正在进行的对局。验证公网页面、WebSocket、插件清单、房间校验与在线重连，最后给可用链接。

## 更新与贡献

官方主线优先，插件为可选附加。更新时保留官方新接口与对局行为，不为迁就插件回滚官方实现。来源新玩法可以单独评估；已整合提交和仅检查的 HEAD 必须分开记录，不自动扩大本体改动。

固定完整上游SHA，保留干净基线；源码补丁、插件源码、lock与说明一起提交。功能插件数据与选定集合进入内容哈希，服务端和客户端必须使用同一快照。插件不能改原型键或伪造其他插件身份。不要放宽通用数值上限来使检查通过。

脚本默认关闭，本包不需要trusted-force或沙箱脚本执行。共享引擎随宿主构建，删除插件不会物理剔除引擎代码，但会关闭对应内容。新增功能优先用上游公开接口，缺接口才集中维护宿主适配；不要复制一套加载器。

移植任何内容时更新README、notices/SOURCES.md、upstream.lock.json和对应插件README中的来源作者、仓库、完整SHA与边界。不放官方美术进插件包；素材下载/引用由宿主处理。

不要做无关重复全量测试。围绕改动验证插件单开、主要组合、原版隔离、房主权限、内容校验、开局和重连；改动AI决策前另读docs/AI-STATUS.md。不得上传真实主机、令牌、私有配置或运行日志。
