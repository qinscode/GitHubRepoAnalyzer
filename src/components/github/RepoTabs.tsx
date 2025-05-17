import { Tabs, Tab, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ListAltIcon from '@mui/icons-material/ListAlt';
import type { FunctionComponent } from '../../common/types';

interface RepoTabsProps {
  activeTab: number;
  handleTabChange: (newValue: number) => void;
}

const RepoTabs = ({ activeTab, handleTabChange }: RepoTabsProps): FunctionComponent => {
  return (
    <Box className="border-b border-gray-200">
      <Tabs
        aria-label="GitHub repository analysis options"
        className="min-h-[48px]"
        value={activeTab}
        variant="fullWidth"
        TabIndicatorProps={{
          className: 'bg-blue-600 h-[3px]'
        }}
        onChange={(_, newValue) => { handleTabChange(newValue); }}
      >
        <Tab 
          className="font-medium py-3 px-4 transition-all duration-200 text-gray-700 hover:text-blue-700" 
          icon={<GitHubIcon />} 
          iconPosition="start" 
          label="Single Repository"
          sx={{ 
            '&.Mui-selected': {
              color: '#2563eb',
              fontWeight: 'bold'
            }
          }}
        />
        <Tab 
          className="font-medium py-3 px-4 transition-all duration-200 text-gray-700 hover:text-blue-700" 
          icon={<ListAltIcon />} 
          iconPosition="start" 
          label="Batch Repositories"
          sx={{ 
            '&.Mui-selected': {
              color: '#2563eb',
              fontWeight: 'bold'
            }
          }}
        />
      </Tabs>
    </Box>
  );
};

export default RepoTabs; 