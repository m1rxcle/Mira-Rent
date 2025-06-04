import { z } from "zod"

export const testDriveSchema = z.object({
	date: z
		.date({
			required_error: "Please select a date for your test drive",
		})
		.optional(),
	timeSlot: z.string({
		required_error: "Please select a time slot for your test drive",
	}),
	notes: z.string().optional(),
})

export type TTestDrive = z.infer<typeof testDriveSchema>
