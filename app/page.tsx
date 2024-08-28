"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const [user, setUser] = useState<any>(null);
	const router = useRouter();
	useEffect(() => {
		const fetchUser = async () => {
			const authData = localStorage.getItem("pocketbase_auth");
			if (authData) {
				const { token, model } = JSON.parse(authData);
				setUser(model);
			}
		};
		fetchUser();
	}, []);
	const handleLogout = () => {
		localStorage.removeItem("pocketbase_auth");
		setUser(null);
		router.refresh();
		router.push("/");
	};
	return (
		<div>
			{user
				? <div className="flex flex-col justify-center items-center">
						<div>
							{user.username}
						</div>
						<div>
							{user.name}
						</div>
						<div>
							{user.email}
						</div>
						<Button variant="default" onClick={handleLogout}>
							Logout
						</Button>
					</div>
				: <div>User not logged!</div>}
		</div>
	);
}
