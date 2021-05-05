namespace Openfin.Workspace.Test.Channel
{
    using System.Threading.Tasks;

    using Microsoft.JSInterop;

    public class ChannelProvider : ChannelBase
    {
        public static async Task<ChannelProvider> Create(IJSRuntime js)
        {
            var provider = new ChannelProvider(js);
            await provider.Create();
            return provider;
        }

        private ChannelProvider(IJSRuntime js) : base(js) { }
        public async Task Create()
        {
            Channel = await _js.InvokeAsync<IJSObjectReference>(
                "blazorInterop.Channels.ChannelProvider.create",
                ChannelConstants.DEFAULT_CHANNEL);
        }

        public async Task Publish(string action, string payload)
        {
            await _js.InvokeVoidAsync("blazorInterop.Channels.ChannelProvider.publish",
                Channel,
                action,
                payload);
        }

    }

}
