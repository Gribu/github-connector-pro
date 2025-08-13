import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  GitBranch, 
  Star, 
  GitFork, 
  Calendar, 
  ExternalLink, 
  Code,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { GitHubRepository, GitHubBranch, GitHubCommit } from '@/types/github';
import { useGitHub } from '@/hooks/useGitHub';
import { format } from 'date-fns';

interface RepositoryInfoProps {
  owner: string;
  repo: string;
}

export const RepositoryInfo = ({ owner, repo }: RepositoryInfoProps) => {
  const { getRepository, getBranches, getCommits } = useGitHub();
  const [repository, setRepository] = useState<GitHubRepository | null>(null);
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [repoData, branchData, commitData] = await Promise.all([
        getRepository(owner, repo),
        getBranches(owner, repo),
        getCommits(owner, repo),
      ]);
      
      setRepository(repoData);
      setBranches(branchData);
      setCommits(commitData.slice(0, 5)); // Show last 5 commits
    } catch (error) {
      console.error('Failed to fetch repository data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch repository data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [owner, repo]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading repository information...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!repository) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Repository not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Repository Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={repository.owner.avatar_url} alt={repository.owner.login} />
                <AvatarFallback>{repository.owner.login[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{repository.name}</CardTitle>
                <CardDescription>
                  by {repository.owner.login}
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {repository.description && (
            <p className="text-muted-foreground mb-4">{repository.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              {repository.stargazers_count} stars
            </div>
            <div className="flex items-center">
              <GitFork className="h-4 w-4 mr-1" />
              {repository.forks_count} forks
            </div>
            {repository.language && (
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-1" />
                {repository.language}
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created {format(new Date(repository.created_at), 'MMM d, yyyy')}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Clone URLs</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(repository.clone_url)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    HTTPS
                  </Button>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {repository.clone_url}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(repository.ssh_url)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    SSH
                  </Button>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {repository.ssh_url}
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Repository Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Visibility:</span>
                  <Badge variant={repository.private ? "secondary" : "default"}>
                    {repository.private ? "Private" : "Public"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Default branch:</span>
                  <Badge variant="outline">{repository.default_branch}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last push:</span>
                  <span className="text-sm">{format(new Date(repository.pushed_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitBranch className="h-5 w-5 mr-2" />
            Branches ({branches.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {branches.slice(0, 5).map((branch) => (
              <div key={branch.name} className="flex items-center justify-between p-2 rounded border">
                <div className="flex items-center space-x-2">
                  <Badge variant={branch.name === repository.default_branch ? "default" : "outline"}>
                    {branch.name}
                  </Badge>
                  {branch.protected && (
                    <Badge variant="secondary" className="text-xs">Protected</Badge>
                  )}
                </div>
                <code className="text-xs text-muted-foreground">
                  {branch.commit.sha.substring(0, 7)}
                </code>
              </div>
            ))}
            {branches.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                And {branches.length - 5} more branches...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Commits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commits.map((commit) => (
              <div key={commit.sha} className="flex items-start space-x-3 p-3 rounded border">
                {commit.author && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={commit.author.avatar_url} alt={commit.author.login} />
                    <AvatarFallback>{commit.author.login[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {commit.commit.message.split('\n')[0]}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{commit.commit.author.name}</span>
                    <span>•</span>
                    <span>{format(new Date(commit.commit.author.date), 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <code>{commit.sha.substring(0, 7)}</code>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};