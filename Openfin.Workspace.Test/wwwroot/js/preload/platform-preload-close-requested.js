if (window !== window.top) {
    return;
}
window.addEventListener("DOMContentLoaded", async () => {
    debugger;
    console.log("Loading platform cache management preload");
    const platform = fin.Platform.getCurrentSync();
    let app = await fin.Application.getCurrent();
    const finWindow = fin.Window.getCurrentSync();


    async function windowClosed(e) {
        debugger;
        const platform = fin.Platform.getCurrentSync();
        const childWindows = await platform.Application.getChildWindows();

        async function isShowing(win) {
            return await win.isShowing();
        }
        const asyncFilter = async (arr, predicate) => {
            const results = await Promise.all(arr.map(predicate));
            return arr.filter((_v, index) => results[index]);
        }

        const visibleWindows = await asyncFilter(childWindows, isShowing);
        if (visibleWindows.length === 0) {
            localStorage.removeItem("last-saved-snapshot");
            return await fin.me.close(true); // Only tell provider to quit if no visible remaining
        }

    }
    async function closeRequested(e) {
        debugger;
        const platform = fin.Platform.getCurrentSync();
        const childWindows = await platform.Application.getChildWindows();

        async function isShowing(win) {
            return await win.isShowing();
        }
        const asyncFilter = async (arr, predicate) => {
            const results = await Promise.all(arr.map(predicate));
            return arr.filter((_v, index) => results[index]);
        }

        const visibleWindows = await asyncFilter(childWindows, isShowing);
        if (visibleWindows.length >= 1) {
            const snapshot = await platform.getSnapshot();
            localStorage.setItem("last-saved-snapshot", JSON.stringify(snapshot));
        } else {
            localStorage.removeItem("last-saved-snapshot");
        }

        return await fin.me.close(true);
    }

    app.addListener('window-closed', windowClosed); // If last visible window is closed from chrome x button
    finWindow.once("close-requested", closeRequested); // If application.quit called from app
});
