import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Loading from "./components/Loading";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const Posts = lazy(() => import("./pages/Posts"));
const Post = lazy(() => import("./pages/Post"));
const Profile = lazy(() => import("./pages/Profile"));
const CreatePost = lazy(() => import("./pages/CreatePost"));

const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const PublicRoute = lazy(() => import("./components/PublicRoute"));

const publicRoutes = [
  {
    id: 1,
    path: "/login",
    element: <Login />,
  },
  {
    id: 2,
    path: "/register",
    element: <Register />,
  },
  {
    id: 3,
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    id: 4,
    path: "/verify-otp",
    element: <VerifyOTP />,
  },
  {
    id: 5,
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
];

const protectedRoutes = [
  {
    id: 1,
    path: "/profile",
    element: <Profile />,
  },
  {
    id: 2,
    path: "/posts",
    element: <Posts />,
  },
  {
    id: 3,
    path: "/posts/:id",
    element: <Post />,
  },
  {
    id: 4,
    path: "/posts/create",
    element: <CreatePost />,
  },
];

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<PublicRoute />}>
          {/* Public routes */}
          {publicRoutes.map((route) => {
            return (
              <Route key={route.id} path={route.path} element={route.element} />
            );
          })}
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map((route) => {
            return (
              <Route key={route.id} path={route.path} element={route.element} />
            );
          })}
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
