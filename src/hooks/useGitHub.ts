import { useState, useCallback } from 'react';
import { GitHubRepository, GitHubBranch, GitHubCommit, ConnectionConfig } from '@/types/github';
import { useToast } from '@/hooks/use-toast';

export const useGitHub = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ConnectionConfig | null>(null);
  const { toast } = useToast();

  const makeRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!config?.token) {
      throw new Error('No token configured');
    }

    const response = await fetch(`https://api.github.com${url}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }, [config?.token]);

  const connect = useCallback(async (connectionConfig: ConnectionConfig) => {
    setLoading(true);
    try {
      // Test the connection by fetching user info
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${connectionConfig.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token or insufficient permissions');
      }

      const userData = await response.json();
      
      setConfig({
        ...connectionConfig,
        username: userData.login
      });
      setIsConnected(true);
      
      toast({
        title: "Successfully connected!",
        description: `Connected as ${userData.login}`,
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    setConfig(null);
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from GitHub",
    });
  }, [toast]);

  const getRepository = useCallback(async (owner: string, repo: string): Promise<GitHubRepository> => {
    return makeRequest(`/repos/${owner}/${repo}`);
  }, [makeRequest]);

  const getBranches = useCallback(async (owner: string, repo: string): Promise<GitHubBranch[]> => {
    return makeRequest(`/repos/${owner}/${repo}/branches`);
  }, [makeRequest]);

  const getCommits = useCallback(async (owner: string, repo: string, branch?: string): Promise<GitHubCommit[]> => {
    const url = `/repos/${owner}/${repo}/commits${branch ? `?sha=${branch}` : ''}`;
    return makeRequest(url);
  }, [makeRequest]);

  const createRepository = useCallback(async (name: string, description?: string, isPrivate = false) => {
    return makeRequest('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });
  }, [makeRequest]);

  return {
    isConnected,
    loading,
    config,
    connect,
    disconnect,
    getRepository,
    getBranches,
    getCommits,
    createRepository,
  };
};