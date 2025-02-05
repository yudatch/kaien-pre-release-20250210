class MemoryMonitor {
  private interval: NodeJS.Timeout | null = null;
  private readonly MONITORING_INTERVAL = 60000; // 1分

  start() {
    if (typeof window === 'undefined') {
      // サーバーサイドの場合
      this.monitorServerMemory();
    } else {
      // クライアントサイドの場合
      this.monitorClientMemory();
    }
  }

  private monitorServerMemory() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      try {
        const memoryUsage = process.memoryUsage();
        console.log('サーバーメモリ使用状況:', {
          heapUsed: this.formatBytes(memoryUsage.heapUsed),
          heapTotal: this.formatBytes(memoryUsage.heapTotal),
          rss: this.formatBytes(memoryUsage.rss)
        });
      } catch (error) {
        console.error('メモリ監視エラー:', error);
      }
    }, this.MONITORING_INTERVAL);
  }

  private monitorClientMemory() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      try {
        if (window.performance && window.performance.memory) {
          const memory = (window.performance as any).memory;
          console.log('クライアントメモリ使用状況:', {
            usedJSHeapSize: this.formatBytes(memory.usedJSHeapSize),
            totalJSHeapSize: this.formatBytes(memory.totalJSHeapSize),
            jsHeapSizeLimit: this.formatBytes(memory.jsHeapSizeLimit)
          });
        }
      } catch (error) {
        console.error('メモリ監視エラー:', error);
      }
    }, this.MONITORING_INTERVAL);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

export const memoryMonitor = new MemoryMonitor(); 