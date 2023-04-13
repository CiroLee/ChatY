package main

import (
	"embed"

	"github.com/CiroLee/ChatY/app"
	menuConfig "github.com/CiroLee/ChatY/app/menu"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	application := app.NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "chatY",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: application.Startup,
		Bind: []interface{}{
			application,
		},
		Menu: menuConfig.MenuConfig(application.Ctx),
		// windows 窗口亚克力半透明效果
		Windows: &windows.Options{
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			BackdropType:         windows.Acrylic,
		},
		// mac窗口半透明效果
		Mac: &mac.Options{
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
