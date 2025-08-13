import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, LogOut, Settings, ExternalLink } from 'lucide-react';
import { ConnectionConfig } from '@/types/github';
import { RepositoryInfo } from './RepositoryInfo';

interface ConnectedDashboardProps {
  config: ConnectionConfig;
  onDisconnect: () => void;
}

export const ConnectedDashboard = ({ config, onDisconnect }: ConnectedDashboardProps) => {
  const [owner, repo] = config.repository.includes('/') 
    ? config.repository.split('/')
    : [config.username, config.repository];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <Github className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Connected to GitHub</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Active
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Connected as {config.username} • Repository: {config.repository}
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={`https://github.com/${config.repository}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="destructive" size="sm" onClick={onDisconnect}>
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Repository Information */}
      <RepositoryInfo owner={owner} repo={repo} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common GitHub operations for your repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a 
                href={`https://github.com/${config.repository}/issues/new`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="text-center">
                  <div className="text-lg font-semibold">Create Issue</div>
                  <div className="text-sm text-muted-foreground">Report a bug or request a feature</div>
                </div>
              </a>
            </Button>
            
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a 
                href={`https://github.com/${config.repository}/compare`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="text-center">
                  <div className="text-lg font-semibold">Create Pull Request</div>
                  <div className="text-sm text-muted-foreground">Propose changes to the repository</div>
                </div>
              </a>
            </Button>
            
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a 
                href={`https://github.com/${config.repository}/releases/new`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="text-center">
                  <div className="text-lg font-semibold">Create Release</div>
                  <div className="text-sm text-muted-foreground">Package and publish a new version</div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clone Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup</CardTitle>
          <CardDescription>
            Commands to get started with this repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Clone the repository:</h4>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-sm">
                  git clone https://github.com/{config.repository}.git
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Navigate to project:</h4>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-sm">
                  cd {repo}
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Install dependencies:</h4>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-sm">
                  npm install
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Start development:</h4>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-sm">
                  npm run dev
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};