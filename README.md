<div align="center">
  <img src="./images/chaty-logo.svg" style="width: 240px" alt="banner" />
  <h1>ChatY</h1>
</div>

English | [中文](README-ZH.md)

ChatY is an open source GPT desktop client developed based on [wails](https://github.com/wailsapp/wails). It is probably the most beautiful ChatGPT assistant in your computer.

![macos](https://img.shields.io/badge/-macOS-black?style=flat-square&logo=apple&logoColor=white)
![windows](https://img.shields.io/badge/-Windows-blue?style=flat-square&logo=windows&logoColor=white)

## Preview

![chaty-light](images/chaty-1-light.png)  
<br/>
![chaty-dark](images/chaty-1-dark.png)

## Features

- Support for multiple platforms.
- Support i18n(default is Chinese).
- Data is completely localized, no user data is recorded.
- UI is completely independent and does not rely on third-party UI libraries.
- Interaction is simple and easy to use, supporting shortcut key operation.
- More controllable history session mode, which can ensure the accuracy of the results and save your token at the same time.
- Based on the MIT protocol , open-source and free.

## Download

[download here](https://github.com/CiroLee/ChatY/releases)

## Development

development environment requires:

- [node >= 14](https://nodejs.org/en/download/)
- [go >= 1.18](https://go.dev/)
- [wails](https://wails.io/)
- [pnpm(recommend)](https://pnpm.io/)

clone the repo

```bash
git clone https://github.com/CiroLee/ChatY.git
```

run the project in development mode

```bash
# cd the project
wails dev
```

build

```bash
# build base on your os
wails build

# build for multiple platforms
make build version=your own version
```

## LICENSE

[MIT License](https://github.com/CiroLee/ChatY/blob/main/LICENSE)
