'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { UsersIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import FriendCard from "@/components/ui/FriendCard";
import NoFriendsFound from "@/components/ui/NoFriendFound";
import { useFriend } from "@/hooks/useFriend";

export default function HomePage() {
	const { user } = useAuth();

	console.log("🏠 HomePage component loaded!");

	const {
		friends,
		friendRequests,
		loading: loadingFriends,
		acceptFriendRequest,
		declineFriendRequest,
	} = useFriend();

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<div className="container mx-auto space-y-10">
				{/* Welcome Section */}
				<div className="text-center py-8">
					<h1 className="text-4xl font-bold mb-4">
						Welcome back, {user?.fullName || 'Learner'} 
					</h1>
					<p className="text-lg text-base-content/70">
						Ready to continue your language learning journey?
					</p>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<div className="stat bg-base-200 rounded-box">
						<div className="stat-title">Total Friends</div>
						<div className="stat-value">{friends.length}</div>
						<div className="stat-desc">Language partners</div>
					</div>
					
					<div className="stat bg-base-200 rounded-box">
						<div className="stat-title">Friend Requests</div>
						<div className="stat-value">{friendRequests.length}</div>
						<div className="stat-desc">Pending requests</div>
					</div>
					
					<div className="stat bg-base-200 rounded-box">
						<div className="stat-title">Active Today</div>
						<div className="stat-value">{friends.filter(f => f.isOnline).length}</div>
						<div className="stat-desc">Friends online</div>
					</div>
				</div>

				{/* Friends Section Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
					<div className="flex gap-2">
						<Link href="/friends" className="btn btn-primary btn-sm">
							<UsersIcon className="mr-2 size-4" />
							View All Friends
						</Link>
						<Link href="/friends/add" className="btn btn-outline btn-sm">
							Find New Friends
						</Link>
					</div>
				</div>

				{/* Friend Requests Alert */}
				{friendRequests.length > 0 && (
					<div className="alert alert-info">
						<UsersIcon className="w-5 h-5" />
						<span>You have {friendRequests.length} pending friend request(s)</span>
						<Link href="/friends" className="btn btn-sm">
							View Requests
						</Link>
					</div>
				)}

				{/* Friends List */}
				{loadingFriends ? (
					<div className="flex justify-center py-12">
						<span className="loading loading-spinner loading-lg" />
					</div>
				) : friends.length === 0 ? (
					<NoFriendsFound />
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{friends.slice(0, 8).map((friend) => (
							<FriendCard key={friend._id} friend={friend} />
						))}
					</div>
				)}

				{/* Show More Button */}
				{friends.length > 8 && (
					<div className="text-center">
						<Link href="/friends" className="btn btn-outline">
							Show All {friends.length} Friends
						</Link>
					</div>
				)}

				{/* Quick Actions */}
				<div className="mt-10">
					<h3 className="text-xl font-bold mb-4">Quick Actions</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<Link href="/lessons" className="card bg-primary text-primary-content hover:shadow-lg transition-shadow">
							<div className="card-body items-center text-center">
								<h4 className="card-title">Continue Learning</h4>
								<p>Resume your lessons</p>
							</div>
						</Link>
						
						<Link href="/friends/add" className="card bg-secondary text-secondary-content hover:shadow-lg transition-shadow">
							<div className="card-body items-center text-center">
								<h4 className="card-title">Find Partners</h4>
								<p>Connect with learners</p>
							</div>
						</Link>
						
						<Link href="/chat" className="card bg-accent text-accent-content hover:shadow-lg transition-shadow">
							<div className="card-body items-center text-center">
								<h4 className="card-title">Start Chatting</h4>
								<p>Practice with friends</p>
							</div>
						</Link>
						
						<Link href="/profile" className="card bg-base-200 hover:shadow-lg transition-shadow">
							<div className="card-body items-center text-center">
								<h4 className="card-title">Your Profile</h4>
								<p>Update your info</p>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}