# Force Window Decorations on CSD Applications

A small KWin script to force Client-side Decorated (CSD) applications 
to have window decorations.

This KWin script was developed in Plasma version 5.27.8, running stock KWin.


## Introduction

This KWin script is a bit hackish, as it forces a window to maximize itself
and immediately restore when they are first opened, so KWin can force 
window decorations on them.
 
Usually there is no visual glitch, but depending on your workload, it can happen.
 
If you rely on many applications using CSD  on a daily basis, this script might 
not be the best solution for your use case.
 
On my personal use case, I rarely use them, and have very few ones installed, 
that I use mostly for debugging purposes on my work (notably GNOME Web, 
due to its WebKit backend, so I can debug things that are not working on Safari).

Also, I am not sure this behavior - to allow windows decorations on CSD windows 
upon maximize/restore - is expected, or if it is an unknown "bug" that might 
be fixed in the future.

I tried my best to follow the Window Decoration Policy available 
from [KDE's tech base](https://techbase.kde.org/Projects/KWin/Window_Decoration_Policy).

But I am not a KWin expert neither in KWin scripting (this is my first KWin script).

As such, I cannot guarantee this script will work on the long run. **Use it at your risk**.


## Installation

- Download the [`force-csd-decorations.kwinscript`](https://raw.githubusercontent.com/rodrigopedra/force-csd-decorations/master/force-csd-decorations.kwinscript) file
- Run from the same directory you downloaded the file

```shell
kpackagetool5 --type=KWin/Script -i force-csd-decorations.kwinscript
```


## Configuration

After installation, this script might be available at your Plasma System Settings' 
KWin Scripts screen.

If it is not yet enabled, mark the checkbox and click the "Apply" button.

There is a single configuration: "Output debug info to journal", when enabled, some debug info will 
be logged into your user's journal.

You can filter the journal entries with this command from 
the [KWin Scripting Tutorial](https://develop.kde.org/docs/plasma/kwin/#output):

```shell
journalctl -f QT_CATEGORY=js QT_CATEGORY=kwin_scripting
```

To enable the debug option, click the configuration button on this script's 
entry on your Plasma System Settings' KWin Scripts screen.

If you enabled this option, and can't see anything logged on the journal, 
try disabling the script, clicking "Apply", then enabling it again, 
and clickling "Apply" on your Plasma System Settings' KWin Scripts screen.


## Caveats

For applications based on GTK+ 3 and 4, you might need to tweak your `gtk.css`
files to remove shadows, borders and a margin it adds around each window 
to allow resizing a window with a mouse cursor.

There are two samples `gtk.css` files: 

- One for [GTK+ 3](https://raw.githubusercontent.com/rodrigopedra/force-csd-decorations/master/gtk-3.css) 
- One for [GTK+ 4](https://raw.githubusercontent.com/rodrigopedra/force-csd-decorations/master/gtk-4.css) 

> **IMPORTANT:** this is a sample file, you will need to modify your own 
> installed `gtk.css` files. 
 
Usually these files are located at:

- `~/.config/gtk-3.0/gtk.css`
- `~/.config/gtk-4.0/gtk.css`

> **DO NOT** copy and paste the samples file provided over your current `gtk.css` files.

Doing this might break any customization applied by a GTK+ Theme you might be using.

Instead, compare your current `gtk.css` files' contents to the provided sample files.

> **Note:** the tweaks on the `gtk.css` might not work well for applications using other 
> GTK+ based toolkits, such as applications built with the elementary OS' toolkit.  


## Flatpak

If you have any flatpak apps based on GTK+ 3 and 4, and you want these styles 
to be applied to them as well, use `flatpak override` to allow flatpak apps 
to access your GTK+ Themes directories.

Assuming the same paths as above, you can run:

```shell
flatpak override --user --filesystem=xdg-config/gtk-4.0:ro
flatpak override --user --filesystem=xdg-config/gtk-3.0:ro
```

And the following ones, in case you have any flatpak app installed system wide:

```shell
flatpak override --system --filesystem=xdg-config/gtk-4.0:ro
flatpak override --system --filesystem=xdg-config/gtk-3.0:ro
```

- The `:ro` at the end of each path, tells flatpak to only allow read-only access 
  to these directories
- Instead of using `~/.config/`, the paths uses `xdg-config` as their prefix
- Flatpak automatically translates the `xdg-config` prefix to 
  the current user's `~/.config` folder
- From what I could understand, during my research, having these themes located there 
  is a freedesktop standard
- If your GTK+ Themes are placed elsewhere, you might need to tweak these settings 


## Header Bars decorations

If you want to remove Header Bar Decorations (close, minimize and maximize buttons), 
so they are not duplicated with their title bar buttons' counterparts, you will need 
to tweak these files:

- `~/.config/gtk-3.0/settings.ini`
- `~/.config/gtk-4.0/settings.ini`

And change the `gtk-decoration-layout=` key, on each file, to allow only 
the buttons you want.

Please refer to GTK+ documentation to learn about the available options for this key:

- https://docs.gtk.org/gtk3/property.Settings.gtk-decoration-layout.html
- https://docs.gtk.org/gtk4/property.Settings.gtk-decoration-layout.html

> **Note:** depending on your distro settings, these might not work as simple as it seems, 
> and you might need to tweak other files to have these buttons removed 
> from GTK+ applications' Header Bars.


## License

This package is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
