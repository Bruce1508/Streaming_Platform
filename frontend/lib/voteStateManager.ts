// lib/voteStateManager.ts
// 🏗️ TRUNG TÂM QUẢN LÝ VOTE STATE

console.log('🎯 VoteStateManager - Module loading...');

interface VoteState {
    postId: string;
    voteCount: number;
    upvotes: string[];
    downvotes: string[];
    timestamp: number;
}

type VoteCallback = (state: VoteState) => void;

class VoteStateManager {
    private static instance: VoteStateManager;
    private voteStates: Map<string, VoteState> = new Map();
    private listeners: Map<string, Set<VoteCallback>> = new Map();

    private constructor() {
        console.log('🏗️ VoteStateManager - Initializing...');
        this.loadFromStorage();
        this.setupAutoCleanup();
        console.log('✅ VoteStateManager - Initialized successfully');
    }

    public static getInstance(): VoteStateManager {
        if (!VoteStateManager.instance) {
            console.log('🎯 VoteStateManager - Creating new instance...');
            VoteStateManager.instance = new VoteStateManager();
        }
        return VoteStateManager.instance;
    }

    public updateVoteState(postId: string, voteCount: number, upvotes: string[], downvotes: string[]): void {
        console.log('🔄 VoteStateManager - Updating vote state:', { postId, voteCount });

        const state: VoteState = {
            postId,
            voteCount,
            upvotes: upvotes || [],
            downvotes: downvotes || [],
            timestamp: Date.now()
        };

        this.voteStates.set(postId, state);
        console.log('💾 VoteStateManager - State saved for postId:', postId);

        this.saveToStorage();
        this.notifyListeners(postId, state);

        console.log('✅ VoteStateManager - Vote state updated successfully');
    }

    public getVoteState(postId: string): VoteState | null {
        const state = this.voteStates.get(postId);
        console.log('🔍 VoteStateManager - Getting vote state for postId:', postId, state ? 'Found' : 'Not found');
        return state || null;
    }

    public subscribe(postId: string, callback: VoteCallback): () => void {
        console.log('👂 VoteStateManager - Subscribing to postId:', postId);

        if (!this.listeners.has(postId)) {
            this.listeners.set(postId, new Set());
            console.log('📝 VoteStateManager - Created new listener set for postId:', postId);
        }

        this.listeners.get(postId)!.add(callback);
        console.log('✅ VoteStateManager - Subscribed successfully. Total listeners:', this.listeners.get(postId)!.size);

        return () => {
            console.log('🔇 VoteStateManager - Unsubscribing from postId:', postId);
            const postListeners = this.listeners.get(postId);
            if (postListeners) {
                postListeners.delete(callback);
                if (postListeners.size === 0) {
                    this.listeners.delete(postId);
                    console.log('🧹 VoteStateManager - Removed empty listener set');
                }
            }
        };
    }

    private notifyListeners(postId: string, state: VoteState): void {
        const postListeners = this.listeners.get(postId);
        if (!postListeners || postListeners.size === 0) {
            console.log('📢 VoteStateManager - No listeners to notify for postId:', postId);
            return;
        }

        console.log('📢 VoteStateManager - Notifying', postListeners.size, 'listeners for postId:', postId);

        postListeners.forEach(callback => {
            try {
                callback(state);
            } catch (error) {
                console.error('❌ VoteStateManager - Error in listener callback:', error);
            }
        });
    }

    private saveToStorage(): void {
        try {
            console.log('💾 VoteStateManager - Saving to localStorage...');
            const data = Object.fromEntries(this.voteStates);
            localStorage.setItem('voteStates', JSON.stringify(data));
            console.log('✅ VoteStateManager - Saved', this.voteStates.size, 'vote states');
        } catch (error) {
            console.error('❌ VoteStateManager - Error saving to localStorage:', error);
        }
    }

    private loadFromStorage(): void {
        try {
            console.log('📱 VoteStateManager - Loading from localStorage...');
            const data = localStorage.getItem('voteStates');
            if (data) {
                const parsed = JSON.parse(data);
                this.voteStates = new Map(Object.entries(parsed));
                console.log('✅ VoteStateManager - Loaded', this.voteStates.size, 'vote states');
            } else {
                console.log('📭 VoteStateManager - No data found in localStorage');
            }
        } catch (error) {
            console.error('❌ VoteStateManager - Error loading from localStorage:', error);
        }
    }

    private setupAutoCleanup(): void {
        console.log('⏰ VoteStateManager - Setting up auto cleanup');
        setInterval(() => {
            this.cleanup();
        }, 30 * 60 * 1000); // 30 phút
    }

    public cleanup(): void {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        let cleaned = 0;

        for (const [postId, state] of this.voteStates.entries()) {
            if (state.timestamp < oneHourAgo) {
                this.voteStates.delete(postId);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            this.saveToStorage();
            console.log('🧹 VoteStateManager - Cleaned up', cleaned, 'old states');
        }
    }
}

export const voteStateManager = VoteStateManager.getInstance();

// Cleanup khi đóng page
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        console.log('👋 VoteStateManager - Page unloading...');
        voteStateManager.cleanup();
    });
}