import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserPlus } from "lucide-react";
import FriendRequest from "../components/FriendRequest";
import RecommendedUser from "../components/RecommendedUser";

const NetworkPage = () => {
	const { data: recommendedUsers } = useQuery({
		queryKey: ["recommendedUsers"],
		queryFn: async () => {
			const res = await axiosInstance.get("/users/suggestions");
			return res.data;
		},
	});

	const { data: user } = useQuery({ queryKey: ["authUser"] });

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: () => axiosInstance.get("/connections/requests"),
	});

	const { data: connections } = useQuery({
		queryKey: ["connections"],
		queryFn: () => axiosInstance.get("/connections"),
	});

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			{/* Sidebar */}
			<div className='col-span-1 lg:col-span-1 lg:block lg:visible hidden'>
				<Sidebar user={user} />
			</div>

			{/* Main content */}
			<div className='col-span-1 lg:col-span-3'>
				<div className='bg-secondary rounded-lg shadow p-6 mb-6'>
					<h1 className='text-2xl font-bold mb-6'>My Network</h1>

					{connectionRequests?.data?.length > 0 ? (
						<div className='mb-8'>
							<h2 className='text-xl font-semibold mb-2'>Connection Request</h2>
							<div className='space-y-4'>
								{connectionRequests.data.map((request) => (
									<FriendRequest key={request.id} request={request} />
								))}
							</div>
						</div>
					) : (
						<div className='bg-white rounded-lg shadow p-6 text-center mb-6'>
							<UserPlus size={48} className='mx-auto text-gray-400 mb-4' />
							<h3 className='text-xl font-semibold mb-2'>No Connection Requests</h3>
							<p className='text-gray-600'>
								You don&apos;t have any pending connection requests at the moment.
							</p>
							<p className='text-gray-600 mt-2'>
								Explore suggested connections below to expand your network!
							</p>
						</div>
					)}
					
					{recommendedUsers?.length > 0 && (
						<div className='col-span-1 lg:col-span-1 lg:block'>
							<div className='bg-secondary rounded-lg shadow p-4'>
								<h2 className='font-semibold mb-4'>People you may know</h2>
								{recommendedUsers?.map((user) => (
									<RecommendedUser key={user._id} user={user} />
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default NetworkPage;
