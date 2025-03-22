type WebsocketMessage = {
  type: string;
  payload: unknown;
  sender: string;
};

type WebsocketCallback = {
  [key: string]: (sender: string, payload: any) => void;
};

type WebSocketEventCallbacks = {
  onOpen?: () => void;
  onClose?: () => void;
};

class WebsocketService {
  private url: string;
  private ws: WebSocket | null = null;
  private callbacks: WebsocketCallback = {};
  private eventCallbacks: WebSocketEventCallbacks = {};
  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      console.log('WebSocket connection opened');
      this.eventCallbacks.onOpen?.();
    };

    this.ws.onmessage = (event) => {
      const data: WebsocketMessage = JSON.parse(event.data);
      const type = data.type;
      const sender = data.sender;
      console.log('WebSocket message received:', type, sender);
      this.callbacks[type]?.(sender, data.payload);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.eventCallbacks.onClose?.();
    };
  }

  on(type: string, callBack: (sender: string, payload: any) => void) {
    this.callbacks[type] = callBack;
  }

  onOpen(callBack: () => void) {
    this.eventCallbacks.onOpen = callBack;
  }

  onClose(callBack: () => void) {
    this.eventCallbacks.onClose = callBack;
  }

  send(message: WebsocketMessage) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open');
    }
    this.ws?.send(JSON.stringify(message));
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

export default WebsocketService;
