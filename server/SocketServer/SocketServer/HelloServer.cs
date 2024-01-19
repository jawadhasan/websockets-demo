using Fleck;
using Newtonsoft.Json;

namespace SocketServer
{
    public class HelloServer
    {
        private readonly ILogger<HelloServer> _logger;
        private readonly List<IWebSocketConnection> _sockets = new();
        private readonly WebSocketServer _server = new("ws://0.0.0.0:8181");
        public HelloServer(ILogger<HelloServer> logger)
        {
            _logger = logger;
        }
        public void Start()
        {
            _server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    _logger.LogInformation("Connection open.");
                    _sockets.Add(socket);
                };
                socket.OnClose = () =>
                {
                    _logger.LogWarning("Connection closed");
                    _sockets.Remove(socket);
                };
                socket.OnMessage = message =>
                {
                    _logger.LogInformation("Client Says: " + message);
                    _sockets.ToList().ForEach(s => s.Send(message));
                };
            });
        }

        //Example, if want to send .NET objects
        public void SendMessage(string message)
        {
            _sockets.ToList().ForEach(s => s.Send(message));
            //_sockets.ToList().ForEach(s => s.Send(JsonConvert.SerializeObject(message)));
        }
    }
}
