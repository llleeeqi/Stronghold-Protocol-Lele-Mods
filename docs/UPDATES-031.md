# 官方 0.3.1 兼容更新（2026-10-18）

本轮以官方主线为基准，固定 `c9d804f470b8d7422ae04eb66faf671cef21ad52`（package.version 0.3.1）。保留官方新增的插件交互窗口、规则选项、特质与外观接口；本包仅维护既有八项插件和宿主必要适配，不加入延迟补偿。

既有拓展玩法版本保持不变；八项插件重新基于 0.3.1 数据生成，插件版本 0.3.3。+4 回合继续保留隐藏 Boss 原版条件。新增来源玩法不代表已整合。

## 来源审查

| 来源项目 | 检查提交 | 本轮范围 |
|---|---|---|
| [YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine](https://github.com/YUYUYUYUYUYUYUTOUA/Stronghold-Protocol-Rhine) | `6e2d50a018522f8c19554748845fdc70b24d8626` | 来源有更新；本轮仅审查，已整合玩法提交仍见 lock.mods |
| [UNDFFIO/Stronghold-Protocol-dlc](https://github.com/UNDFFIO/Stronghold-Protocol-dlc) | `f5ba4bf157e0ba176758fe8e46778ed6f9d5e971` | 来源有更新；本轮仅审查，已整合玩法提交仍见 lock.mods |
| [remember-4/Stronghold-Protocol-Rem](https://github.com/remember-4/Stronghold-Protocol-Rem) | `97887cac3abc474f4933ac620ecbd043974c6f3d` | 来源无更新，保留已整合版本 |
| [Stardust-minus/Stronghold-Protocol](https://github.com/Stardust-minus/Stronghold-Protocol) | `3dbdbc25c9cf372b31d95e48546e23ad907e8ebb` | 来源有更新；本轮仅审查，已整合玩法提交仍见 lock.mods |
| [RiZhiZhaoYi/Stronghold-Protocol](https://github.com/RiZhiZhaoYi/Stronghold-Protocol) | `ed42928d707303a7f6ba1c20fadf7545de20cbca` | 来源有更新；本轮仅审查，已整合玩法提交仍见 lock.mods |
| [Lunac1a/Stronghold-Protocol](https://github.com/Lunac1a/Stronghold-Protocol) | `c8141334266fd1d5971ed996d62ac59addb92b5d` | 来源无更新，保留已整合版本 |
| [Strinova-xinghui/Stronghold-Protocol](https://github.com/Strinova-xinghui/Stronghold-Protocol) | `a552329e588de19ab94939cbe2fbb3083cafe558` | 来源有更新；本轮仅审查，已整合玩法提交仍见 lock.mods |
| [SrC2O4/Stronghold-Protocol](https://github.com/SrC2O4/Stronghold-Protocol) | `c76a81fb5cd8ca5bb360ff10f834cc9a166b0c88` | 来源无更新，保留已整合版本 |

阵营来源新增麦哲伦替换固定多萝西、梅尔/白面鸮平衡、卡兹戴尔九档和亡魂联防延续，以及雷姆必拓。收藏品来源新增低血量、技能结束回技力等机制；伤害来源增加治疗统计。上述新玩法本轮不导入，优先保证官方升级与现有插件兼容。鸭梨手机仍排除。

原作者署名与原项目地址保留在各插件说明和 [来源署名](../notices/SOURCES.md)。`mods` 记录实际整合提交，`source_audit.heads` 仅记录检查到的最新提交。

## 验证与限制

- 干净官方提交可直接应用宿主补丁；修改的 JavaScript 语法检查通过，八项插件官方 strict check/pack 全部通过。
- 本地兼容检查 164 项通过；官方商店规则专项修正后 7 项通过。
- Linux 候选补充验证 167 项通过；额外的 operator-traits 整套测试在测试进程 512 MiB 堆上限退出，不能记为全量通过。该套首个特质增删／回归原版数据单例本地单独通过；Windows 还存在符号链接 EPERM 限制。
- 双真实浏览器（桌面＋触屏）、八插件全开：实际点击购买、拖放＋朝向确认、点击已部署干员、撤退、房间及局内重连、首轮结算至第二轮通过，页面异常记录为空。

- 同样操作的全插件关闭／原版对照通过，页面异常记录为空。

这不是所有官方功能与插件组合的全量验收。本轮不改运行内存限额，不加入延迟补偿，不移植来源新玩法。
