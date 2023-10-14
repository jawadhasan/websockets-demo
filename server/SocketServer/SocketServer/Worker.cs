namespace SocketServer
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly HelloServer _helloServer;

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
            _helloServer = new HelloServer();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            _helloServer.Start();

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Sending Message to Client at: {time}", DateTimeOffset.Now);

                _helloServer.SendMessage($"server-message {DateTimeOffset.Now}"); //send message to clients

                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}