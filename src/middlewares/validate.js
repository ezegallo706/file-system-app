import { z } from "zod";

const serviceFields = {
	name: z.string().trim().min(1, "El nombre es obligatorio"),
	description: z.string().trim().min(1, "La descripción es obligatoria"),
	duration: z.coerce.number().int().positive("La duración debe ser mayor a cero"),
	price: z.coerce.number().nonnegative("El precio no puede ser negativo"),
	category: z.string().trim().min(1, "La categoría es obligatoria"),
	available: z.boolean().optional()
};

export const createServiceSchema = z.object(serviceFields);
export const updateServiceSchema = z.object(serviceFields)
	.partial()
	.refine((data) => Object.keys(data).length > 0, "Debe enviar al menos un campo para actualizar");

export const servicesQuerySchema = z.object({
	category: z.string().trim().min(1).optional(),
	search: z.string().trim().min(1).optional(),
	available: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
	minPrice: z.coerce.number().nonnegative().optional(),
	maxPrice: z.coerce.number().nonnegative().optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	sortBy: z.enum(["name", "price", "duration", "category", "available", "createdAt"]).default("createdAt"),
	order: z.enum(["asc", "desc"]).default("asc")
}).refine(
	({ minPrice, maxPrice }) => minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice,
	{ message: "minPrice no puede ser mayor que maxPrice", path: ["minPrice"] }
);

export const createBookingSchema = z.object({
	clientName: z.string().trim().min(1, "El nombre del cliente es obligatorio"),
	clientEmail: z.string().trim().email("El email del cliente no es válido"),
	date: z.coerce.date().optional(),
	time: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora debe tener formato HH:mm").optional(),
	status: z.enum(["pending", "confirmed", "cancelled"]).optional()
});

export const addServiceToBookingSchema = z.object({
	quantity: z.coerce.number().int().min(1, "La cantidad debe ser un entero mayor a cero").default(1)
});

export const bookingsQuerySchema = z.object({
	status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10)
});

export const validateBody = (schema) => (req, res, next) => {
	const result = schema.safeParse(req.body);
	if (!result.success) {
		return res.status(400).json({
			status: "error",
			message: result.error.issues.map((issue) => issue.message).join("; ")
		});
	}

	req.body = result.data;
	return next();
};

const validateQuery = (schema, localName) => (req, res, next) => {
	const result = schema.safeParse(req.query);
	if (!result.success) {
		return res.status(400).json({
			status: "error",
			message: result.error.issues.map((issue) => issue.message).join("; ")
		});
	}

	res.locals[localName] = result.data;
	return next();
};

export const validateServicesQuery = validateQuery(servicesQuerySchema, "servicesQuery");
export const validateBookingsQuery = validateQuery(bookingsQuerySchema, "bookingsQuery");

export const validateObjectIdParams = (...paramNames) => (req, res, next) => {
	const invalidParam = paramNames.find((paramName) => !/^[a-f\d]{24}$/i.test(req.params[paramName] ?? ""));
	if (invalidParam) {
		return res.status(400).json({
			status: "error",
			message: `El parámetro ${invalidParam} debe ser un ObjectId válido`
		});
	}

	return next();
};