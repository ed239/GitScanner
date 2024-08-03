import { render, screen,fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../src/pages/login";

describe("login", () => {
  test("login", () => {
    
    render(<Login />); 
    const loginBut = screen.getByText("Login"); 
    expect(loginBut).toBeInTheDocument();
    //fireEvent.click(loginBut);
    // const clientID = process.env.NEXT_PUBLIC_CLIENT_ID; 
    //expect(console.log).toHaveBeenCalledWith("Client ID: " + clientID);
  }); 
   
});