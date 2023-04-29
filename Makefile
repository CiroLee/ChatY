.PHONY: build

WAILS=$$(go env GOPATH)/bin/wails
pwd=$(shell pwd)

build:
	${WAILS} build -u -clean -platform=darwin/amd64,darwin/arm64,windows/amd64,windows/arm64
	mv $(pwd)/build/bin/ChatY-arm64.app $(pwd)/build/bin/ChatY_$(version)_appleSilicon.app
	mv $(pwd)/build/bin/ChatY-amd64.app $(pwd)/build/bin/ChatY_$(version)_intel.app
  mv $(pwd)/build/bin/ChatY-amd64.exe $(pwd)/build/bin/ChatY_$(version)_x64.exe	
	mv $(pwd)/build/bin/ChatY-arm64.exe $(pwd)/build/bin/ChatY_$(version)_arm64.exe	
	
	