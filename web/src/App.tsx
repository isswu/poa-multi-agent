import { useState, useEffect } from 'react';
import { SparklesIcon, ServerIcon } from 'lucide-react';
import { App as AntApp } from 'antd';
import { ChatInterface } from './components/ChatInterface/index';
import { apiService } from './services/api';
import './index.css';

function AppContent() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiService.healthCheck();
        setApiStatus('online');
      } catch (error) {
        setApiStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="glass-card m-6 animate-slide-up">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  POA Multi-Agent
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  与智能体实时对话  •  分析公共舆情
                </p>
              </div>
            </div>

            {/* Right: API Status Badge */}
            <div className={
              apiStatus === 'online' ? 'badge-online' : 
              apiStatus === 'offline' ? 'badge-offline' : 
              'badge-checking'
            }>
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'online' ? 'bg-emerald-500' :
                apiStatus === 'offline' ? 'bg-red-500' :
                'bg-blue-500'
              } animate-pulse`} />
              <span className="font-medium">
                {apiStatus === 'checking' && '检查中'}
                {apiStatus === 'online' && 'API 在线'}
                {apiStatus === 'offline' && 'API 离线'}
              </span>
              <ServerIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* API Warning Banner */}
      {apiStatus === 'offline' && (
        <div className="mx-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card border-red-200 bg-red-50/70">
            <div className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1">
                    无法连接到 API 服务器
                  </h3>
                  <p className="text-sm text-red-600">
                    请确保后端服务正在运行：
                    <code className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 font-mono text-xs">
                      make run-api
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <main className="flex-1 flex mx-6 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AntApp>
      <AppContent />
    </AntApp>
  );
}

export default App;
