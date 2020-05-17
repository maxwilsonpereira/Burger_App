import React from "react";

// Enzime allows you to render the component, in this case
// <NavigationItems /> alone
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationItems from "./NavigationItems";
import NavigationItem from "./NavigationItem/NavigationItem";

configure({ adapter: new Adapter() });

describe("<NavigationItems />", () => {
  // it() is a function that runs one single test
  // TEST 1:
  it("should render two <NavigationItem /> elements if not authenticated.", () => {
    const wrapper = shallow(<NavigationItems />);
    // Next line says: We expect to "find" 2 NavigationItem
    // Test will PASS if it finds 2 NavigationItem
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });
  // TEST 2:
  it("should render three <NavigationItem /> elements if authenticated.", () => {
    // isAuthenticated in this case is the same as "true"
    const wrapper = shallow(<NavigationItems isAuthenticated />);
    // props could also be done like this:
    // wrapper.setProps({ isAuthenticated: true });
    // Next line says: We expect to "find" 2 NavigationItem
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  // TEST 3:
    it("should an exact logout button", () => {
        const wrapper = shallow(<NavigationItems/>);
        wrapper.setProps({ isAuthenticated: true });
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
  });
});

// TO RUN: npm run test.
// In case you get a blocking error at this point,
// delete the App.test.js file and run it again.
