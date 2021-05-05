namespace Openfin.Workspace.Test.Navigation
{
    using System.Threading.Tasks;

    using Openfin.Workspace.Test.Channel;

    public interface INavigationProvider
    {
        string Get();
        Task<string> Update(string payload);
    }
    public abstract class NavigationProvider<TCallback> : NavigationBase<ChannelProvider, TCallback>, INavigationProvider where TCallback : class
    {
        public NavigationProvider(ChannelProvider provider) : base(provider) { }

        public abstract string Get();
        public abstract Task<string> Update(string payload);
    }

}
