namespace SocketServer
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly HelloServer _helloServer;

        public Worker(ILogger<Worker> logger, HelloServer helloServer)
        {
            _logger = logger;
            _helloServer = helloServer;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            _helloServer.Start();

            #region more testing code
            //The following code simulate server messages; for testing purposes

            //while (!stoppingToken.IsCancellationRequested)
            //{
            //    _logger.LogInformation("Sending Message to Client at: {time}", DateTimeOffset.Now);

            //    _helloServer.SendMessage($"server-message {DateTimeOffset.Now}"); //send message to clients

            //    await Task.Delay(5000, stoppingToken);
            //}
            #endregion
        }
    }
}