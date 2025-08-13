import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Github, Key, User } from 'lucide-react';
import { ConnectionConfig } from '@/types/github';

interface ConnectionFormProps {
  onConnect: (config: ConnectionConfig) => Promise<void>;
  loading: boolean;
}

export const ConnectionForm = ({ onConnect, loading }: ConnectionFormProps) => {
  const [token, setToken] = useState('');
  const [repository, setRepository] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('GitHub token is required');
      return;
    }

    if (!repository.trim()) {
      setError('Repository name is required');
      return;
    }

    try {
      await onConnect({
        token: token.trim(),
        username: '', // Will be filled by the API response
        repository: repository.trim(),
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Github className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Connect to GitHub</CardTitle>
        <CardDescription>
          Enter your GitHub personal access token and repository details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">
              <Key className="inline h-4 w-4 mr-2" />
              Personal Access Token
            </Label>
            <Input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repository">
              <User className="inline h-4 w-4 mr-2" />
              Repository (owner/repo)
            </Label>
            <Input
              id="repository"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              placeholder="username/repository-name"
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect to GitHub'}
          </Button>
        </form>

        <div className="mt-6 text-xs text-muted-foreground">
          <p className="mb-2">To create a personal access token:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to GitHub Settings → Developer settings</li>
            <li>Click "Personal access tokens" → "Tokens (classic)"</li>
            <li>Generate new token with 'repo' scope</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};