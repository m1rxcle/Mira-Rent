"use client"
import React, { useEffect, useState } from "react"

function EMICalculator({ price = 1000 }) {
	const [loanAmount, setLoanAmount] = useState(price)
	const [downPayment, setDownPayment] = useState(2000)
	const [interestRate, setInterestRate] = useState(5)
	const [loanTerm, setLoanTerm] = useState(36)
	const [monthlyPayment, setMonthlyPayment] = useState(0)

	// Calculate monthly payment whenever inputs change
	useEffect(() => {
		const calculateEMI = () => {
			try {
				const principal = loanAmount - downPayment
				const monthlyRate = interestRate / 100 / 12
				const numberOfPayments = loanTerm

				if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
					const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
					setMonthlyPayment(emi)
				} else {
					setMonthlyPayment(0)
				}
			} catch (error) {
				console.error("EMI calculation error:", error)
				setMonthlyPayment(0)
			}
		}

		calculateEMI()
	}, [loanAmount, downPayment, interestRate, loanTerm])

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount)
	}

	const Slider = ({ label, value, onChange, min, max, step = 1, prefix = "", suffix = "" }) => (
		<div className="mb-6">
			<div className="flex justify-between items-center mb-2">
				<label className="text-sm font-medium text-gray-600">{label}</label>
				<span className="text-sm font-bold text-gray-800">
					{prefix}
					{typeof value === "number" ? value.toLocaleString() : value}
					{suffix}
				</span>
			</div>
			<div className="flex items-center gap-4">
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => onChange(parseFloat(e.target.value))}
					className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
				/>
				<input
					type="number"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => onChange(parseFloat(e.target.value) || min)}
					className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
	)

	const ResultCard = ({ label, value, isLarge = false }) => (
		<div className="bg-white rounded-lg p-4 shadow-sm">
			<div className="text-sm text-gray-600 mb-1">{label}</div>
			<div className={`font-bold ${isLarge ? "text-2xl text-blue-600" : "text-xl text-gray-800"}`}>{formatCurrency(value)}</div>
		</div>
	)

	return (
		<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 ">
			<div className=" ">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-lg font-bold text-gray-800 mb-2">Car Loan Calculator</h1>
					<p className="text-gray-600">Calculate your monthly car payments with our easy-to-use loan calculator</p>
				</div>

				{/* Calculator Section */}
				<div className="bg-white rounded-xl shadow-lg p-6 mb-6">
					<Slider
						label="Loan Amount"
						value={loanAmount}
						onChange={(value) => {
							setLoanAmount(value)
							if (downPayment > value) setDownPayment(value)
						}}
						min={1000}
						max={100000}
						step={1000}
						prefix="$"
					/>

					<Slider label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} max={loanAmount} step={500} prefix="$" />

					<Slider label="Interest Rate" value={interestRate} onChange={setInterestRate} min={0.1} max={20} step={0.1} suffix="%" />

					<Slider label="Loan Term" value={loanTerm} onChange={setLoanTerm} min={12} max={84} step={12} suffix=" months" />
				</div>

				{/* Results Section */}
				<div className="bg-white rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Summary</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<ResultCard label="Vehicle Price" value={loanAmount} />
						<ResultCard label="Down Payment" value={downPayment} />
						<ResultCard label="Monthly Payment" value={monthlyPayment} isLarge={true} />
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-gray-600">Total Loan Amount: </span>
								<span className="font-semibold">{formatCurrency(loanAmount - downPayment)}</span>
							</div>
							<div>
								<span className="text-gray-600">Total Interest: </span>
								<span className="font-semibold">{formatCurrency(monthlyPayment * loanTerm - (loanAmount - downPayment))}</span>
							</div>
							<div>
								<span className="text-gray-600">Total Payment: </span>
								<span className="font-semibold">{formatCurrency(monthlyPayment * loanTerm)}</span>
							</div>
							<div>
								<span className="text-gray-600">Interest Rate: </span>
								<span className="font-semibold">{interestRate}% APR</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EMICalculator
