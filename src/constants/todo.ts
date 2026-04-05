export const TODO_CATEGORIES = [
	"Planning",
	"Venue",
	"Catering",
	"Decoration",
	"Photography",
	"Entertainment",
	"Guest Management",
	"Transport",
] as const;

export const TODO_ALL_CATEGORY = "All" as const;

export const TODO_CATEGORY_OPTIONS = TODO_CATEGORIES.map((item) => ({
	label: item,
	value: item,
}));

export type TodoCategory = (typeof TODO_CATEGORIES)[number];
export type TodoCategoryFilter = typeof TODO_ALL_CATEGORY | TodoCategory;

export const isTodoCategory = (value: string): value is TodoCategory =>
	TODO_CATEGORIES.includes(value as TodoCategory);
