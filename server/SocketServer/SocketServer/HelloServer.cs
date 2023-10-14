using Fleck;
using Newtonsoft.Json;

namespace SocketServer
{
    public class HelloServer
    {
        private readonly List<IWebSocketConnection> _sockets = new();
        private readonly WebSocketServer _server = new("ws://0.0.0.0:8181");

        public void Start()
        {

            _server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    Console.WriteLine("Connection open.");
                    _sockets.Add(socket);
                };
                socket.OnClose = () =>
                {
                    Console.WriteLine("Connection closed");
                    _sockets.Remove(socket);
                };
                socket.OnMessage = message =>
                {
                    Console.WriteLine("Client Says: " + message);
                    _sockets.ToList().ForEach(s => s.Send(" client says: " + message));
                };
            });
        }

        public void SendMessage(string message)
        {
            _sockets.ToList().ForEach(s => s.Send(message));
            //_sockets.ToList().ForEach(s => s.Send(JsonConvert.SerializeObject(message)));
        }
    }
}
