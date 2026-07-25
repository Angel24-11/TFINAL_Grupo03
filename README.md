# TFINAL_Grupo03
# TFINAL — Sistema de Gestión de Reservas de Hoteles (Frontend)

Aplicación web frontend desarrollada en **React + Vite** que consume los
servicios REST del backend FastAPI construido en la Tarea T02.03.

**Backend:** https://github.com/Angel24-11/T02_03_Grupo3.git

## Integrantes — Grupo 03

| Integrante | Módulos asignados |
|---|---|
| Chancay Rodriguez Oscar Emilio | Usuarios, Clientes y Habitaciones (RF01–RF05) |
| López Ortiz Karen Koraima | Reservas, Check-in y Check-out (RF06–RF09) |
| Zambrano Infante Angel Alejandro | Facturación, Pagos, Contabilidad y Reportes (RF10–RF15) |

## Requerimientos cubiertos

El frontend implementa interfaces para los 15 requerimientos funcionales
definidos en el SRS (T02.01) y expuestos por la API (T02.03):

- **RF01:** Gestión de usuarios y perfiles de acceso
- **RF02–RF03:** Registro de clientes e historial de reservas
- **RF04–RF05:** Registro de habitaciones y consulta de disponibilidad
- **RF06–RF09:** Ciclo de reserva: creación, check-in y check-out
- **RF10–RF12:** Emisión de facturas, registro de pagos y diario contable
- **RF13–RF15:** Reportes de libro diario, huéspedes y ocupación

## Diseño

Arquitectura cliente-servidor: el frontend (SPA en React) se comunica por
HTTP/JSON con la API REST (FastAPI, puerto 8000), que sigue la estructura
Modelo → Repositorio → Servicio → Controlador documentada en el DDS.
