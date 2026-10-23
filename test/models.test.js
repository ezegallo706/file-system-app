const test = require("node:test");
const assert = require("node:assert/strict");
const Service = require("../src/models/service.model");
const Booking = require("../src/models/booking.model");
const Message = require("../src/models/message.model");

test("registers the required service, booking, and message models", () => {
  assert.equal(Service.modelName, "Service");
  assert.equal(Booking.modelName, "Booking");
  assert.equal(Message.modelName, "Message");
});

test("stores booking services as ObjectId references with quantity", () => {
  const serviceSchema = Booking.schema.path("services").schema;

  assert.equal(serviceSchema.path("service").instance, "ObjectId");
  assert.equal(serviceSchema.path("service").options.ref, "Service");
  assert.equal(serviceSchema.path("quantity").instance, "Number");
});

test("defines the required service fields", () => {
  for (const field of ["name", "description", "duration", "price", "category", "available"]) {
    assert.ok(Service.schema.path(field), `Missing service field: ${field}`);
  }
});