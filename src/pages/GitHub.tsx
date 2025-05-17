import { useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import SingleRepoForm from '../components/github/SingleRepoForm';
import BatchRepoForm from '../components/github/BatchRepoForm';
import RepoTabs from '../components/github/RepoTabs';
import type { FunctionComponent } from '../common/types';

export const GitHub = (): FunctionComponent => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container className="mt-10 mb-16" maxWidth="lg">
      <Paper 
        className="p-6 md:p-8 rounded-xl bg-white shadow-xl bg-gradient-to-b from-white to-blue-50/30"
        elevation={3}
      >
        <Box className="mb-8 text-center">
          <Typography className="font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600" component="h1" variant="h3">
            GitHub Repository Analyzer
          </Typography>
          <Typography className="max-w-2xl mx-auto" color="text.secondary" variant="subtitle1">
            Analyze GitHub repositories individually or in batch to gain valuable insights
          </Typography>
        </Box>

        <RepoTabs activeTab={activeTab} handleTabChange={handleTabChange} />
        
        <Box className="mt-6">
          {activeTab === 0 ? (
            <SingleRepoForm />
          ) : (
            <BatchRepoForm />
          )}
        </Box>
      </Paper>
    </Container>
  );
}; 