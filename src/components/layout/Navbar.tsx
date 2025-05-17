import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from '@tanstack/react-router';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import type { FunctionComponent } from '../../common/types';

const Navbar = (): FunctionComponent => {
  return (
    <AppBar 
      className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg" 
      elevation={0}
      position="static"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters className="py-2">
          <Typography
            noWrap
            className="flex-grow flex items-center text-white no-underline hover:opacity-90 transition-opacity"
            component={Link}
            to="/"
            variant="h6"
          >
            <GitHubIcon className="mr-2" />
            <span className="font-bold tracking-wide">GitHub Repository Analyzer</span>
          </Typography>
          <Box className="flex space-x-2">
            <Button 
              className="transition-all duration-200 hover:bg-white/10 text-white"
              component={Link}
              startIcon={<HomeIcon />}
              to="/home"
            >
              Home
            </Button>
            <Button 
              className="bg-white text-blue-800 hover:bg-blue-50 transition-all duration-200 font-medium rounded-lg"
              component={Link}
              startIcon={<GitHubIcon />}
              to="/"
              variant="contained"
            >
              GitHub Analyzer
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 