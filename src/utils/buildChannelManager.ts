
const BUILD_CHANNEL_NAME = 'build-status-channel';

type BuildEvent = {
  type: 'build-started' | 'build-progress' | 'build-completed' | 'build-stopped';
  data?: any;
};

class BuildChannelManager {
  private channel: BroadcastChannel;
  private static instance: BuildChannelManager;

  private constructor() {
    this.channel = new BroadcastChannel(BUILD_CHANNEL_NAME);
  }

  static getInstance(): BuildChannelManager {
    if (!BuildChannelManager.instance) {
      BuildChannelManager.instance = new BuildChannelManager();
    }
    return BuildChannelManager.instance;
  }

  subscribe(callback: (event: MessageEvent<BuildEvent>) => void) {
    this.channel.addEventListener('message', callback);
    return () => this.channel.removeEventListener('message', callback);
  }

  broadcast(event: BuildEvent) {
    this.channel.postMessage(event);
  }

  close() {
    this.channel.close();
  }
}

export const buildChannelManager = BuildChannelManager.getInstance();
