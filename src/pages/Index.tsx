import { useState } from 'react';
import { ConnectionForm } from '@/components/ConnectionForm';
import { ConnectedDashboard } from '@/components/ConnectedDashboard';
import { useGitHub } from '@/hooks/useGitHub';
import { Github } from 'lucide-react';

const Index = () => {
  const { isConnected, loading, config, connect, disconnect } = useGitHub();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <Github className="h-8 w-8 text-primary" />
            <div className="text-center">
              <h1 className="text-3xl font-bold">GitHub Connector Pro</h1>
              <p className="text-muted-foreground">
                Connect, explore, and manage your GitHub repositories
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <ConnectionForm onConnect={connect} loading={loading} />
          </div>
        ) : config ? (
          <ConnectedDashboard config={config} onDisconnect={disconnect} />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>GitHub Connector Pro - Streamline your GitHub workflow</p>
            <p className="mt-2">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
