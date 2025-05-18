import { Box, Grow } from '@mui/material';
import type { FunctionComponent } from '../../common/types';
import '../github/FormStyles.css';

const RepoTabs = (): FunctionComponent => {
  return (
    <Grow in={true} timeout={700}>
      <Box className="tab-container">
        <Box
          sx={{
            padding: '1.5rem',
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.8))',
            borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
          }}
        >
          <h1 className="text-xl font-bold text-gray-800 mb-2">GitHub Repository Analysis</h1>
          <p className="text-sm text-gray-600">Analyze single repositories or multiple repositories in batch mode</p>
        </Box>
      </Box>
    </Grow>
  );
};

export default RepoTabs; 