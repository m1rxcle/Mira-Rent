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
	})

	it("display contact info", () => {
		render(<Footer />)

		const addressLine = screen.getByText("г. Калининград, ул. Мира, 12")
		expect(addressLine).toBeInTheDocument()

		const phoneNumber = screen.getByText("+7 (999) 123-45-67")
		expect(phoneNumber).toBeInTheDocument()

		const emailAddress = screen.getByText("noonebesideu@gmail.com")
		expect(emailAddress).toBeInTheDocument()
	})
})
