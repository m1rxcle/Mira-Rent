"use client"

import { SignedOut, useAuth } from "@clerk/nextjs"
import { Button } from "../../ui/button"
import Link from "next/link"

const ReadyToFind = () => {
	const user = useAuth()
	return (
		<div className="container mx-auto px-4 text-center">
			<h2 className="text-3xl font-bold  mb-4">Ready to Find Your Dream Car?</h2>
			<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
				Join thousands of satisfied customers and start your car rental adventure today. We&apos;re here to help you find the perfect car for your
				next adventure.
			</p>
			<div className="flex flex-col sm:flex-row justify-center gap-4">
				{user.isSignedIn ? (
					<Button size="lg" variant="secondary" asChild>
						<Link href="/cars">View All Cars</Link>
					</Button>
				) : (
					<SignedOut>
						<Button size="lg" asChild>
							<Link href="/sign-up">Sign Up Now</Link>
						</Button>
					</SignedOut>
				)}
			</div>
		</div>
	)
}
export default ReadyToFind
