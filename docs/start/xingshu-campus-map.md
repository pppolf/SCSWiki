---
title: 行署校区三维地图
description: 可旋转、缩放和点选建筑的行署校区非官方三维白模
category: start
audience:
  - 本科新生
  - 行署校区学生
content_type: experience
status: needs-review
maintainers:
  - SCSWiki 维护组
sources:
  - name: OpenStreetMap contributors
    url: https://www.openstreetmap.org/copyright
  - name: 西华师范大学行署校区三维全景漫游
    url: https://www.cwnu.edu.cn/qjxy/bh/index.html
---

<ContentMeta />

# 行署校区三维地图

这是一份由学生整理的行署校区非官方三维白模。你可以拖动旋转、滚轮或双指缩放，
也可以点击建筑查看当前登记名称。

<ClientOnly>
  <XingshuCampusMap />

<template #fallback>

<p>三维地图需要在浏览器中加载，请稍候。</p>
</template>
</ClientOnly>

## 使用前请注意

- 本图不是学校发布的校园导航图、测绘成果或应急疏散图。
- 建筑名称、用途、轮廓、高度和现状仍有待核验项，请以现场标识和学校正式通知为准。
- 模型不包含全景图片、校徽、功能图、水印、个人信息或受限参考图层。
- 可发布道路与地面语义主要依据 OpenStreetMap 矢量数据，并保留贡献者署名。
- 为避免遮挡和方向错误，建筑名称只显示在选择器与信息面板，不放置屋顶字牌。

## 模型范围

当前版本包含 42 栋可点选白模、校内与外围道路、运动场、水体和校园地面。
模型采用宣纸水墨风格，主要用于新生熟悉空间关系和后续共同校对。

如果发现建筑缺失、名称错误或位置明显偏差，欢迎通过页面底部的 GitHub 编辑入口提交修正。
