// pages/api/fetch-repo.js
import axios from 'axios';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { link } = req.body;
//     console.log(`Fetching info for repo: ${link}`); // Log the repository link

//     const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

//     if (!GITHUB_TOKEN) {
//       return res.status(500).json({ error: 'GitHub token not found in environment variables' });
//     }

//     const headers = {
//       Authorization: `token ${GITHUB_TOKEN}`,
//       Accept: 'application/vnd.github.v3+json',
//     };

//     try {
      // const response = await axios.get(`https://api.github.com/repos/${link}`);
      // console.log('Fetched repository info:', response.data); 
      // res.status(200).json(response.data);

      // const contributorsResponse = await axios.get(`https://api.github.com/repos/${link}/contributors`);
      // const contributorsData = contributorsResponse.data;
      // console.log('Fetched contributor info:', contributorsData.data);

//     } catch (error) {
//       console.error('GitHub API error:', error); // Log any errors
//       res.status(500).json({ error: 'GitHub API error' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }

// pages/api/fetchRepo.js

// pages/api/fetchRepo.js


export default async function handler(req, res) {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;

  };
  if (req.method === 'POST') {
    const { link } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
  

    try {
      const config = token ? {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      } : {};
    
  

      const repoResponse = await axios.get(`https://api.github.com/repos/${link}`, config);
      const repoData = repoResponse.data;

      repoData.created_at = formatDate(repoData.created_at);
      repoData.updated_at = formatDate(repoData.updated_at);


      const contributorsResponse = await axios.get(`https://api.github.com/repos/${link}/contributors`, config);
      const contributorsData = contributorsResponse.data;

      const languages = await axios.get(`https://api.github.com/repos/${link}/languages`, config);
      const languageData = languages.data;

      // Fetch pull requests
      const pullsUrl = `https://api.github.com/repos/${link}/pulls?state=all&per_page=100`;
      const pullsResponse = await axios.get(pullsUrl, config);
      const pullsData = pullsResponse.data;

      // Fetch commits
      const commitsUrl = `https://api.github.com/repos/${link}/commits?per_page=100`;
      const commitsResponse = await axios.get(commitsUrl, config);
      const commitsData = commitsResponse.data;

      // Aggregate pull requests by contributor
      const pullRequestsByContributor = {};
      pullsData.forEach(pull => {
        
        const author = pull.user.login;
        if(pull.merged_at != null){
          if (!pullRequestsByContributor[author]) {
            pullRequestsByContributor[author] = 0;
          }
          pullRequestsByContributor[author] += 1;
        }
        
      });

      const commitsByContributor = {};
      commitsData.forEach(commit => {
       
        if(commit.author != null && commit.author.login != null){
            const author = commit.author.login;
            if (!commitsByContributor[author]) {
              commitsByContributor[author] = 0;
            }
            commitsByContributor[author] += 1;
        }
      
        
      });

     

      res.status(200).json({
        repoData,
        contributors: contributorsData,
        pulls: pullsData,
        commits: commitsData,
        pullRequestsByContributor,
        commitsByContributor,
        languages: languageData,
      });
     
    } catch (error) {
      
    
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
    
        if (error.response.status === 403 && error.response.data.message === 'rate limit exceeded') {
          res.status(429).json({ error: 'GitHub API rate limit exceeded' });
        } else {
          res.status(500).json({ error: 'GitHub API error' });
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        res.status(500).json({ error: 'No response received from GitHub API' });
      } else {
        console.error('Error setting up request:', error.message);
        res.status(500).json({ error: 'Error setting up request' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}





