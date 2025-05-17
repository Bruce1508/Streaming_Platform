import AuthGuard from "@/components/AuthGuard";

export default function Home() {
	return (
		<AuthGuard>
			<main>
				<h1>HomePage</h1>
			</main>
		</AuthGuard>
	);
}