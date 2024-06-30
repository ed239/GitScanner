import jsPDF from 'jspdf';

const generatePDF = (repoInfo) => {
  const doc = new jsPDF();

  if (repoInfo) {
    doc.text("Repository Info", 10, 10);
    doc.text(`Name: ${repoInfo.repoData.name}`, 10, 20);
    doc.text(`Full Name: ${repoInfo.repoData.full_name}`, 10, 30);
    doc.text(`Owner: ${repoInfo.repoData.owner.login}`, 10, 40);
    doc.text(`Description: ${repoInfo.repoData.description}`, 10, 50);
    doc.text(`Stars: ${repoInfo.repoData.stargazers_count}`, 10, 60);
    doc.text(`Forks: ${repoInfo.repoData.forks_count}`, 10, 70);
    doc.text(`Open Issues: ${repoInfo.repoData.open_issues_count}`, 10, 80);
    doc.text(`Watchers: ${repoInfo.repoData.watchers_count}`, 10, 90);
    doc.text(`Created At: ${new Date(repoInfo.repoData.created_at).toLocaleString()}`, 10, 100);
    doc.text(`Updated At: ${new Date(repoInfo.repoData.updated_at).toLocaleString()}`, 10, 110);
    doc.text(`Pushed At: ${new Date(repoInfo.repoData.pushed_at).toLocaleString()}`, 10, 120);
    doc.text(`Language: ${repoInfo.repoData.language}`, 10, 130);
    doc.text(`License: ${repoInfo.repoData.license ? repoInfo.repoData.license.name : "None"}`, 10, 140);

    if (repoInfo.contributors && repoInfo.contributors.length > 0) {
      doc.text("Contributors:", 10, 150);
      repoInfo.contributors.forEach((contributor, index) => {
        doc.text(`${contributor.login} (${contributor.contributions} contributions)`, 10, 160 + (index * 10));
      });
    }

    if (repoInfo.pullRequestsByContributor) {
      doc.text("Pull Requests by Contributor:", 10, 170 + (repoInfo.contributors.length * 10));
      Object.keys(repoInfo.pullRequestsByContributor).forEach((contributor, index) => {
        doc.text(`${contributor}: ${repoInfo.pullRequestsByContributor[contributor]}`, 10, 180 + (repoInfo.contributors.length * 10) + (index * 10));
      });
    }
  }

  doc.save('repo-info.pdf');
};

export default generatePDF;
