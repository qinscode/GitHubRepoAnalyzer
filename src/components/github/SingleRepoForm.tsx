import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  Paper,
  Divider,
  Snackbar
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import type { FunctionComponent } from '../../common/types';
import RepoResults from './RepoResults';
import { fetchRepositoryData, parseRepoUrl } from '../../services/githubGraphQLService';

interface RepoData {
  commits: Record<string, Array<{message: string, id: string}>>;
  issues: Record<string, Array<{title: string, body: string}>>;
  prs: Record<string, Array<{title: string}>>;
  teamwork: {
    issueComments: Record<string, number>;
    prReviews: Record<string, number>;
  };
}

const SingleRepoForm = (): FunctionComponent => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [token, setToken] = useState<string>('');
  
  // 从环境变量中获取预设的 GitHub 令牌
  useEffect(() => {
    const presetToken = import.meta.env['VITE_GITHUB_API_TOKEN'];
    if (presetToken) {
      setToken(presetToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      setError('请输入GitHub仓库URL或owner/repo格式');
      return;
    }

    if (!token.trim()) {
      setError('请输入GitHub令牌');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 使用GraphQL服务获取仓库数据
      const data = await fetchRepositoryData(repoUrl, token);
      setRepoData(data);
      setSuccess(true);
    } catch (error_) {
      setError(`仓库分析失败: ${(error_ as Error).message}`);
      console.error(error_);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const extractRepoName = () => {
    if (!repoUrl) return '';
    
    const repoInfo = parseRepoUrl(repoUrl);
    if (repoInfo) {
      return `${repoInfo.owner}/${repoInfo.repo}`;
    }
    
    return repoUrl;
  };

  // 检查环境变量中是否有预设令牌
  const hasPresetToken = !!import.meta.env['VITE_GITHUB_API_TOKEN'];

  return (
    <Box>
      <Paper className="p-6 bg-white/50 rounded-xl border border-gray-100" elevation={0}>
        <form onSubmit={handleSubmit}>
          <Typography className="font-bold mb-4 text-gray-800" variant="h6">
            仓库信息
          </Typography>
          
          <TextField
            fullWidth
            className="mb-4"
            label="GitHub仓库"
            margin="normal"
            placeholder="例如: https://github.com/owner/repo 或 owner/repo"
            value={repoUrl}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GitHubIcon color="action" />
                </InputAdornment>
              ),
              className: "rounded-lg bg-white shadow-sm"
            }}
            onChange={(e) => { setRepoUrl(e.target.value); }}
          />
          
          <TextField
            fullWidth
            className="mb-2"
            helperText={hasPresetToken ? "使用预设令牌，您可以修改它" : "令牌需要repo访问权限"}
            label="GitHub令牌"
            margin="normal"
            placeholder="输入您的GitHub个人访问令牌"
            type="password"
            value={token}
            variant="outlined"
            InputProps={{
              className: "rounded-lg bg-white shadow-sm"
            }}
            onChange={(e) => { setToken(e.target.value); }}
          />
          
          {error && (
            <Alert className="mt-4 rounded-lg" severity="error">
              {error}
            </Alert>
          )}
          
          <Box className="mt-6 flex justify-center">
            <Button
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              disabled={loading}
              size="large"
              startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
              type="submit"
              variant="contained"
            >
              {loading ? '分析中...' : '分析仓库'}
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
          仓库分析成功!
        </Alert>
      </Snackbar>
      
      {repoData && (
        <>
          <Divider className="my-8" />
          <Typography className="mb-6 font-bold text-gray-800" variant="h5">
            分析结果: <span className="text-blue-600">{extractRepoName()}</span>
          </Typography>
          <RepoResults data={repoData} />
        </>
      )}
    </Box>
  );
};

export default SingleRepoForm; 