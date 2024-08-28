"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { pb } from "@/lib/pocketbase";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address."
	}),
	password: z.string().min(2, {
		message: "Password must be at least 2 characters."
	})
});

export default function RegisterPage() {
	const { toast } = useToast();
	const router = useRouter();
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const authData = localStorage.getItem("pocketbase_auth");
			if (authData) {
				const { token, model } = JSON.parse(authData);
				setUser(model);
				router.push("/");
			}
		};
		fetchUser();
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "coolpisces22@gmail.com",
			password: "123456789"
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const data = {
				email: values.email,
				password: values.password
			};

			const authData = await pb
				.collection("users")
				.authWithPassword(values.email, values.password);

			toast({
				title: "Success",
				description: "New record is saved!",
				variant: "success"
			});
			router.push("/");
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong!",
				variant: "destructive"
			});
		}
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="*****" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
