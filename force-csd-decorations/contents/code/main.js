'use strict';

(function (workspace, readConfig) {
    const csd = new CSD();

    workspace.clientAdded.connect(function (client) {
        if (client) {
            csd.add(client);
        }
    });

    workspace.clientActivated.connect(function (client) {
        if (client) {
            csd.activate(client);
        }
    });

    workspace.clientRemoved.connect(function (client) {
        if (client) {
            csd.remove(client);
        }
    });

    workspace.clientMaximizeSet.connect(function (client) {
        if (client && csd.add(client)) {
            client.noBorder = false;
        }
    });

    function CSD() {
        const clients = new ClientSet();
        const pending = new ClientSet();

        this.add = function (client) {
            if (clients.add(client)) {
                logClient(client, 'added');

                pending.add(client);
                client.windowShown.connect(activateClient);
            }

            return clients.has(client);
        };

        this.activate = function (client) {
            if (pending.has(client)) {
                logClient(client, 'activating...');

                client.setMaximize(true, true);
            }
        };

        this.remove = function (client) {
            if (clients.remove(client)) {
                logClient(client, 'removed');

                pending.remove(client);
                client.windowShown.disconnect(activateClient);
            }
        };

        function activateClient(client) {
            if (pending.has(client)) {
                logClient(client, 'activated');

                pending.remove(client);
                client.windowShown.disconnect(activateClient);
                client.setMaximize(false, false);
            }
        }
    }

    function ClientSet() {
        const clients = [];
        const specialResourceClasses = ['plasmashell', 'lattedock', 'firefox'];

        // @see https://api.kde.org/frameworks/kwindowsystem/html/netwm__def_8h_source.html
        const specialWindowTypes = [
            -1, // 'NET::Unknown'
            1, // 'NET::Desktop'
            2, // 'NET::Dock',
            7, // 'NET::TopMenu',
            9, // 'NET::Splash',
            10, // 'NET::DropdownMenu',
            11, // 'NET::PopupMenu',
            12, // 'NET::Tooltip',
            13, // 'NET::Notification',
            14, // 'NET::ComboBox',
            15, // 'NET::DNDIcon',
            16, // 'NET::OnScreenDisplay',
            17, // 'NET::CriticalNotification',
            18, // 'NET::AppletPopup',
        ];

        this.has = function (client) {
            return clients.indexOf(client) !== -1;
        };

        this.add = function (client) {
            if (this.has(client)) {
                return false;
            }

            if (!clientIsDecoratable(client)) {
                return false;
            }

            clients.push(client);

            return true;
        };

        this.remove = function (client) {
            const index = clients.indexOf(client);

            if (index === -1) {
                return false;
            }

            clients.splice(index, 1);

            return true;
        };

        // @see https://techbase.kde.org/Projects/KWin/Window_Decoration_Policy
        function clientIsDecoratable(client) {
            if (specialResourceClasses.indexOf(client.resourceClass) !== -1) {
                return false;
            }

            if (specialWindowTypes.indexOf(client.windowType) !== -1) {
                return false;
            }

            if (!client.managed) {
                return false;
            }

            const shouldNotDecorate = [
                client.fullScreen,
                client.keepAbove && client.shaped,
                client.specialWindow,
                client.desktopWindow,
                client.dock,
                client.splash,
                client.dropdownMenu,
                client.popupMenu,
                client.tooltip,
                client.notification,
                client.comboBox,
                client.dndIcon,
                client.criticalNotification,
                client.appletPopup,
                client.popupWindow,
            ].indexOf(true);

            if (shouldNotDecorate !== -1) {
                return false;
            }

            return client.clientSideDecorated
                && client.noBorder;
        }
    }

    function logClient(client, context) {
        if (!readConfig('isDebugging', false)) {
            return;
        }

        console.debug(JSON.stringify({
            isActive: workspace.activeClient === client,
            resourceClass: client.resourceClass,
            windowType: client.windowType,
            clientSideDecorated: client.clientSideDecorated,
            noBorder: client.noBorder,
            maximizable: client.maximizable,
            context: context,
        }));
    }
}(workspace, readConfig));
