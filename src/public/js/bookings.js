const createBookingForm = document.querySelector("#create-booking-form");
const findBookingForm = document.querySelector("#find-booking-form");
const addServiceForm = document.querySelector("#add-service-form");
const bookingDetail = document.querySelector("#booking-detail");
const bookingFeedback = document.querySelector("#booking-feedback");

const setFeedback = (message, isError = false) => {
    bookingFeedback.textContent = message;
    bookingFeedback.classList.toggle("is-error", isError);
};

const request = async (url, options) => {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "No se pudo completar la operación");
    }

    return result.payload;
};

const appendDetail = (parent, label, value) => {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(value || "Sin informar"));
    parent.append(paragraph);
};

const renderBooking = (booking) => {
    bookingDetail.replaceChildren();

    const title = document.createElement("h3");
    title.textContent = `Reserva ${booking._id}`;
    bookingDetail.append(title);

    appendDetail(bookingDetail, "Cliente", booking.clientName);
    appendDetail(bookingDetail, "Email", booking.clientEmail);
    appendDetail(bookingDetail, "Fecha", booking.date ? new Date(booking.date).toLocaleDateString() : "Sin informar");
    appendDetail(bookingDetail, "Hora", booking.time);
    appendDetail(bookingDetail, "Estado", booking.status);

    const servicesTitle = document.createElement("h4");
    servicesTitle.textContent = "Servicios";
    bookingDetail.append(servicesTitle);

    if (!booking.services?.length) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Todavía no hay servicios asociados.";
        bookingDetail.append(emptyMessage);
    } else {
        const list = document.createElement("ul");
        booking.services.forEach(({ service, quantity }) => {
            const item = document.createElement("li");
            const serviceName = service?.name || "Servicio no disponible";
            item.textContent = `${serviceName} (cantidad: ${quantity})`;
            list.append(item);
        });
        bookingDetail.append(list);
    }

    findBookingForm.elements.bookingId.value = booking._id;
    addServiceForm.elements.bookingId.value = booking._id;
};

createBookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(createBookingForm);
    const bookingData = Object.fromEntries(formData.entries());

    if (!bookingData.date) delete bookingData.date;
    if (!bookingData.time) delete bookingData.time;

    try {
        const booking = await request("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });
        renderBooking(booking);
        createBookingForm.reset();
        setFeedback("Reserva creada correctamente.");
    } catch (error) {
        setFeedback(error.message, true);
    }
});

findBookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const bookingId = findBookingForm.elements.bookingId.value.trim();

    try {
        const booking = await request(`/api/bookings/${encodeURIComponent(bookingId)}`);
        renderBooking(booking);
        setFeedback("Reserva encontrada.");
    } catch (error) {
        setFeedback(error.message, true);
    }
});

addServiceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(addServiceForm);
    const bookingId = formData.get("bookingId").trim();
    const serviceId = formData.get("serviceId");

    try {
        const booking = await request(
            `/api/bookings/${encodeURIComponent(bookingId)}/services/${encodeURIComponent(serviceId)}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: Number(formData.get("quantity")) })
            }
        );
        renderBooking(booking);
        setFeedback("Servicio agregado a la reserva.");
    } catch (error) {
        setFeedback(error.message, true);
    }
});