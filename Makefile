.PHONY: build

WAILS=$$(go env GOPATH)/bin/wails

build:
	${WAILS} build -u -clean -platform=darwin/amd64,darwin/arm64,windows/amd64,windows/arm64
	