var blazorInterop = blazorInterop || {};
blazorInterop.Channels = blazorInterop.Channels || {};
blazorInterop.Channels.ChannelProvider = blazorInterop.Channels.ChannelProvider || {};
blazorInterop.Channels.ChannelClient = blazorInterop.Channels.ChannelClient || {};
blazorInterop.Interop = blazorInterop.Interop || {};


blazorInterop.inOpenfin = () => {
    if (typeof fin !== 'undefined') {
        return true;
    } else {
        return false;
    }
};



/*************************************************
 * Channels
*************************************************/
blazorInterop.Channels.ChannelProvider.create = async (name) => {
    if (blazorInterop.inOpenfin()) {
        const provider = await fin.InterApplicationBus.Channel.create(name)
        provider.onConnection(async (identity, payload) => {
            console.log('Client connection identity:' + JSON.stringify(identity));
            console.log('Client connection payload:' + JSON.stringify(payload));
        });
        return provider;
    }
};

blazorInterop.Channels.ChannelClient.connect = async (action, payload) => {
    if (blazorInterop.inOpenfin()) {
        const client = await fin.InterApplicationBus.Channel.connect(action, { payload, wait: true });
        return client;
    }
};

blazorInterop.Channels.register = async (client, action, callback, callbackMethod) => {
    if (blazorInterop.inOpenfin()) {
        client.register(action, async (payload, identity) => {
            const dotnetHelper = callback;
            const method = callbackMethod;
            let output = await dotnetHelper.invokeMethodAsync(method, payload);
            return output;
        });

    }
};

blazorInterop.Channels.ChannelClient.dispatch = async (client, action, payload) => {
    if (blazorInterop.inOpenfin()) {
        let output = await client.dispatch(action, payload);
        return output;
    }
};

blazorInterop.Channels.ChannelProvider.publish = async (provider, action, payload) => {
    if (blazorInterop.inOpenfin()) {
        await provider.publish(action, payload);
    }
};

/*************************************************
 * Interop
*************************************************/
blazorInterop.Interop.setContext = async (payload) => {
    if (blazorInterop.inOpenfin()) {
        if (typeof payload === "string") {
            payload = JSON.parse(payload);
        }
        console.log("Setting context: " + JSON.stringify(payload));
        fin.me.interop.setContext(payload);
    }
};
blazorInterop.Interop.addContextHandler = async (callback, callbackMethod) => {
    if (blazorInterop.inOpenfin()) {
        console.log("Applying addContextHandler");
        fin.me.interop.addContextHandler((payload) => {
            const dotnetHelper = callback;
            const method = callbackMethod;
            //await dotnetHelper.invokeMethodAsync(method, payload);
        });
    }
};
blazorInterop.Interop.init = async () => {
    if (blazorInterop.inOpenfin()) {
        console.log("Applying init");
        fin.me.interop.addContextHandler((payload) => {
            // Callback handler never called
            let x = payload;
            let y = 0;
            console.log(payload);
        });
    }
};
