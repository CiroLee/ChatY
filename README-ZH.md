<div align="center">
  <img src="./images/chaty-logo.svg" style="width: 240px" alt="banner" />
  <h1>ChatY</h1>
</div>

[English](README.md) | 中文

ChatY 是基于 [wails](https://github.com/wailsapp/wails)开发的开源 GPT 桌面客户端。它也许是你电脑中最漂亮的 ChatGPT 助手。

![macos](https://img.shields.io/badge/-macOS-black?style=flat-square&logo=apple&logoColor=white)
![windows](https://img.shields.io/badge/-Windows-blue?style=flat-square&logo=windows&logoColor=white)

预览

![chaty-light](images/chaty-1-light.png)  
<br/>
![chaty-dark](images/chaty-1-dark.png)  
<br/>
![chaty-math](images/chaty-dark-math-multiple.png)

## 功能

- 支持多平台
- 支持国际化 i18n(默认为中文)
- 支持对话多选操作
- 更加自由的 prompts 管理
- 数据完全本地化(使用 `indexDB`)，不会记录用户数据
- UI 完全独立，不依赖第三方 UI 库
- 交互简洁易用，支持快捷键操作
- 更加可控的历史会话模式，既能保证结果的精度，又可以节省你的 token
- 基于 MIT 协议，开源免费

## 下载

[下载地址](https://github.com/CiroLee/ChatY/releases)

## 开发

开发环境:

- [node >= 14](https://nodejs.org/en/download/)
- [go >= 1.18](https://go.dev/)
- [wails](https://wails.io/)
- [pnpm(推荐)](https://pnpm.io/)

克隆仓库到本地

```bash
git clone https://github.com/CiroLee/ChatY.git
```

启动应用

```bash
# cd the project
wails dev
```

打包

```bash
# 根据你的系统环境构建
wails build

# 多平台构建
make build version=your own version
```

## LICENSE

[MIT License](https://github.com/CiroLee/ChatY/blob/main/LICENSE)
