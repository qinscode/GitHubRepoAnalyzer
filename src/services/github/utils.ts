import type { RepoInfo } from './types';

/**
 * Process repository URL and extract owner and repo name
 * @param url GitHub repository URL
 * @returns Parsed repository info or null if invalid
 */
export const parseRepoUrl = (url: string): RepoInfo | null => {
  try {
    if (!url) return null;
    
    // Process input URL, remove possible prefixes and suffixes
    let cleanUrl = url.trim();
    
    // Remove @ prefix
    if (cleanUrl.startsWith('@')) {
      cleanUrl = cleanUrl.substring(1);
    }
    
    // Remove .git suffix (wherever it appears)
    cleanUrl = cleanUrl.replace(/\.git$/i, '');
    
    // Handle full URL format
    if (cleanUrl.includes('github.com')) {
      try {
        const parsed = new URL(cleanUrl);
        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        
        if (pathSegments.length >= 2) {
          const owner = pathSegments[0];
          const repo = pathSegments[1];
          
          if (owner && repo) {
            return { owner, repo };
          }
        }
      } catch (error) {
        // URL parsing failed, try alternative methods
        console.error('URL parsing failed, trying alternative methods:', error);
      }
    } 
    
    // Handle shorthand format owner/repo
    if (cleanUrl.includes('/')) {
      const parts = cleanUrl.split('/');
      // Ensure we have at least owner/repo parts
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const owner = parts[0].trim();
        const repo = parts[1].trim();
        
        if (owner && repo) {
          return { owner, repo };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse repo URL:', error);
    return null;
  }
}; 