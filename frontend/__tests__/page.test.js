import { render, screen,fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../src/app/page";
import PieChart from "../src/PieChart";
import LineChartCommits from "../src/LineChartCommits";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null
    };
  }
}));
describe("home", () => {
    let input;
    test("test input ", () => {
       render(<Home />);
      input = screen.getAllByPlaceholderText("Enter GitHub repo link");
      const data = "https://github.com/ed239/GitScanner"; 
      fireEvent.change(input[0],{ target: { value: data } });
      // 断言输入框的值是否更新
      expect(input[0].value).toBe(data); 
    }); 
    test("test Add Link button", () => {
      render(<Home />); 
      const AddLinkBut = screen.getByText("Add Link");  
      expect(AddLinkBut).toBeInTheDocument();
      fireEvent.click(AddLinkBut);
      const input = screen.getAllByPlaceholderText("Enter GitHub repo link"); 
      expect(input.length).toBe(2); 
    }); 
    test("test Submit",async  () => {
       
      const {getByText } = render(<Home />); 
      const SubmitBut = screen.getByText("Submit");  
      expect(SubmitBut).toBeInTheDocument();
      fireEvent.click(SubmitBut); 
      // const NumberofCommits = await getByText("Number of Commits");
      // expect(NumberofCommits).toBeInTheDocument();
      // const LanguagesTools = await getByText("Languages & Tools");
      // expect(LanguagesTools).toBeInTheDocument();
      // const ContributorCommits = await getByText("Contributor Commits");
      // expect(ContributorCommits).toBeInTheDocument();
      // const ContributorPullRequests = await getByText("Contributor Pull Requests");
      // expect(ContributorPullRequests).toBeInTheDocument();
      // const CommitsOverTime = await getByText("Commits Over Time");
      // expect(CommitsOverTime).toBeInTheDocument();
      // const PullsOverTime = await getByText("Pulls Over Time");
      // expect(PullsOverTime).toBeInTheDocument();
    }); 
     
});
// describe("PieChart 页面测试", () => {
//   let input;
//   test("测试 ", () => {
    
//      const contributors =[
//       {
//           "login": "ed239",
//           "id": 55884703,
//           "node_id": "MDQ6VXNlcjU1ODg0NzAz",
//           "avatar_url": "https://avatars.githubusercontent.com/u/55884703?v=4",
//           "gravatar_id": "",
//           "url": "https://api.github.com/users/ed239",
//           "html_url": "https://github.com/ed239",
//           "followers_url": "https://api.github.com/users/ed239/followers",
//           "following_url": "https://api.github.com/users/ed239/following{/other_user}",
//           "gists_url": "https://api.github.com/users/ed239/gists{/gist_id}",
//           "starred_url": "https://api.github.com/users/ed239/starred{/owner}{/repo}",
//           "subscriptions_url": "https://api.github.com/users/ed239/subscriptions",
//           "organizations_url": "https://api.github.com/users/ed239/orgs",
//           "repos_url": "https://api.github.com/users/ed239/repos",
//           "events_url": "https://api.github.com/users/ed239/events{/privacy}",
//           "received_events_url": "https://api.github.com/users/ed239/received_events",
//           "type": "User",
//           "site_admin": false,
//           "contributions": 51
//       }
//   ];
//     const pullRequestsByContributor={
//       "ed239": 21,
//       "emilyproctor": 2,
//       "chensta98": 2
//   };
//   render(<PieChart contributors={contributors} type="pr" pullRequestsByContributor={pullRequestsByContributor}  />);
   
//   });  
// });
