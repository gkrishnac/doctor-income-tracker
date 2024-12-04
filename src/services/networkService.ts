// src/services/networkService.ts

type NetworkStatusListener = (online: boolean) => void;

class NetworkService {
  private listeners: NetworkStatusListener[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  private handleNetworkChange = () => {
    this.isOnline = navigator.onLine;
    this.notifyListeners();
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  addListener(listener: NetworkStatusListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: NetworkStatusListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  isNetworkAvailable(): boolean {
    return this.isOnline;
  }
}

export const networkService = new NetworkService();
