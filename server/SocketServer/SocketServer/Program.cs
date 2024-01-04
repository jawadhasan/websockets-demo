using SocketServer;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddSingleton<HelloServer>();
        services.AddHostedService<Worker>();
    })
    .Build();

await host.RunAsync();
