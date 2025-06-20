module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [2, "always", ["feat", "fix", "minor", "major", "docs", "perf", "style", "chore", "test", "build", "ci", "refactor"]],
	},
}
