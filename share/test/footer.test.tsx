import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Footer from "../components/footer"
describe("Footer component", () => {
	it("renders footer component", () => {
		render(<Footer />)

		const component = screen.getByTestId("footer")

		expect(component).toBeInTheDocument()
	})

	it("contains navigation links", () => {
		render(<Footer />)

		const homeLink = screen.getByRole("link", { name: "Главная" }) as HTMLAnchorElement
		expect(homeLink.href).toContain("/")

		const carsLink = screen.getByRole("link", { name: "Автомобили" }) as HTMLAnchorElement
		expect(carsLink.href).toContain("/cars")

		const testDrivesLink = screen.getByRole("link", { name: "Бронирование" }) as HTMLAnchorElement
		expect(testDrivesLink.href).toContain("/reservations")

		const savedCars = screen.getByRole("link", { name: "Избранные" }) as HTMLAnchorElement
		expect(savedCars.href).toContain("/saved-cars")

		const vkLink = screen.getByRole("link", { name: "vk" }) as HTMLAnchorElement
		expect(vkLink.href).toContain("https://m.vk.com/noonebesidesu")

		const telegramLink = screen.getByRole("link", { name: "telegram" }) as HTMLAnchorElement
		expect(telegramLink.href).toContain("https://web.telegram.org/a/")

		const instagramLink = screen.getByRole("link", { name: "instagram" }) as HTMLAnchorElement
		expect(instagramLink.href).toContain("#")

		const gitHubLink = screen.getByRole("link", { name: "m1rxcle" }) as HTMLAnchorElement
		expect(gitHubLink.href).toContain("https://github.com/m1rxcle/Mira-Rent")

		const mailLink = screen.getByRole("link", { name: "noonebesideu@gmail.com" }) as HTMLAnchorElement
		expect(mailLink.href).toContain("mailto:noonebesideu@gmail.com")
	})
})
