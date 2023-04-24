import {Navigate} from "react-router-dom";
import ErrorPage from "../Errors/ErrorPage";

interface ProtectedRouteProps{
    children: JSX.Element
}

export default function AdminRoute({ children } : ProtectedRouteProps){
  if (sessionStorage.getItem("role") === "user") {
    return <ErrorPage code={403} error="Forbidden" text="You don't have access to this page 🔒"/>;
  }

  return children;
};
