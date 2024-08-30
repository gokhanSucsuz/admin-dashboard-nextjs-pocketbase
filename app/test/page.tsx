"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pb } from "@/lib/pocketbase";
import React, { useEffect, useState } from "react";

interface ProductProps {
	id: string;
	title: string;
	price: number;
	active: boolean;
}

const TestPage = () => {
	const [products, setProducts] = useState<ProductProps[]>([]);
	const [newTitles, setNewTitles] = useState<Record<string, string>>({});

	const fetchProduct = async () => {
		try {
			const records = await pb
				.collection("products")
				.getFullList<ProductProps>({
					sort: "-created"
				});
			setProducts(records);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	useEffect(() => {
		fetchProduct();
	}, []);

	const deleteProduct = async (id: string) => {
		try {
			await pb.collection("products").delete(id);
			setProducts(products.filter(product => product.id !== id));
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	};

	const updateProduct = async (id: string) => {
		const newTitle = newTitles[id];
		if (!newTitle) return;

		try {
			await pb.collection("products").update(id, { title: newTitle });
			setProducts(
				products.map(
					product =>
						product.id === id ? { ...product, title: newTitle } : product
				)
			);
			setNewTitles(prev => ({ ...prev, [id]: "" }));
		} catch (error) {
			console.error("Error updating product:", error);
		}
	};

	const handleInputChange = (id: string, value: string) => {
		setNewTitles(prev => ({ ...prev, [id]: value }));
	};

	return (
		<div>
			{products.map(product =>
				<div
					key={product.id}
					className="flex space-x-3 justify-start items-center p-4"
				>
					<div>
						{product.title}
					</div>
					<div>
						<Input
							type="text"
							value={newTitles[product.id] || ""}
							onChange={e => handleInputChange(product.id, e.target.value)}
						/>
					</div>
					<Button variant={"default"} onClick={() => updateProduct(product.id)}>
						Update
					</Button>
					<Button
						variant={"destructive"}
						onClick={() => deleteProduct(product.id)}
					>
						Delete
					</Button>
				</div>
			)}
		</div>
	);
};

export default TestPage;
