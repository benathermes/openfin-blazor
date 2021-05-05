namespace Openfin.Workspace.Test.Channel
{
    using System.Threading.Tasks;

    using Microsoft.JSInterop;

    public abstract class ChannelBase
    {
        protected IJSObjectReference Channel { get; set; }
        protected readonly IJSRuntime _js;

        public ChannelBase(IJSRuntime js)
        {
            _js = js;
        }
        public async Task Register<T>(
            string action,
            DotNetObjectReference<T> callbackObject,
            string callbackMethodName) where T : class
        {
            await _js.InvokeVoidAsync(
                "blazorInterop.Channels.register",
                Channel,
                action,
                callbackObject,
                callbackMethodName);
        }
    }

}
