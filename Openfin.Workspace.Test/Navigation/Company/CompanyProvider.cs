namespace Openfin.Workspace.Test.Navigation.Company
{
    using System.Text.Json;
    using System.Threading.Tasks;

    using Microsoft.JSInterop;

    using Openfin.Workspace.Test.Channel;

    public class CompanyProvider : NavigationProvider<CompanyProvider>
    {
        protected CompanyPayload Payload { get; set; } = new CompanyPayload();

        public static async Task<CompanyProvider> Create(ChannelProvider provider)
        {
            var companyNavigationSource = new CompanyProvider(provider);
            await companyNavigationSource.Initialize();
            return companyNavigationSource;
        }
        protected CompanyProvider(ChannelProvider provider) : base(provider)
        {
            CallbackObject = DotNetObjectReference.Create(this);
        }
        protected async Task Initialize()
        {
            await Register(CompanyActions.GET, nameof(Get));
            await Register(CompanyActions.CHANGE, nameof(Update));
        }

        [JSInvokable]
        public override string Get()
        {
            return JsonSerializer.Serialize(Payload);
        }
        [JSInvokable]
        public override async Task<string> Update(string payload)
        {
            Payload = JsonSerializer.Deserialize<CompanyPayload>(payload);
            var newPayload = JsonSerializer.Serialize(Payload);
            await Channel.Publish(CompanyActions.UPDATED, newPayload);
            return newPayload;            
        }
    }

}
