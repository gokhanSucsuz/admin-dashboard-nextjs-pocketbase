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
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
	.object({
		username: z.string().min(2, {
			message: "Username must be at least 2 characters."
		}),
		email: z.string().email({
			message: "Please enter a valid email address."
		}),
		emailVisibility: z.boolean(),
		password: z.string().min(2, {
			message: "Password must be at least 2 characters."
		}),
		passwordConfirm: z.string().min(2, {
			message: "Password confirmation must be at least 2 characters."
		}),
		name: z.string().min(2, {
			message: "Name must be at least 2 characters."
		})
	})
	.refine(data => data.password === data.passwordConfirm, {
		message: "Passwords do not match.",
		path: ["passwordConfirm"] // error will appear under the passwordConfirm field
	});

export default function RegisterPage() {
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
			emailVisibility: true,
			password: "",
			passwordConfirm: "",
			name: ""
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const data = {
				username: values.username,
				email: values.email,
				emailVisibility: true,
				password: values.password,
				passwordConfirm: values.passwordConfirm,
				name: values.name
			};

			const record = await pb.collection("users").create(data);

			toast({
				title: "Success",
				description: "New record is saved!",
				variant: "success"
			});
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
					name="name"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input type="text" placeholder="name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="shadcn" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>}
				/>
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
				<FormField
					control={form.control}
					name="passwordConfirm"
					render={({ field }) =>
						<FormItem>
							<FormLabel>Password Confirm</FormLabel>
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
