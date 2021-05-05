namespace Openfin.Workspace.Test.Channel
{
    using System.Threading.Tasks;

    using Microsoft.JSInterop;

    public class ChannelClient : ChannelBase
    {
        public static async Task<ChannelClient> Create(IJSRuntime js)
        {
            var client = new ChannelClient(js);
            await client.Connect();
            return client;
        }
        private ChannelClient(IJSRuntime js) : base(js) { }
        public async Task Connect()
        {
            Channel = await _js.InvokeAsync<IJSObjectReference>(
            "blazorInterop.Channels.ChannelClient.connect",
            ChannelConstants.DEFAULT_CHANNEL);
        }

        public async Task<string> Dispatch(string action, string payload = null)
        {
            return await _js.InvokeAsync<string>("blazorInterop.Channels.ChannelClient.dispatch",
                Channel,
                action,
                payload);
        }
    }

}
