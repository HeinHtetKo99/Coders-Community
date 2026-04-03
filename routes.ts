const Routes = {
  Home: "/",
  Login: "/login",
  Register: "/register",
  questions: "/questions",
  question_details: (id: string) => "/questions/" + id,
  question_edit: (id: string) => "/questions/" + id + "/edit",
  community: "/community",
  techNews: "/tech-news",
  CreateThreads: "/questions/create",
  tags: "/tags",
  bookmarks: "/bookmarks",
  userProfile: (id: string) => "/profile/" + id,
};

export default Routes;
