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

// 定义仓库数据类型
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
  
  // 从环境变量中获取预设的 GitHub 令牌
  useEffect(() => {
    const presetToken = import.meta.env['VITE_GITHUB_API_TOKEN'];
    if (presetToken) {
      setToken(presetToken);
    }
  }, []);
  
  // 检查环境变量中是否有预设令牌
  const hasPresetToken = !!import.meta.env['VITE_GITHUB_API_TOKEN'];

  const addRepos = () => {
    if (!repoUrls.trim()) {
      setError('请输入GitHub仓库URL');
      return;
    }

    const urlList = repoUrls.trim().split('\n').filter(url => url.trim() !== '');
    
    if (urlList.length === 0) {
      setError('请输入至少一个有效的GitHub仓库URL');
      return;
    }

    const newRepos: Array<RepoListItem> = [];
    const errors: Array<string> = [];

    urlList.forEach(url => {
      // 验证URL格式
      const trimmedUrl = url.trim();
      const repoInfo = parseRepoUrl(trimmedUrl);
      
      if (!repoInfo) {
        errors.push(`无效的仓库URL格式: ${trimmedUrl}`);
        return;
      }

      // 检查重复添加
      if (repoList.some(repo => repo.url.toLowerCase() === trimmedUrl.toLowerCase()) || 
          newRepos.some(repo => repo.url.toLowerCase() === trimmedUrl.toLowerCase())) {
        errors.push(`仓库已添加到列表中: ${trimmedUrl}`);
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
      // 如果有一些有效的仓库，我们仍然添加它们
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
      setError('请至少添加一个仓库进行分析');
      return;
    }

    if (!token.trim()) {
      setError('请输入GitHub令牌');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 将所有仓库状态更新为处理中
      setRepoList(previous => 
        previous.map(repo => ({ ...repo, status: 'processing' }))
      );

      const updatedRepos = [...repoList];
      const analysisResults: Array<RepoResult> = [];

      // 依次处理每个仓库
      for (let index = 0; index < updatedRepos.length; index++) {
        // 确保使用前有效检查
        if (index < 0 || index >= updatedRepos.length) continue;
        
        const currentRepo = updatedRepos[index];
        // 确保 currentRepo 有定义
        if (!currentRepo) continue;
        
        try {
          // 使用GraphQL API获取仓库数据
          const repoData = await fetchRepositoryData(currentRepo.url, token);
          
          // 计算仓库统计指标
          const totalCommits = Object.values(repoData.commits).reduce((sum, commits) => sum + commits.length, 0);
          const totalIssues = Object.values(repoData.issues).reduce((sum, issues) => sum + issues.length, 0);
          const totalPRs = Object.values(repoData.prs).reduce((sum, prs) => sum + prs.length, 0);
          const contributors = new Set([
            ...Object.keys(repoData.commits),
            ...Object.keys(repoData.issues),
            ...Object.keys(repoData.prs),
          ]).size;
          
          // 获取仓库名称
          const repoInfo = parseRepoUrl(currentRepo.url);
          const repoName = repoInfo ? repoInfo.repo : currentRepo.url.split('/').pop() || currentRepo.url;
          
          // 创建结果对象
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
          
          // 更新已处理仓库的状态
          updatedRepos[index] = { 
            id: currentRepo.id,
            url: currentRepo.url,
            status: 'completed',
            result
          };
        } catch (error_) {
          // 处理单个仓库失败
          updatedRepos[index] = {
            id: currentRepo.id,
            url: currentRepo.url,
            status: 'error',
            error: (error_ as Error).message
          };
        }
        
        // 更新UI显示
        setRepoList([...updatedRepos]);
      }
      
      setResults(analysisResults);
      setSuccess(true);
    } catch (error_) {
      setError(`批量分析失败: ${(error_ as Error).message}`);
      console.error(error_);
      
      // 标记所有为错误状态
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

  return (
    <Box>
      <Paper className="p-6 bg-white/50 rounded-xl border border-gray-100" elevation={0}>
        <form onSubmit={handleSubmit}>
          <Typography className="font-bold mb-4 text-gray-800" variant="h6">
            批量分析配置
          </Typography>
          
          <Box className="flex flex-col gap-2 mb-4">
            <TextField
              fullWidth
              multiline
              className="flex-grow"
              label="GitHub仓库列表"
              placeholder="每行输入一个仓库地址，例如:\nhttps://github.com/owner/repo\nowner/repo2"
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
              className="whitespace-nowrap min-w-[120px] rounded-lg" 
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={addRepos}
            >
              添加仓库
            </Button>
          </Box>
          
          {repoList.length > 0 && (
            <Box className="mt-4 mb-6">
              <Typography className="font-medium mb-2" variant="subtitle1">
                待分析仓库列表
              </Typography>
              <Paper className="max-h-60 overflow-y-auto rounded-lg" variant="outlined">
                <List dense>
                  {repoList.map(repo => (
                    <ListItem
                      key={repo.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      secondaryAction={
                        <IconButton 
                          aria-label="delete" 
                          disabled={loading}
                          edge="end"
                          onClick={() => { removeRepo(repo.id); }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText 
                        primary={repo.url} 
                        secondary={
                          repo.status && (
                            <Chip 
                              className="mt-1" 
                              color={getStatusColor(repo.status)} 
                              label={repo.status}
                              size="small"
                            />
                          )
                        }
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
              disabled={loading || repoList.length === 0}
              size="large"
              startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <PlaylistAddCheckIcon />}
              type="submit"
              variant="contained"
            >
              {loading ? '分析中...' : '批量分析'}
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
          批量分析完成!
        </Alert>
      </Snackbar>
      
      {results.length > 0 && (
        <>
          <Divider className="my-8" />
          <Typography className="mb-6 font-bold text-gray-800" variant="h5">
            批量分析结果
          </Typography>
          <BatchResults results={results} />
        </>
      )}
    </Box>
  );
};

export default BatchRepoForm; 