# Prompt: Crear una Unidad Completa (12 Bloques + 2 Prácticas)

**Uso**: Pídeme este prompt cuando quieras crear una unidad dentro de un curso existente o nuevo.

---

## Instrucciones

Necesito que crees una unidad completa con 12 bloques + 2 prácticas guiadas.

### Información General
- **Curso**: [Ej: SQL Básico]
- **ID de Unidad**: [Ej: u1, u2, u3]
- **Título de Unidad**: [Ej: "Fundamentos de consultas"]
- **Resumen**: [1 línea descriptiva]
- **Lenguaje**: [sql, java, python, etc.]

### Tema de la Unidad
Describe qué cubrirá esta unidad. Ej:
> "SQL Avanzado: aprenderás JOINs complejos, subconsultas, vistas, triggers y optimización."

### Bloques Específicos (12 bloques)

Proporciona el título de cada bloque. Yo expandiré con explicación, ejemplo y pregunta.

**Bloques 1-6 (Fundamentos)**:
1. [Título]
2. [Título]
3. [Título]
4. [Título]
5. [Título]
6. [Título]

**Práctica 1 (Checkpoint)**:
- [Descripción breve del ejercicio]

**Bloques 7-12 (Avanzado)**:
7. [Título]
8. [Título]
9. [Título]
10. [Título]
11. [Título]
12. [Título]

**Práctica 2 (Final Boss)**:
- [Descripción breve del ejercicio integrando todo]

### Formato de Salida
JSON válido con estructura:
```json
{
  "id": "u1",
  "title": "...",
  "summary": "...",
  "items": [
    { "type": "block", "id": "b1", ... },
    ...
    { "type": "practice", "id": "p1", ... },
    ...
    { "type": "practice", "id": "p2", ... }
  ]
}
```

### Validaciones
- Exactamente 12 bloques (`b1` a `b12`)
- Exactamente 2 prácticas (`p1` antes, `p2` después)
- JSON sin errores de sintaxis
- Conceptos progresivos (fácil → difícil)
- Cada práctica es cumbre de los bloques anteriores

---

## Ejemplo Relleno (SQL Avanzado)

```
Curso: SQL Avanzado
ID de Unidad: u2
Título: Consultas complejas
Resumen: Domina JOINs, subconsultas y vistas.
Lenguaje: sql

Bloques 1-6:
1. INNER JOIN
2. LEFT JOIN
3. RIGHT JOIN & FULL OUTER JOIN
4. Self JOIN
5. Subconsultas (SELECT dentro de SELECT)
6. IN, EXISTS, NOT EXISTS

Práctica 1:
Escribe un query que combine 3 tablas con INNER JOIN y filtra con WHERE.

Bloques 7-12:
7. Vistas (CREATE VIEW)
8. Índices para performance
9. Transacciones (BEGIN, COMMIT, ROLLBACK)
10. Stored procedures
11. Triggers básicos
12. Optimización y mejores prácticas

Práctica 2:
Escribe una vista que combine múltiples tablas, agrega datos y filtra por rango de fechas.
```

**Responde con el JSON completo**, listo para insertar en el curso.
