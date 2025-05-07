import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import JobList from "./components/jobpage";
import ConnectedProfilesPage from "./components/myconnectionspg";
import AllUsersPage from "./components/userspage";
import Index from "./Indexpage";
import Chatbot from "./components/chatbot";

function App() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

	if (isLoading) return null;

	return (
		<Layout>
			<Routes>
  <Route path='/' element={<Index />} />
  <Route path='/homepage' element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
  <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/homepage"} />} />
  <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/homepage"} />} />
  <Route path='/jobs' element={authUser ? <JobList /> : <Navigate to={"/login"} />} />
  <Route path='/jobs/:jobId' element={authUser ? <JobList isOwnProfile={true} /> : <Navigate to={"/login"} />} />
  <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
  <Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
  <Route path='/connected-profiles' element={authUser ? <ConnectedProfilesPage /> : <Navigate to={"/login"} />} />
  <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
  <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
  <Route path='/userspage' element={authUser ? <AllUsersPage /> : <Navigate to={"/login"} />} />

<Route
  path="/chatbot"
  element={
    authUser?.headline === "Faculty" ? (
      <Chatbot designation={authUser.headline} />
    ) : (
      <Navigate to="/homepage" />
    )
  }
/>

</Routes>

			<Toaster />
		</Layout>
	);
}

export default App;
