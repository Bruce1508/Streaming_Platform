"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

interface User {
	_id: string;
	fullName: string;
	profilePic: string;
	bio: string;
	nativeLanguage: string;
	learningLanguage: string;
	location: string;
}

interface Friend extends User { }

interface FriendRequest {
	_id: string;
	recipient: User;
	sender: User;
	status: string;
}

export default function HomePage() {
	const { user } = useAuth();

	// State management
	const [friends, setFriends] = useState<Friend[]>([]);
	const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
	const [outgoingFriendReqs, setOutgoingFriendReqs] = useState<FriendRequest[]>(
		[]
	);
	const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(
		new Set<string>()
	);

	// Loading states
	const [loadingFriends, setLoadingFriends] = useState(true);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [loadingOutgoing, setLoadingOutgoing] = useState(true);
	const [sendingRequest, setSendingRequest] = useState<string | null>(null);

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

	return <div>HomePage</div>;
}
