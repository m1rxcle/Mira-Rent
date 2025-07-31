import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Footer from "../components/footer"
describe("Footer component", () => {
	it("renders footer component", () => {
		render(<Footer />)

		const component = screen.getByTestId("footer")

		expect(component).toBeInTheDocument()
	})
})
