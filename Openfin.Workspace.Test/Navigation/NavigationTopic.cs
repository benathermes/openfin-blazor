namespace Openfin.Workspace.Test.Navigation
{
    using System.Threading.Tasks;

    using Openfin.Workspace.Test.Channel;

    public interface INavigationTopic<TPayload>
    {
        Task<TPayload> Get();
        Task Update(TPayload payload);
    }
    public abstract class NavigationTopic<TCallback, TPayload> : NavigationBase<ChannelClient, TCallback>, INavigationTopic<TPayload> where TCallback : class
    {
        public NavigationTopic(ChannelClient client) : base(client) { }

        protected async Task<string> Dispatch(string action, string callbackMethodName)
        {
            var payload = await Channel.Dispatch(action);
            return payload;
        }

        public abstract Task<TPayload> Get();
        public abstract Task Update(TPayload payload);
    }

}
