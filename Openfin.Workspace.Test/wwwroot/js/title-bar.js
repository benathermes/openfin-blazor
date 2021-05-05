import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

//Our Title bar element
class TitleBar extends HTMLElement {
    constructor() {
        super();
        this.LIGHT_THEME = 'light-theme';
        this.DARK_THEME = 'dark';


        this.render();

        fin.Platform.getCurrentSync().getWindowContext().then(initialContext => {
            if (initialContext && initialContext.theme) {
                this.setTheme(initialContext.theme);
            } else {
                this.setTheme(this.DARK_THEME);
            }
        });

        fin.Platform.getCurrentSync().on('window-context-changed', async (evt) => {
            const context = await fin.Platform.getCurrentSync().getWindowContext();
            //we only want to react to events that include themes
            if (evt.context.theme && evt.context.theme !== context.theme) {
                this.setTheme(evt.context.theme);
            }
        });

        fin.me.on('layout-ready', async () => {
            // Whenever a new layout is ready on this window (on init, replace, or applyPreset)
            const { settings } = await fin.Platform.Layout.getCurrentSync().getConfig();
            // determine whether it is locked and update the icon
            if(settings.hasHeaders && settings.reorderEnabled) {
                document.getElementById('lock-button').classList.remove('layout-locked');
            } else {
                document.getElementById('lock-button').classList.add('layout-locked');
            }


            let options = await fin.Window.getCurrentSync().getOptions();
            if (options.name === 'window.tray') {
                document.getElementById('search-button').style.display = 'none';
                document.getElementById('theme-button').style.display = 'none';
                document.getElementById('lock-button').style.display = 'none';
                document.getElementById('minimize-button').style.display = 'none';
                document.getElementById('expand-button').style.display = 'none';
                document.getElementById('close-button').style.display = 'none';
            }

        });
    }

    render = async () => {
        //let view = await fin.View.getCurrent();
        //let viewOptions = await view.getOptions();

        const titleBar = html`
                <div class="title-bar-draggable">
                    <div id="title" style="padding-left: 5px"></div>
                </div>
                <div id="buttons-wrapper">
                    <div class="button" title="Search" id="search-button" @click=${this.search}></div>                    
                    <div class="button" title="Toggle Theme" id="theme-button" @click=${this.toggleTheme}></div>
                    <div class="button" title="Toggle Layout Lock" id="lock-button" @click=${this.toggleLockedLayout}></div>
                    <div class="button" title="Minimize Window" id="minimize-button" @click=${() => fin.me.minimize().catch(console.error)}></div>
                    <div class="button" title="Maximize Window" id="expand-button" @click=${() => this.maxOrRestore().catch(console.error)}></div>
                    <div class="button" title="Close Window" id="close-button" @click=${() => fin.me.close().catch(console.error)}></div>
                </div>`;

        return render(titleBar, this);
    }
    search = async () => {
        fin.views = fin.views || {};

        let platform = await fin.Platform.getCurrent();
        //let view = await fin.View.getCurrent();
        let window = await fin.Window.getCurrent();
        let windowOptions = await window.getOptions();
        let oldLayout = await window.getLayout();
        let oldLayoutConfig = await oldLayout.getConfig();

        if (fin.views[window.identity.name + '.views'] != undefined) {
            for (let v of fin.views[window.identity.name + '.views']) {
                v.attach(window.identity);
            }
            oldLayout.replace({
                ...fin.views[window.identity.name + '.layout']
            });

            fin.views[window.identity.name + '.views'] = null;
            fin.views[window.identity.name + '.layout'] = null;
            return;

        }

        //let windowName = await blazorInterop.getWindowName();
        let windowIdentity = window.identity;
        //let viewOptions = await view.getOptions();

        const { settings, dimensions } = oldLayoutConfig;
        if (settings.hasHeaders && settings.reorderEnabled) {
            oldLayout.replace({
                ...oldLayoutConfig,
                settings: {
                    ...settings,
                    hasHeaders: false,
                    reorderEnabled: false
                }
            });
        } else {
            oldLayout.replace({
                ...oldLayoutConfig,
                settings: {
                    ...settings,
                    hasHeaders: true,
                    reorderEnabled: true
                },
                dimensions: {
                    ...dimensions,
                    headerHeight: 25
                }
            });
        }


        let views = await window.getCurrentViews();
        fin.views[window.identity.name + '.views'] = views;
        fin.views[window.identity.name + '.layout'] = oldLayoutConfig;

        windowOptions.customData                                    = windowOptions.customData || {};
        windowOptions.customData.openfinViews                       = windowOptions.customData.openfinViews || {};
        windowOptions.customData.openfinViews[window.identity.name] = views;

        for (let v of views) {
            let vOptions = await v.getOptions();
            vOptions.detachOnClose = true;
        }

        for (let v of views) {
            if (v.identity.name !== 'view.search') {
                platform.closeView(v.identity);
            }
        }

        let abc = 123;
        //window.localStorage.setItem('layouts', serializedLayouts);
    };


    maxOrRestore = async () => {
        if (await fin.me.getState() === 'normal') {
            return await fin.me.maximize();
        }

        return fin.me.restore();
    };

    toggleLockedLayout = async () => {
        const oldLayout = await fin.Platform.Layout.getCurrentSync().getConfig();
        const { settings, dimensions } = oldLayout;
        if(settings.hasHeaders && settings.reorderEnabled) {
            fin.Platform.Layout.getCurrentSync().replace({
                ...oldLayout,
                settings: {
                    ...settings,
                    hasHeaders: false,
                    reorderEnabled: false
                }
            });
        } else {
            fin.Platform.Layout.getCurrentSync().replace({
                ...oldLayout,
                settings: {
                    ...settings,
                    hasHeaders: true,
                    reorderEnabled: true
                },
                dimensions: {
                    ...dimensions,
                    headerHeight: 25
                }
            });
        }
    };

    toggleTheme = async () => {
        let themeName = this.DARK_THEME;
        if (!document.documentElement.classList.contains(this.LIGHT_THEME)) {
            themeName = this.LIGHT_THEME;
        }
        this.setTheme(themeName);
        await fin.InterApplicationBus.publish('theme-change', themeName);

    }

    setTheme = async (theme) => {
        const root = document.documentElement;

        if (theme === this.LIGHT_THEME) {
            root.classList.add(this.LIGHT_THEME);

        } else {
            root.classList.remove(this.LIGHT_THEME);
        }

        const context = await fin.Platform.getCurrentSync().getWindowContext() || {};
        if (context.theme !== theme) {
            let newContext = {...context, theme};
            fin.Platform.getCurrentSync().setWindowContext(newContext);
        }
    }

    toggleMenu = () => {
        document.querySelector('left-menu').classList.toggle('hidden');
    }
}

customElements.define('title-bar', TitleBar);
