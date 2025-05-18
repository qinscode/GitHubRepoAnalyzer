import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  Card,
  CardContent,
  Fade,
  Grow,
  Zoom,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import KeyIcon from '@mui/icons-material/Key';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { fetchRepositoryData } from '../../services/githubGraphQLService';
import './FormStyles.css';

interface SingleRepoFormProps {
  onDataFetched: (data: any, repoUrl: string) => void;
}

const SingleRepoForm: React.FC<SingleRepoFormProps> = ({ onDataFetched }) => {
  // Form state
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Get the preset GitHub token from environment variables
  useEffect(() => {
    const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
    if (presetToken) {
      setToken(presetToken);
    }
  }, []);

  // Check if there's a preset token
  const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL or owner/repo format');
      return;
    }

    if (!token.trim()) {
      setError('Please enter a GitHub token');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Use GraphQL service to fetch repository data
      const data = await fetchRepositoryData(repoUrl, token);
      onDataFetched(data, repoUrl);
      setSuccess(true);
      
      // Reset form
      setRepoUrl('');
    } catch (error_) {
      setError(`Repository analysis failed: ${(error_ as Error).message}`);
      console.error(error_);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = (): void => {
    setRepoUrl('');
    setError(null);
    setSuccess(false);
  };

  return (
    <Grow in timeout={500}>
      <Card className="form-card" elevation={0}>
        <CardContent sx={{ p: 3 }}>
          <Typography gutterBottom className="form-title" variant="h5">
            Analyze Single Repository
          </Typography>

          <Box className="form-container" component="form" onSubmit={handleSubmit}>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <TextField
                fullWidth
                className="enhanced-input"
                disabled={loading}
                helperText="Repository URL or owner/repo format"
                label="GitHub Repository"
                placeholder="Enter repository URL or owner/repo (e.g. facebook/react)"
                value={repoUrl}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box className="input-icon-container">
                        <GitHubIcon sx={{ color: '#3B82F6' }} />
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: loading && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  )
                }}
                onChange={(event_) => { setRepoUrl(event_.target.value); }}
              />
            </Box>

            {!hasPresetToken && (
              <Box sx={{ position: 'relative', mb: 3 }}>
                <TextField
                  fullWidth
                  className="enhanced-input"
                  disabled={loading}
                  helperText="GitHub personal access token with repo scope"
                  label="GitHub Token"
                  placeholder="Enter your GitHub personal access token"
                  type="password"
                  value={token}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="input-icon-container">
                          <KeyIcon sx={{ color: '#4F46E5' }} />
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event_) => { setToken(event_.target.value); }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                fullWidth
                className="submit-button"
                disabled={loading}
                startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
                type="submit"
                variant="contained"
              >
                {loading ? 'Analyzing Repository...' : 'Analyze Repository'}
              </Button>

              {(error || success) && (
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: '12px',
                    minWidth: '120px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': {
                      borderColor: 'rgba(0, 0, 0, 0.24)',
                      background: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                  onClick={clearForm}
                >
                  Clear
                </Button>
              )}
            </Box>
            
            {error && (
              <Zoom in={!!error} timeout={300}>
                <Alert 
                  className="custom-alert error"
                  icon={<ErrorIcon />} 
                  severity="error"
                  sx={{ mt: 3 }}
                >
                  {error}
                </Alert>
              </Zoom>
            )}
            
            {success && !error && (
              <Zoom in={success} timeout={300}>
                <Alert 
                  className="custom-alert success"
                  icon={<CheckCircleIcon />} 
                  severity="success"
                  sx={{ mt: 3 }}
                >
                  Repository analyzed successfully!
                </Alert>
              </Zoom>
            )}

            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mt: 2, 
                color: 'text.secondary',
                fontSize: '0.875rem',
                opacity: 0.7,
                transition: 'opacity 0.3s ease',
                '&:hover': { opacity: 1 }
              }}
            >
              <PlaylistAddCheckIcon sx={{ fontSize: '1rem' }} />
              <Typography variant="caption">
                This tool analyzes commit history, issues, pull requests, and team collaboration patterns.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default SingleRepoForm; 