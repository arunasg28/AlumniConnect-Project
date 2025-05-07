
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
	const location = useLocation();

	return (
		<div
			className="min-h-screen bg-no-repeat bg-cover bg-center"
			style={{ backgroundImage: "url('/blur bg.jpg')" }}
		>
			{/* Hide Navbar on Alumni Home Page, Login, and Signup Pages */}
			{!["/", "/login", "/signup"].includes(location.pathname) && <Navbar />}

			<main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
		</div>
	);
};

export default Layout;
