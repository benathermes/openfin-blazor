namespace Openfin.Workspace.Test.Navigation.Company
{
    using System;
    using System.Text.Json;
    using System.Threading.Tasks;

    using Microsoft.JSInterop;

    using Openfin.Workspace.Test.Channel;

    public class CompanyTopic : NavigationTopic<CompanyTopic, CompanyPayload>
    {
        public event EventHandler<CompanyPayload> Updated;
        public static async Task<CompanyTopic> Create(ChannelClient client)
        {
            var companyNavigationTarget = new CompanyTopic(client);
            await companyNavigationTarget.Initialize();
            return companyNavigationTarget;
        }
        protected CompanyTopic(ChannelClient client) : base(client)
        {
            CallbackObject = DotNetObjectReference.Create(this);
        }

        protected async Task Initialize()
        {
            await Register(CompanyActions.UPDATED, nameof(UpdateCallback));
        }
        [JSInvokable]
        public Task UpdateCallback(string payload)
        {
            var result = JsonSerializer.Deserialize<CompanyPayload>(payload);
            Updated(this, result);
            return Task.CompletedTask;
        }

        public override async Task<CompanyPayload> Get()
        {
            var payload = await Channel.Dispatch(CompanyActions.GET);
            return JsonSerializer.Deserialize<CompanyPayload>(payload);
        }
        public override async Task Update(CompanyPayload payload)
        {
            await Channel.Dispatch(CompanyActions.CHANGE, JsonSerializer.Serialize(payload));
        }

    }
}
