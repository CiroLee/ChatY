package menu

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	wailsRunTime "github.com/wailsapp/wails/v2/pkg/runtime"
)

func MenuConfig(ctx context.Context) *menu.Menu {
	AppMenu := menu.NewMenu()
	FileMenu := AppMenu.AddSubmenu("File")
	FileMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		wailsRunTime.Quit(ctx)
	})

	return AppMenu
}
