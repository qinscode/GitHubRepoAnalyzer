import { Tabs, Tab, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ViewListIcon from '@mui/icons-material/ViewList';
import type { FunctionComponent } from '../../common/types';

interface RepoTabsProps {
  activeTab: number;
  handleTabChange: (newValue: number) => void;
}

const RepoTabs = ({ activeTab, handleTabChange }: RepoTabsProps): FunctionComponent => {
  return (
    <Box>
      <Tabs
        aria-label="GitHub repository analysis options"
        className="min-h-[52px]"
        value={activeTab}
        variant="fullWidth"
        TabIndicatorProps={{
          className: 'bg-blue-600 h-[3px]',
          sx: {
            borderRadius: '3px 3px 0 0',
            height: '3px',
          }
        }}
        sx={{
          '& .MuiTabs-flexContainer': {
            background: 'linear-gradient(to bottom, rgba(249, 250, 251, 1), rgba(255, 255, 255, 1))',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          },
          '& .MuiTab-root': {
            transition: 'all 0.2s ease',
            fontSize: '0.95rem',
          }
        }}
        onChange={(_, newValue) => { handleTabChange(newValue); }}
      >
        <Tab 
          className="font-medium py-3 px-4 text-gray-600 hover:text-blue-700 z-10" 
          icon={<GitHubIcon className="mr-2" fontSize="small" />} 
          iconPosition="start" 
          label="Single Repository"
          sx={{ 
            '&.Mui-selected': {
              color: '#2563eb',
              fontWeight: '600',
              backgroundColor: 'transparent'
            }
          }}
        />
        <Tab 
          className="font-medium py-3 px-4 text-gray-600 hover:text-blue-700 z-10" 
          icon={<ViewListIcon className="mr-2" fontSize="small" />} 
          iconPosition="start" 
          label="Batch Repositories"
          sx={{ 
            '&.Mui-selected': {
              color: '#2563eb',
              fontWeight: '600',
              backgroundColor: 'transparent'
            }
          }}
        />
      </Tabs>
    </Box>
  );
};

export default RepoTabs; 