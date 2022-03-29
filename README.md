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
- RF07. Obtener el registro de un usuario
- RF15. Crear pruebas de integración

### Almacenes

#### Categorías

- RF08. Listado de Categorías
- RF09. Registro de Categorías
- RF10. Modificación de Categorías
- RF11. Borrado lógico de Categorías
- RF12. Obtener una categoría
- RF13. Proteger los métodos de Categorías
- RF14. Crear pruebas de integración

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

![Casos de Uso de Usuarios](https://user-images.githubusercontent.com/24198508/160295235-67b0bf0b-901e-424e-9e30-2694103d4b89.png)

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

### RF07. Obtener el registro un usuario

- Se debe obtener por ID la información de un usuario
- No debe de contener la contraseña
- Solo busca entre los usuarios activos

### RF15. Crear pruebas de integracion

- Se deben crear pruebas de integración de las operaciones de usuarios

---

### RF08. Listado de Categorías

- Se debe generar un método para generar un listado de Categorías activas
- El modelo debe tener la siguiente estructura
  - Código.
    - Requerido
    - Único entre los activos
    - Texto
  - Nombre
    - Requerido
    - Texto
    - Índice
  - Descripción.
    - Cadena de texto
  - Borrado
    - Booleano
    - Por default es falso
    - Requerido
- Debe hacerse un índice único entre el código y el estatus de borrado. Aplicar lo mismo que se realizó con Usuarios, para cuando el mismo código haya sido borrado.

### RF09. Registro de una categoría

- Crear un método para agregar una nueva categoría
- El código debe ser único entre los registros activos

### RF10. Modificación de categorías

- Generar un método para modificar una categoría
- Solo puede modifica una categoría activa
- El código es único

### RF11. Borrado lógico de categorías

- Generar un método para borrar lógicamente una categoría
- Se asegurar que se logre borrar, aunque el código ya exista entre los borrados

### RF12. Obtener una categoría

- Generar un método para obtener una categoría
- Se debe buscar entre las categorías activas

### RF13. Proteger los métodos de categorías

- Asegurar que todos los métodos de categorías estén protegidos por JWT

### RF14. Crear pruebas de integracion

- Se deben crear pruebas de integración de las operaciones de categorías

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
