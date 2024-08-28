import { Toaster } from "@/components/ui/toaster";
import React from "react";

interface AuthLayout {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayout) => {
	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-screen items-center justify-center">
				<div>Logo</div>
				<div>
					{children}
					<Toaster />
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
