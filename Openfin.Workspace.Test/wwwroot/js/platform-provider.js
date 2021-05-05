fin.Platform.init({
    overrideCallback: async (Provider) => {
        class Override extends Provider {

            /*************************************
             * Override applySnapshot to resume last window layout
             ************************************/
            
            getLastSnapshot() {
                const snapshot = localStorage.getItem("last-saved-snapshot");
                return JSON.parse(snapshot);
            }

            async applySnapshot({ snapshot, options }, callerIdentity) {
                const lastSnapshot = this.getLastSnapshot();
                if (lastSnapshot) {
                    return super.applySnapshot({ snapshot: lastSnapshot, options }, callerIdentity);
                } else {
                    return super.applySnapshot({ snapshot, options }, callerIdentity);
                }
            }

        };

        return new Override();
    }
});
