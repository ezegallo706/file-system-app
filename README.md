# Sistema Backend de Turnos y Reservas

API REST construida con Node.js, Express y Mongoose para gestionar servicios y reservas con persistencia en MongoDB Atlas.

## Requisitos

- Node.js 18+
- npm
- Una instancia de MongoDB Atlas o MongoDB compatible

## Instalación

```bash
npm install
copy .env.example .env
```

Configura `MONGO_URI` en `.env` con la URI de conexión de tu base de datos. No compartas ni subas ese archivo al repositorio.

## Ejecución

```bash
npm start
```

La API estará disponible en `http://localhost:8080` por defecto.

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

## Persistencia

La persistencia se realiza en MongoDB mediante Mongoose. Los modelos se encuentran en `src/models`, y la conexión se inicia antes de que el servidor empiece a escuchar.

La API responde con identificadores MongoDB (`_id`). En las reservas, `services` es una lista de referencias a documentos de servicios con el formato `{ "service": "<ObjectId>", "quantity": 1 }`.

## Estructura

Las rutas delegan en controladores, servicios, repositorios y DAO. La capa DAO es la única que consulta o modifica modelos de Mongoose.

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
