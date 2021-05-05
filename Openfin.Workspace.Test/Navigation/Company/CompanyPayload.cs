namespace Openfin.Workspace.Test.Navigation.Company
{
    public class CompanyPayload
    {
        public string Name { get; set; } = "Tesla";
    }
    public class CompanyInteropPayload
    {
        public string Type { get; set; }
        public CompanyPayload Id { get; set; }
    }
}
