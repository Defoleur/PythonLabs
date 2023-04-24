import ErrorPage from "../Errors/ErrorPage";

interface ProtectedRouteProps{
    children: JSX.Element
}

export default function AuthorizedRoute({ children } : ProtectedRouteProps){
  if (sessionStorage.getItem("username") === null) {
    return <ErrorPage code={401} error="Not Authorized Access" text="You aren't logged in. Please login and try again! 😊"/>;
  }

  return children;
};
