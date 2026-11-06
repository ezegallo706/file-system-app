# Sistema de turnos y reservas

API REST y vistas web construidas con Node.js, Express, MongoDB, Mongoose y Socket.IO. Los servicios y las reservas se persisten en MongoDB; `src/data` y los managers de FileSystem son código legado y no participan en el flujo activo.

## Requisitos

- Node.js 20.19 o superior
- npm
- MongoDB local o una instancia MongoDB Atlas accesible desde la máquina

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

Para MongoDB local, la configuración de ejemplo apunta a `mongodb://127.0.0.1:27017/file-system-app`. Para Atlas, reemplazá el valor por la URI del cluster y verificá la lista de acceso de red. Si la contraseña contiene caracteres especiales, codificalos para URL.

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

- `http://localhost:8080/services` — listado de servicios; actualiza altas y bajas en vivo.
- `http://localhost:8080/bookings` — crear reservas, consultarlas por ID y agregar servicios.

## API

Todas las respuestas exitosas usan `{ "status": "success", "payload": ... }`; los errores incluyen `status: "error"` y un mensaje.

### Servicios

- `GET /api/services` — lista servicios.
- `GET /api/services/:sid` — consulta un servicio.
- `POST /api/services` — crea un servicio.
- `PUT /api/services/:sid` — actualiza un servicio.
- `DELETE /api/services/:sid` — elimina un servicio.

### Reservas

- `POST /api/bookings` — crea una reserva. `clientName` y `clientEmail` son obligatorios; `date` y `time` son opcionales.
- `GET /api/bookings/:bid` — consulta una reserva y sus servicios asociados.
- `POST /api/bookings/:bid/services/:sid` — asocia un servicio. El body puede incluir `{"quantity": 2}`; si se omite, la cantidad es `1`. Si el servicio ya estaba asociado, se acumula la cantidad.

## Probar Socket.IO

La vista `/services` carga el cliente de Socket.IO y escucha `service-created` y `delete-service`. Para comprobarlo manualmente:

1. Abrí `/services` en dos pestañas del mismo servidor.
2. Creá un servicio con `POST /api/services` usando Postman o curl; el servicio debe aparecer en ambas listas sin recargar.
3. Tomá el `_id` del `payload` y enviá `DELETE /api/services/:sid`; el servicio debe desaparecer de las dos listas.

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

## Pruebas

```bash
npm test
```

La suite usa el runner incorporado `node:test` y levanta la aplicación HTTP en un puerto efímero. Prueba creación/consulta de reservas, asociación y acumulación de servicios, validaciones y emisión de los eventos de alta/baja. Las rutas y controladores son los reales; los métodos de Mongoose se reemplazan por dobles durante cada test, por lo que la suite no requiere MongoDB ni modifica datos persistidos.
