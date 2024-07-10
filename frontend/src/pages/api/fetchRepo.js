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
  if (req.method === 'POST') {
    const { link } = req.body;
    // const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // if (!GITHUB_TOKEN) {
    //   return res.status(500).json({ error: 'GitHub token not found in environment variables' });
    // }
    const config = { headers : {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'scope': 'repo:status'
    }};


    try {

      const repoResponse = await axios.get(`https://api.github.com/repos/${link}`, config);
      const repoData = repoResponse.data;


      const contributorsResponse = await axios.get(`https://api.github.com/repos/${link}/contributors`);
      const contributorsData = contributorsResponse.data;

      // Fetch pull requests
      const pullsUrl = `https://api.github.com/repos/${link}/pulls?state=all&per_page=100`;
      const pullsResponse = await axios.get(pullsUrl);
      const pullsData = pullsResponse.data;

      // Fetch commits
      const commitsUrl = `https://api.github.com/repos/${link}/commits?per_page=100`;
      const commitsResponse = await axios.get(commitsUrl);
      const commitsData = commitsResponse.data;

      // Aggregate pull requests by contributor
      const pullRequestsByContributor = {};
      pullsData.forEach(pull => {
        const author = pull.user.login;
        if (!pullRequestsByContributor[author]) {
          pullRequestsByContributor[author] = 0;
        }
        pullRequestsByContributor[author] += 1;
      });

     

      res.status(200).json({
        repoData,
        contributors: contributorsData,
        pulls: pullsData,
        commits: commitsData,
        pullRequestsByContributor,
      });
    } catch (error) {
      console.error('GitHub API error:', error);
      res.status(500).json({ error: 'GitHub API error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
