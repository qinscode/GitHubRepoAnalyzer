import axios from 'axios';

/**
 * Send a GraphQL request to GitHub API
 * @param query GraphQL query
 * @param variables Query variables
 * @param token GitHub access token
 * @returns Response data
 */
export const graphqlRequest = async (
  query: string, 
  variables: Record<string, any>, 
  token: string
): Promise<any> => {
  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      {
        query,
        variables
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('GraphQL API request failed:', error);
    throw new Error(`GitHub API request failed: ${(error as Error).message}`);
  }
}; 