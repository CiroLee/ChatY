package app

import (
	"context"
	"io/fs"
	"os"

	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	Ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.Ctx = ctx
}

func (a *App) SaveFile(data string) (bool, error) {
	filename, err := wailsRuntime.SaveFileDialog(a.Ctx, wailsRuntime.SaveDialogOptions{
		Filters: []wailsRuntime.FileFilter{
			{
				DisplayName: "Markdown Files (*.md)|*.md",
				Pattern:     "*.md",
			},
		},
		DefaultFilename:      "undefined.md",
		CanCreateDirectories: true,
	})
	if err != nil {
		return false, err
	}

	err = os.WriteFile(filename, []byte(data), fs.ModePerm)

	if err != nil {
		return false, err
	}

	return true, nil
}
