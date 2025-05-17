import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import type { FunctionComponent } from '../../common/types';
import BatchResults from './BatchResults';
import { fetchRepositoryData, parseRepoUrl } from '../../services/githubGraphQLService';

// Define repository data types
interface RepoData {
  commits: Record<string, Array<{message: string, id: string}>>;
  issues: Record<string, Array<{title: string, body: string}>>;
  prs: Record<string, Array<{title: string}>>;
  teamwork: {
    issueComments: Record<string, number>;
    prReviews: Record<string, number>;
  };
}

interface RepoResult {
  repoUrl: string;
  repoName: string;
  commits: number;
  issues: number;
  prs: number;
  contributors: number;
  data: RepoData;
}

interface RepoListItem {
  id: string;
  url: string;
  status?: 'pending' | 'processing' | 'completed' | 'error';
  result?: RepoResult;
  error?: string;
}

const BatchRepoForm = (): FunctionComponent => {
  const [repoUrls, setRepoUrls] = useState<string>('');
  const [repoList, setRepoList] = useState<Array<RepoListItem>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [results, setResults] = useState<Array<RepoResult>>([]);
  
  // Get preset GitHub token from environment variables
  useEffect(() => {
    const presetToken = import.meta.env['VITE_GITHUB_API_TOKEN'];
    if (presetToken) {
      setToken(presetToken);
    }
  }, []);
  
  // Check if there's a preset token in environment variables
  const hasPresetToken = !!import.meta.env['VITE_GITHUB_API_TOKEN'];

  const addRepos = () => {
    if (!repoUrls.trim()) {
      setError('Please enter GitHub repository URLs');
      return;
    }

    const urlList = repoUrls.trim().split('\n').filter(url => url.trim() !== '');
    
    if (urlList.length === 0) {
      setError('Please enter at least one valid GitHub repository URL');
      return;
    }

    const newRepos: Array<RepoListItem> = [];
    const errors: Array<string> = [];

    urlList.forEach(url => {
      // Validate URL format
      const trimmedUrl = url.trim();
      const repoInfo = parseRepoUrl(trimmedUrl);
      
      if (!repoInfo) {
        errors.push(`Invalid repository URL format: ${trimmedUrl}`);
        return;
      }

      // Check for duplicates
      if (repoList.some(repo => repo.url.toLowerCase() === trimmedUrl.toLowerCase()) || 
          newRepos.some(repo => repo.url.toLowerCase() === trimmedUrl.toLowerCase())) {
        errors.push(`Repository already added to the list: ${trimmedUrl}`);
        return;
      }

      newRepos.push({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        url: trimmedUrl,
        status: 'pending'
      });
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      // If there are some valid repositories, we still add them
      if (newRepos.length > 0) {
        setRepoList([...repoList, ...newRepos]);
        setRepoUrls('');
      }
      return;
    }

    setRepoList([...repoList, ...newRepos]);
    setRepoUrls('');
    setError(null);
  };

  const removeRepo = (id: string) => {
    setRepoList(repoList.filter(repo => repo.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (repoList.length === 0) {
      setError('Please add at least one repository for analysis');
      return;
    }

    if (!token.trim()) {
      setError('Please enter a GitHub token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Update all repositories status to processing
      setRepoList(previous => 
        previous.map(repo => ({ ...repo, status: 'processing' }))
      );

      const updatedRepos = [...repoList];
      const analysisResults: Array<RepoResult> = [];

      // Process each repository sequentially
      for (let index = 0; index < updatedRepos.length; index++) {
        // Ensure valid check before use
        if (index < 0 || index >= updatedRepos.length) continue;
        
        const currentRepo = updatedRepos[index];
        // Ensure currentRepo is defined
        if (!currentRepo) continue;
        
        try {
          // Use GraphQL API to get repository data
          const repoData = await fetchRepositoryData(currentRepo.url, token);
          
          // Calculate repository statistics
          const totalCommits = Object.values(repoData.commits).reduce((sum, commits) => sum + commits.length, 0);
          const totalIssues = Object.values(repoData.issues).reduce((sum, issues) => sum + issues.length, 0);
          const totalPRs = Object.values(repoData.prs).reduce((sum, prs) => sum + prs.length, 0);
          const contributors = new Set([
            ...Object.keys(repoData.commits),
            ...Object.keys(repoData.issues),
            ...Object.keys(repoData.prs),
          ]).size;
          
          // Get repository name
          const repoInfo = parseRepoUrl(currentRepo.url);
          const repoName = repoInfo ? repoInfo.repo : currentRepo.url.split('/').pop() || currentRepo.url;
          
          // Create result object
          const result: RepoResult = {
            repoUrl: currentRepo.url,
            repoName,
            commits: totalCommits,
            issues: totalIssues,
            prs: totalPRs,
            contributors,
            data: repoData
          };
          
          analysisResults.push(result);
          
          // Update processed repository status
          updatedRepos[index] = { 
            id: currentRepo.id,
            url: currentRepo.url,
            status: 'completed',
            result
          };
        } catch (error_) {
          // Handle single repository failure
          updatedRepos[index] = {
            id: currentRepo.id,
            url: currentRepo.url,
            status: 'error',
            error: (error_ as Error).message
          };
        }
        
        // Update UI display
        setRepoList([...updatedRepos]);
      }
      
      setResults(analysisResults);
      setSuccess(true);
    } catch (error_) {
      setError(`Batch analysis failed: ${(error_ as Error).message}`);
      console.error(error_);
      
      // Mark all as error status
      setRepoList(previous => 
        previous.map(repo => {
          if (repo.status !== 'completed') {
            return {
              ...repo,
              status: 'error'
            };
          }
          return repo;
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'processing': return 'primary';
      case 'completed': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'completed': return 'Completed';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <Box>
      <Paper className="p-6 bg-white/50 rounded-xl border border-gray-100" elevation={0}>
        <form onSubmit={handleSubmit}>
          <Typography className="font-bold mb-4 text-gray-800" variant="h6">
            Batch analysis configuration
          </Typography>
          
          <Box className="flex items-start gap-2">
            <TextField
              fullWidth
              multiline
              className="flex-grow"
              label="GitHub repository list"
              placeholder="Enter each repository URL per line, e.g.:\nhttps://github.com/owner/repo\nowner/repo2"
              rows={4}
              size="medium"
              value={repoUrls}
              variant="outlined"
              InputProps={{
                className: "rounded-lg bg-white shadow-sm"
              }}
              onChange={(e) => { setRepoUrls(e.target.value); }}
            />
            
            <Button
              className="mt-2 min-w-[120px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              startIcon={<AddIcon />}
              variant="contained"
              onClick={addRepos}
            >
              Add repository
            </Button>
          </Box>
          
          {repoList.length > 0 && (
            <Box className="mt-4 mb-6">
              <Typography className="font-medium mb-2" variant="subtitle1">
                Pending repositories
              </Typography>
              <Paper className="max-h-60 overflow-y-auto rounded-lg" variant="outlined">
                <List dense>
                  {repoList.map((repo) => (
                    <ListItem
                      key={repo.id}
                      secondaryAction={
                        <Box className="flex items-center">
                          <Chip 
                            className="mr-2"
                            color={getStatusColor(repo.status)}
                            label={getStatusLabel(repo.status)}
                            size="small"
                          />
                          <IconButton 
                            aria-label="delete" 
                            disabled={loading || repo.status === 'processing'} 
                            edge="end" 
                            onClick={() => removeRepo(repo.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText 
                        primary={repo.url} 
                        secondary={repo.error ? `Error: ${repo.error}` : null}
                        primaryTypographyProps={{
                          className: repo.status === 'error' ? 'line-through text-gray-500' : ''
                        }}
                        secondaryTypographyProps={{
                          className: 'text-red-500'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
          
          <TextField
            fullWidth
            className="mb-2"
            helperText={hasPresetToken ? "Use preset token, you can modify it" : "Token is required for repo access"}
            label="GitHub token"
            margin="normal"
            placeholder="Enter your GitHub personal access token"
            type="password"
            value={token}
            variant="outlined"
            InputProps={{
              className: "rounded-lg bg-white shadow-sm"
            }}
            onChange={(e) => { setToken(e.target.value); }}
          />
          
          {error && (
            <Alert className="mt-4 mb-4 rounded-lg" severity="error">
              {error.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </Alert>
          )}
          
          <Box className="mt-6 flex justify-center">
            <Button
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              disabled={loading || repoList.length === 0}
              size="large"
              startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <PlaylistAddCheckIcon />}
              type="submit"
              variant="contained"
            >
              {loading ? 'Analyzing...' : 'Batch analyze'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Snackbar
        autoHideDuration={6000}
        open={success}
        onClose={handleCloseSnackbar}
      >
        <Alert className="rounded-lg shadow-lg" severity="success" onClose={handleCloseSnackbar}>
          Batch analysis completed!
        </Alert>
      </Snackbar>
      
      {results.length > 0 && (
        <>
          <Divider className="my-8" />
          <Typography className="mb-6 font-bold text-gray-800" variant="h5">
            Batch analysis results
          </Typography>
          <BatchResults results={results} />
        </>
      )}
    </Box>
  );
};

export default BatchRepoForm; 