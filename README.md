# Sistema Backend de Turnos y Reservas

API REST construida con Node.js + Express + FileSystem para gestionar servicios y reservas con persistencia en archivos JSON.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

La API estará disponible en `http://localhost:8080` por defecto.

## Arquitectura

Las solicitudes siguen este flujo: `router → controller → service → repository → DAO`.

- `src/routes/` declara los métodos HTTP, paths y controladores asociados.
- `src/controllers/` adapta `req`/`res`, define los códigos HTTP y delega en los services.
- `src/services/` contiene validaciones y reglas de negocio; recibe repositories por inyección.
- `src/repositories/` ofrece operaciones de acceso a servicios y reservas sin exponer el formato de almacenamiento a la lógica de negocio.
- `src/dao/` encapsula la lectura y escritura de colecciones JSON mediante `JsonFileDao`.
- `src/container.js` conecta el DAO JSON, los repositories y los services.
- `src/data/` contiene los archivos `services.json` y `bookings.json`.

Para cambiar el almacenamiento, se puede sustituir la implementación de persistencia y su ensamblado en `src/container.js`; los services continúan trabajando con los repositories.

## Endpoints

### Servicios

- `GET /api/services` — devuelve todos los servicios
- `GET /api/services/:sid` — devuelve un servicio por id
- `POST /api/services` — crea un servicio
- `PUT /api/services/:sid` — actualiza un servicio
- `DELETE /api/services/:sid` — elimina un servicio

### Reservas

- `POST /api/bookings` — crea una reserva
- `GET /api/bookings/:bid` — devuelve una reserva por id
- `POST /api/bookings/:bid/services/:sid` — agrega un servicio a la reserva

## Verificación rápida

Con el servidor iniciado, estos comandos consultan datos sin modificarlos:

```bash
curl http://localhost:8080/api/services
curl http://localhost:8080/api/services/1
curl http://localhost:8080/api/bookings/1
```

## Persistencia

La implementación actual guarda la información en archivos JSON dentro de `src/data/`, a través de `JsonFileDao` y los repositories.

## Ejemplo de creación de servicio

```bash
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corte de pelo",
    "description": "Servicio de peluquería",
    "duration": 60,
    "price": 2500,
    "category": "estética",
    "available": true
  }'
```
