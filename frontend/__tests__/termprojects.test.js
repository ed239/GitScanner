import { render, screen,fireEvent } from "@testing-library/react";
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import TermProjects from "../src/pages/termProjects";

 
describe("TermProjects", () => {
    let input;
    test(" TermProjects ", () => {
        const sheetdatas=[['name','1','https://www.baidu.com/']];
        render(<TermProjects sheetdata={sheetdatas} />); 
        sheetdatas.forEach((item) => {
          expect(screen.getByText(item[0])).toBeInTheDocument(); // 确保每个数据项都在文档中存在
          expect(screen.getByText(item[1])).toBeInTheDocument(); // 确保每个数据项都在文档中存在
          expect(screen.getByText(item[2])).toBeInTheDocument(); // 确保每个数据项都在文档中存在
        });
    }); 
    test(" TermProjects Copy Link", () => {
      const sheetdatas=[['name','1','https://www.baidu.com/']];
      render(<TermProjects sheetdata={sheetdatas} />); 
      const CopyLinkBut = screen.getByText("Copy Link"); 
      expect(CopyLinkBut).toBeInTheDocument();
      //fireEvent.click(CopyLinkBut);
  }); 
});
