# Sistema Backend de Turnos y Reservas

API REST construida con Node.js + Express + FileSystem para gestionar servicios y reservas con persistencia en archivos JSON.

## Arquitectura

Las rutas solo enlazan método y URL con controllers. Los controllers reciben `req`/`res`, llaman a los services y forman la respuesta HTTP. Los services contienen validaciones y reglas del sistema; los repositories abstraen el acceso a datos; los DAOs encapsulan la lectura y escritura JSON a través de `JsonFileDAO`.

```text
routes -> controllers -> services -> repositories -> DAOs -> JSON
```

Los datos siguen guardándose en `src/data/services.json` y `src/data/bookings.json`. Para migrar a otra persistencia se reemplaza el DAO, sin mover las reglas de negocio ni el contrato HTTP.

### Estructura relevante

```text
src/
  controllers/     # Adaptación entre HTTP y services
  services/        # Validaciones y reglas de negocio
  repositories/    # Abstracción sobre los DAOs
  dao/             # Operaciones JSON
  data/            # Archivos de persistencia
  routes/          # Declaración y montaje de endpoints
test/              # Pruebas smoke HTTP
```

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

## Pruebas

```bash
npm test
```

Las pruebas levantan Express en un puerto efímero y verifican que `GET /api/services` responda `200` con una lista JSON, además del rechazo de un payload inválido. No modifican los archivos de datos.

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
