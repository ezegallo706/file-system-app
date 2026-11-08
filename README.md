# Sistema de turnos y reservas

API REST y vistas web construidas con Node.js, Express, MongoDB, Mongoose y Socket.IO. Los servicios y las reservas se persisten en MongoDB; `src/data` y los managers de FileSystem son código legado y no participan en el flujo activo.

## Requisitos

- Node.js 20.19 o superior
- npm
- Una instancia MongoDB Atlas accesible desde la máquina

## Instalación y configuración

```bash
npm install
```

Copiá `.env.example` como `.env` y completá `MONGO_URI` con la URL de tu instancia. En PowerShell:

```powershell
Copy-Item .env.example .env
```

En macOS/Linux:

```bash
cp .env.example .env
```

Reemplazá los valores de ejemplo por la URI de tu cluster Atlas y verificá su lista de acceso de red. Si la contraseña contiene caracteres especiales, codificalos para URL.

`PORT` es opcional y por defecto vale `8080`. No compartas ni subas `.env`; el archivo está excluido por `.gitignore`.

## Levantar la aplicación

Primero asegurate de que MongoDB esté iniciado y que `MONGO_URI` sea válido. El servidor espera a que la conexión se establezca antes de empezar a escuchar.

```bash
npm start
```

Para desarrollo con reinicio automático:

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:8080` (o en el puerto indicado por `PORT`). Vistas disponibles:

- `http://localhost:8080/services` — listado de servicios; refleja altas, cambios y bajas en vivo.
- `http://localhost:8080/bookings` — crear reservas, consultarlas por ID y agregar servicios.

## API

Todas las respuestas exitosas usan `{ "status": "success", "payload": ... }`; los errores incluyen `status: "error"` y un mensaje.

### Servicios

- `GET /api/services` — lista servicios con filtros y paginación. Acepta `category`, `search` (búsqueda parcial por nombre), `available` (`true`/`false`), `minPrice`, `maxPrice`, `page`, `limit` (máximo 100), `sortBy` (`name`, `price`, `duration`, `category`, `available`, `createdAt`) y `order` (`asc`/`desc`). Los valores por defecto son página `1`, límite `10`, orden por `createdAt` ascendente.
- `GET /api/services/:sid` — consulta un servicio.
- `POST /api/services` — crea un servicio.
- `PUT /api/services/:sid` — actualiza un servicio.
- `DELETE /api/services/:sid` — elimina un servicio.

Ejemplos de consultas:

```text
GET /api/services?category=estética&available=true
GET /api/services?search=masaje&minPrice=1000&maxPrice=5000
GET /api/services?page=2&limit=5&sortBy=price&order=desc
GET /api/services?category=Spa&available=false&page=1&limit=10&sortBy=name&order=asc
```

La respuesta mantiene la lista en `payload` y agrega `pagination` con `totalResults`, `currentPage`, `limit`, `totalPages`, `hasPrevPage` y `hasNextPage`.

```json
{
  "status": "success",
  "payload": [{ "name": "Masaje", "price": 5000 }],
  "pagination": {
    "totalResults": 12,
    "currentPage": 2,
    "limit": 5,
    "totalPages": 3,
    "hasPrevPage": true,
    "hasNextPage": true
  }
}
```

Los bodies de creación y actualización de servicios se validan con Zod antes de acceder a MongoDB. La reserva valida nombre, email, fecha y hora; agregar un servicio valida que `quantity` sea un entero mayor que cero (por defecto `1`). Las consultas avanzadas también validan sus parámetros. Los datos inválidos responden `400` con un mensaje explicativo.

### Reservas

- `POST /api/bookings` — crea una reserva. `clientName` y `clientEmail` son obligatorios; `date` y `time` son opcionales.
- `GET /api/bookings` — lista reservas paginadas con sus servicios completos; admite `status`, `page` y `limit`.
- `GET /api/bookings/:bid` — consulta una reserva y sus servicios asociados con `populate`; devuelve los datos del cliente, email, fecha, hora y estado, más los servicios completos y su cantidad. En MongoDB se almacenan como referencias `{ service: ObjectId, quantity: Number }`.
- `POST /api/bookings/:bid/services/:sid` — asocia un servicio. El body puede incluir `{"quantity": 2}`; si se omite, la cantidad es `1`. Si el servicio ya estaba asociado, se acumula la cantidad.

Para consultar una reserva con los datos completos de sus servicios:

```text
GET /api/bookings/<id-de-reserva>
```

La respuesta conserva cada entrada de `services` con `quantity` y expande `service` con los datos del documento de servicio. `populate` se usa solo al consultar, no para guardar el objeto del servicio en la reserva.

## Probar Socket.IO

La vista `/services` carga el cliente de Socket.IO y escucha `service-created`, `service-updated` y `delete-service`. Para comprobarlo manualmente:

1. Abrí `/services` en dos pestañas del mismo servidor.
2. Creá un servicio con `POST /api/services` usando Postman o curl; el servicio debe aparecer en ambas listas sin recargar.
3. Actualizá el servicio con `PUT /api/services/:sid`; ambas listas deben reflejar los cambios y ocultarlo si `available` pasa a `false`.
4. Tomá el `_id` del `payload` y enviá `DELETE /api/services/:sid`; el servicio debe desaparecer de las dos listas.

Ejemplo de alta:

```bash
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corte de pelo",
    "description": "Servicio de peluquería",
    "duration": 60,
    "price": 2500,
    "category": "estética"
  }'
```

## Capas

Las rutas conectan validaciones Zod con los controladores. Los controladores delegan en servicios de negocio, que usan repositorios; los repositorios delegan en DAO y estos acceden a los modelos Mongoose. Las reservas están separadas en las mismas capas que los servicios y almacenan referencias `ObjectId` y cantidades, no documentos de servicio embebidos.
