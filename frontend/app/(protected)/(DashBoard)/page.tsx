'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, XIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
	getUserFriends,
	getRecommendedUsers,
	getOutgoingFriendReqs,
	sendFriendRequest,
	cancelFriendRequest
} from "@/lib/api";
import { capitialize } from "@/lib/utils";
import FriendCard, { getLanguageFlag } from "@/components/ui/FriendCard";
import NoFriendsFound from "@/components/ui/NoFriendFound";
import toast from "react-hot-toast";
import Image from "next/image";

interface User {
	_id: string;
	fullName: string;
	profilePic: string;
	bio: string;
	nativeLanguage: string;
	learningLanguage: string;
	location: string;
}

// interface Friend extends User { }

interface FriendRequest {
	_id: string;
	recipient: User;
	sender: User;
	status: string;
}

export default function HomePage() {
	const { user } = useAuth();

	// State management
	const [friends, setFriends] = useState<User[]>([]);
	const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
	const [outgoingFriendReqs, setOutgoingFriendReqs] = useState<FriendRequest[]>([]);
	const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set<string>());

	// Loading states
	const [loadingFriends, setLoadingFriends] = useState(true);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [loadingOutgoing, setLoadingOutgoing] = useState(true);
	const [sendingRequest, setSendingRequest] = useState<string | null>(null);
	const [cancellingRequest, setCancellingRequest] = useState<string | null>(null);

	// Fetch friends
	const fetchFriends = async () => {
		try {
			setLoadingFriends(true);
			const response = await getUserFriends();
			setFriends(response || []);
		} catch (error) {
			console.error('Error fetching friends:', error);
			toast.error('Failed to load friends');
		} finally {
			setLoadingFriends(false);
		}
	};

	// Fetch recommended users
	const fetchRecommendedUsers = async () => {
		try {
			setLoadingUsers(true);
			const response = await getRecommendedUsers();
			setRecommendedUsers(response || []);
		} catch (error) {
			console.error('Error fetching recommended users:', error);
			toast.error('Failed to load recommended users');
		} finally {
			setLoadingUsers(false);
		}
	};

	// Fetch outgoing friend requests
	const fetchOutgoingRequests = async () => {
		try {
			setLoadingOutgoing(true);
			const response = await getOutgoingFriendReqs();
			setOutgoingFriendReqs(response || []);
		} catch (error) {
			console.error('Error fetching outgoing requests:', error);
		} finally {
			setLoadingOutgoing(false);
		}
	};

	// Send friend request
	const handleSendFriendRequest = async (userId: string) => {
		try {
			setSendingRequest(userId);
			await sendFriendRequest(userId);

			// Refresh outgoing requests to update UI
			await fetchOutgoingRequests();

			toast.success('Friend request sent!');
		} catch (error) {
			console.error('Error sending friend request:', error);
			toast.error('Failed to send friend request');
		} finally {
			setSendingRequest(null);
		}
	};

	const handleCancelFriendRequest = async (userId: string) => {
		try {
			setCancellingRequest(userId);
			await cancelFriendRequest(userId);
			// Refresh outgoing requests to update UI
			await fetchOutgoingRequests();
			toast.success('Friend request cancelled!');
		} catch (error: any) {
			console.error('Error cancelling friend request:', error);
			toast.error('Failed to cancel friend request');
		} finally {
			setCancellingRequest(null);
		}
	};

	// Update outgoing requests IDs for UI state
	useEffect(() => {
		const outgoingIds = new Set<string>();
		if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
			outgoingFriendReqs.forEach((req) => {
				outgoingIds.add(req.recipient._id);
			});
			setOutgoingRequestsIds(outgoingIds);
		}
	}, [outgoingFriendReqs]);

	// Initial data fetch
	useEffect(() => {
		if (user) {
			fetchFriends();
			fetchRecommendedUsers();
			fetchOutgoingRequests();
		}
	}, [user]);

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<div className="container mx-auto space-y-10">
				{/* Friends Section Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
					<Link href="/notifications" className="btn btn-outline btn-sm">
						<UsersIcon className="mr-2 size-4" />
						Friend Requests
					</Link>
				</div>

				{/* Friends List */}
				{loadingFriends ? (
					<div className="flex justify-center py-12">
						<span className="loading loading-spinner loading-lg" />
					</div>
				) : friends.length === 0 ? (
					<NoFriendsFound />
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{friends.map((friend) => (
							<FriendCard key={friend._id} friend={friend} />
						))}
					</div>
				)}

				{/* Recommended Users Section */}
				<section>
					<div className="mb-6 sm:mb-8">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<div>
								<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
								<p className="opacity-70">
									Discover perfect language exchange partners based on your profile
								</p>
							</div>
						</div>
					</div>

					{loadingUsers ? (
						<div className="flex justify-center py-12">
							<span className="loading loading-spinner loading-lg" />
						</div>
					) : recommendedUsers.length === 0 ? (
						<div className="card bg-base-200 p-6 text-center">
							<h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
							<p className="text-base-content opacity-70">
								Check back later for new language partners!
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{recommendedUsers.map((user) => {
								const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
								const isCurrentlySending = sendingRequest === user._id;
								const isCurrentlyCancelling = cancellingRequest === user._id;

								return (
									<div
										key={user._id}
										className="card bg-base-200 hover:shadow-lg transition-all duration-300"
									>
										<div className="card-body p-5 space-y-4">
											<div className="flex items-center gap-3">
												<div className="avatar size-16 rounded-full overflow-hidden relative w-32 h-32">
													<Image
														src={user.profilePic}
														alt={user.fullName}
														className="w-full h-full object-cover"
														fill
														sizes="64px"
													/>
												</div>

												<div>
													<h3 className="font-semibold text-lg">{user.fullName}</h3>
													{user.location && (
														<div className="flex items-center text-xs opacity-70 mt-1">
															<MapPinIcon className="size-3 mr-1" />
															{user.location}
														</div>
													)}
												</div>
											</div>

											{/* Languages with flags */}
											<div className="flex flex-wrap gap-1.5">
												<span className="badge badge-secondary">
													{getLanguageFlag(user.nativeLanguage)}
													Native: {capitialize(user.nativeLanguage)}
												</span>
												<span className="badge badge-outline">
													{getLanguageFlag(user.learningLanguage)}
													Learning: {capitialize(user.learningLanguage)}
												</span>
											</div>

											{user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

											{/* Action button */}
											{hasRequestBeenSent ? (
												// Nếu đã gửi request, hiển thị status và nút cancel
												<div className="space-y-2">
													<button
														className="btn btn-outline btn-error btn-sm w-full"
														onClick={() => handleCancelFriendRequest(user._id)}
														disabled={cancellingRequest === user._id}
													>
														{cancellingRequest === user._id ? (
															<>
																<span className="loading loading-spinner loading-xs mr-2" />
																Cancelling...
															</>
														) : (
															<>
																<XIcon className="size-4 mr-2" />
																Cancel Request
															</>
														)}
													</button>
												</div>
											) : (
												// Nếu chưa gửi request, hiển thị nút send
												<button
													className="btn btn-primary w-full mt-2"
													onClick={() => handleSendFriendRequest(user._id)}
													disabled={isCurrentlySending}
												>
													{isCurrentlySending ? (
														<>
															<span className="loading loading-spinner loading-xs mr-2" />
															Sending...
														</>
													) : (
														<>
															<UserPlusIcon className="size-4 mr-2" />
															Send Friend Request
														</>
													)}
												</button>
											)}

										</div>
									</div>
								);
							})}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}