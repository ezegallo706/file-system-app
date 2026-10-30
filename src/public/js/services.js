const socketClient = io();

socketClient.on("delete-service", (service) => {
    console.log(service);
    alert(`el servicio de ${service.name} ha sido eliminado`)
})