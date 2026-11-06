import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import app from "../src/app.js";
import { BookingModel } from "../src/models/booking.model.js";
import { ServiceModel } from "../src/models/services.models.js";

const bookingId = "64b000000000000000000001";
const serviceId = "64b000000000000000000002";
const socketEvents = [];
const socketServer = {
    emit(event, payload) {
        socketEvents.push({ event, payload });
    }
};

let httpServer;
let baseUrl;

before(async () => {
    app.set("socketServer", socketServer);
    httpServer = createServer(app);
    await new Promise((resolve, reject) => {
        httpServer.once("error", reject);
        httpServer.listen(0, "127.0.0.1", resolve);
    });
    baseUrl = `http://127.0.0.1:${httpServer.address().port}`;
});

after(async () => {
    const closed = new Promise((resolve, reject) => {
        httpServer.close((error) => error ? reject(error) : resolve());
    });
    httpServer.closeAllConnections();
    await closed;
});

const requestJson = async (path, { method = "GET", body } = {}) => {
    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: body === undefined ? {} : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body)
    });

    return { response, result: await response.json() };
};

const withMocks = async (replacements, callback) => {
    const originals = Object.entries(replacements).map(([target, methods]) => ({
        target,
        methods: Object.entries(methods).map(([name, implementation]) => {
            const object = target === "booking" ? BookingModel : ServiceModel;
            const original = object[name];
            object[name] = implementation;
            return { object, name, original };
        })
    }));

    try {
        await callback();
    } finally {
        originals.flatMap(({ methods }) => methods).forEach(({ object, name, original }) => {
            object[name] = original;
        });
    }
};

test("POST /api/bookings valida y crea una reserva", async () => {
    const createdBooking = {
        _id: bookingId,
        clientName: "Ana Pérez",
        clientEmail: "ana@example.com",
        status: "pending",
        services: []
    };

    await withMocks({
        booking: {
            create: async (data) => ({ ...createdBooking, ...data })
        }
    }, async () => {
        const invalid = await requestJson("/api/bookings", {
            method: "POST",
            body: { clientName: "Ana Pérez" }
        });
        assert.equal(invalid.response.status, 400);

        const created = await requestJson("/api/bookings", {
            method: "POST",
            body: { clientName: " Ana Pérez ", clientEmail: "ana@example.com" }
        });
        assert.equal(created.response.status, 201);
        assert.equal(created.result.payload.clientName, "Ana Pérez");
        assert.equal(created.result.payload.status, "pending");
    });
});

test("GET /api/bookings/:bid devuelve la reserva con servicios poblados", async () => {
    const expectedBooking = {
        _id: bookingId,
        clientName: "Ana Pérez",
        services: [{ service: { _id: serviceId, name: "Corte" }, quantity: 2 }]
    };

    await withMocks({
        booking: {
            findById: (id) => ({
                populate: async (path) => {
                    assert.equal(id, bookingId);
                    assert.equal(path, "services.service");
                    return expectedBooking;
                }
            })
        }
    }, async () => {
        const { response, result } = await requestJson(`/api/bookings/${bookingId}`);
        assert.equal(response.status, 200);
        assert.equal(result.payload.services[0].service.name, "Corte");
        assert.equal(result.payload.services[0].quantity, 2);
    });
});

test("POST /api/bookings/:bid/services/:sid acumula la cantidad existente", async () => {
    let saved = false;
    const booking = {
        _id: bookingId,
        services: [{ service: serviceId, quantity: 2 }],
        async save() {
            saved = true;
        },
        async populate() {}
    };

    await withMocks({
        booking: {
            findById: async () => booking
        },
        service: {
            findById: async () => ({ _id: serviceId, name: "Corte", available: true })
        }
    }, async () => {
        const { response, result } = await requestJson(
            `/api/bookings/${bookingId}/services/${serviceId}`,
            { method: "POST", body: { quantity: 3 } }
        );

        assert.equal(response.status, 200);
        assert.equal(saved, true);
        assert.equal(result.payload.services[0].quantity, 5);
    });
});

test("POST y DELETE de servicios emiten sus eventos Socket.IO", async () => {
    socketEvents.length = 0;
    const createdService = {
        _id: serviceId,
        name: "Corte",
        description: "Corte clásico",
        duration: 30,
        price: 2500,
        category: "Peluquería",
        available: true
    };

    await withMocks({
        service: {
            create: async (data) => ({ ...createdService, ...data }),
            findByIdAndDelete: async () => createdService
        }
    }, async () => {
        const created = await requestJson("/api/services", {
            method: "POST",
            body: createdService
        });
        assert.equal(created.response.status, 201);
        assert.equal(socketEvents[0].event, "service-created");
        assert.equal(socketEvents[0].payload._id, serviceId);

        const deleted = await requestJson(`/api/services/${serviceId}`, { method: "DELETE" });
        assert.equal(deleted.response.status, 200);
        assert.equal(socketEvents[1].event, "delete-service");
        assert.equal(socketEvents[1].payload._id, serviceId);
    });
});