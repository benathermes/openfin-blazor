namespace Openfin.Workspace.Test.Navigation
{
    using System.Threading.Tasks;

    using Microsoft.JSInterop;

    using Openfin.Workspace.Test.Channel;

    public abstract class NavigationBase<TChannel, TCallback> where TCallback : class where TChannel : ChannelBase
    {
        protected TChannel Channel { get; }
        protected DotNetObjectReference<TCallback> CallbackObject { get; set; }

        public NavigationBase(TChannel channel)
        {
            Channel = channel;
        }

        protected async Task Register(string action, string callbackMethodName)
        {
            await Channel.Register<TCallback>(
                action,
                CallbackObject,
                callbackMethodName);
        }
    }

}
