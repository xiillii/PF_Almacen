# API Almacén

API para entradas y salidas de productos, de un almacén

## Requrimientos Funcionales

### Usuarios

- RF01. Listado de usuarios
- RF02. Registro de usuarios
- RF03. Modificación de usuarios
- RF04. Borrado lógico de usuarios
- RF05. Autenticación de usuarios.
- RF06. Proteger métodos API de usuarios

### Almacenes

#### Categorías

- Listado de categorías
- Registro de categorías
- Modificación de categorías
- Borrado lógico de categorias

#### Productos

- Listado de productos
- Registro de productos
- Modificación de productos
- Borrado lógico de productos

#### Almacenes

- Listado de almacenes
- Registro de almacenes
- Modificación de almacenes
- Borrado lógico de almacenes
- Entrada de productos a almacén. Método PEPS
- Salida de productos de almacén. Método PEPS
- Traspaso de productos entre almacenes
- Costeo de inventarios. Método PEPS.

---

### RF01. Listado de productos

- Se debe construir el modelo de la base de datos para la entidad.
- Se debe construir un método del API para listar el registro de usuarios
- El usuario debe tener la siguiente estructura
  - Nombre completo. Nombres y apellidos.
    - Es requerido
    - Texto
  - Email.
    - Es único
    - Es requerido
    - Texto
    - Debe ser en minúsculas
    - Debe tener formato de email moderno
  - Clave
    - Es requerido
    - Texto
    - Encriptado
  - Es administrador
    - Es requerido
    - Booleano
  - Borrado
    - Es requerido
    - Booleano
    - Falso por defecto
- El listado no debe de regresar la contraseña
- El listado solo lista usuarios activos

### RF02. Registro de usuarios

- Se debe construir un método del API para crear o registrar un nuevo usuario.
- Se debe verificar que el email no exista entre los usuarios activos.
- Después de un registro exitoso, debe regresar la entidad del usuario, junto con el JWT del nuevo usuario registrado.
- La clave/contraseña debe viajar sin encriptar y ser encriptado antes de guardar

### RF03. Modificación de usuarios

- Se debe construir un método del API para modificar el registro de un usuario
- La clave/contraseña debe viajar sin encriptar y ser encriptado antes de guardar

### RF04. Borrado lógico de usuarios

- Se debe construir un método del API para eliminar lógicamente un usuario, o desactivarlo.
- No debe ser físico

### RF05. Autenticación de usuarios

- Se debe construir un método del API para autenticar un usuario
- La clave/contraseña debe viajar sin encriptar
- Después de una autenticación exitosa, debe regresar la entidad del usuario, junto con el JWT del nuevo usuario registrado.

### RF06. Proteger métodos del API de usuarios

- Se debe proteger los métodos mediante por JWT (json web token)
- Proteger los siguientes métodos
  - Listado de usuarios
  - Modificación de usuarios
  - Borrado lógico de usuarios

## Requerimientos no funcionales

- Se debe usar inglés para
  - Entidades de base de datos
  - Clases y objetos en el código
  - Adjetivos y verbos en el API
- Los listados deben ser paginados
  - Usar en el Path String: limit & offset
  - El total debe regresar en el Header X-Total-Count
- Se deben usar los verbos apropiados para cada método del API: GET, POST, PUT, DELETE
- Usar código libre, tanto en el lenguaje de desarrollo como en la base de datos
- CI y CD en el proceso de desarrollo. Usando infraestructura libre
