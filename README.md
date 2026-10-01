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

El puerto puede configurarse mediante la variable `PORT`. El archivo `.env.example` contiene el valor de referencia; si se crea un `.env` local, debe mantenerse fuera del repositorio.

## Organización

- `src/routes/` define los endpoints y los conecta con sus controllers.
- `src/controllers/` procesa requests, valida los datos de entrada y construye las respuestas HTTP.
- `src/managers/` contiene la lógica de persistencia en archivos JSON.
- `src/data/` almacena los servicios y las reservas.
- `src/config/` carga y valida la configuración del entorno.

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

No existe `GET /api/bookings` para listar todas las reservas; para consultar una, se debe indicar su `bid`.

## Persistencia

La información se guarda en archivos JSON dentro de la carpeta `data`.

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
