const socket = io();

socket.on("service-created", (service) => {
    const servicesList = document.querySelector("[data-services-list]");
    if (!servicesList) return;

    servicesList.querySelector(".empty-state")?.remove();

    const item = document.createElement("li");
    item.className = "service-item";
    item.dataset.serviceId = service.id;

    const name = document.createElement("h2");
    name.textContent = service.name;
    item.append(name);

    [
        service.description,
        `Duracion: ${service.duration} minutos`,
        `Precio: $${service.price}`,
        `Categoria: ${service.category}`,
        `Disponibilidad: ${service.available ? "Disponible" : "No disponible"}`,
    ].forEach((detail) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = detail;
        item.append(paragraph);
    });

    servicesList.append(item);
});