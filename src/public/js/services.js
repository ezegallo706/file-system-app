const socketClient = io();
const servicesList = document.querySelector("[data-services-list]");

const showEmptyState = () => {
    if (!servicesList || servicesList.children.length > 0) return;

    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No hay servicios disponibles.";
    servicesList.append(emptyState);
};

const renderService = (service) => {
    if (!servicesList || !service) return;

    const serviceId = service._id ?? service.id;
    const existingItem = servicesList.querySelector(`[data-service-id="${serviceId}"]`);
    if (!service.available) {
        existingItem?.remove();
        showEmptyState();
        return;
    }

    servicesList.querySelector(".empty-state")?.remove();

    const item = existingItem ?? document.createElement("li");
    item.className = "service-card service-item";
    item.dataset.serviceId = serviceId;

    const name = document.createElement("p");
    const nameLabel = document.createElement("strong");
    nameLabel.textContent = "Nombre:";
    name.append(nameLabel, document.createTextNode(` ${service.name}`));

    const price = document.createElement("p");
    const priceLabel = document.createElement("strong");
    priceLabel.textContent = "Precio:";
    price.append(priceLabel, document.createTextNode(` $${service.price}`));

    item.replaceChildren(name, price);
    if (!existingItem) servicesList.append(item);
};

socketClient.on("service-created", renderService);
socketClient.on("service-updated", renderService);
socketClient.on("delete-service", (service) => {
    if (!servicesList || !service) return;

    const serviceId = service._id ?? service.id;
    servicesList.querySelector(`[data-service-id="${serviceId}"]`)?.remove();
    showEmptyState();
});

showEmptyState();