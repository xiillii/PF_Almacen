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

- RF16. Listado de productos
- RF17. Registro de Productos
- RF18. Modificación de Productos
- RF19. Borrado lógico de Productos
- RF20. Obtener un registro de productos
- RF21. Proteger los métodos de productos
- RF22. Crear pruebas de integración

#### Almacenes

- RF23. Listado de Almacenes
- RF24. Registro de Almacenes
- RF25. Modificación de Almacenes
- RF26. Borrado lógico de Almacenes
- RF27. Obtener un almacén
- RF28. Entrada de Producto a Almacén. Método PEPS
- RF29. Salida de Producto a Almacén. Método PEPS
- RF30. Traspaso de Producto a Almacén
- RF31. Proteger los métodos de almacenes
- RF32. Crear pruebas de integración
- RF33. Costeo de inventarios PEPS

---

![Casos de Uso de Usuarios](https://user-images.githubusercontent.com/24198508/160295235-67b0bf0b-901e-424e-9e30-2694103d4b89.png)

### RF01. Listado de usuarios

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

### RF15. Crear pruebas de integración de Usuarios

- Crear pruebas de integración para los casos de uso de usuarios

### RF16. Listado de productos

- Crear el modelo de un Producto con los siguientes campos
  - Código del producto.
    - Texto
    - Único entre los activos
    - Requerido
  - Nombre del producto
    - Texto
    - Requerido
  - Descripción del producto
    - Texto
    - No requerido
  - Imagen
    - Texto
    - No requerido
    - Se ocupará para poner el enlace web de la imagen
  - Costo. Se calculará mediante PEPS
    - Numérico de precisión con 4 decimales
    - No requerido
  - Precio de venta. Puede ser cero en caso de que el producto sea materia prima
    - Numérico de precisión con 4 decimales
    - No requerido
  - Marca del fabricante
    - Texto
    - Requerido
  - Calificación del producto
    - Número entero del 0 al 5
    - Default: 0
  - Número de reseñas del producto
    - Entero
    - Default: 0
  - Activo
    - Booleano
    - Requerido
    - Default: verdadero
    - Este estatus es diferente al de borrado, es para indicar que el producto podría no tener movimientos.
  - Borrado
    - Booleano
    - Requerido
    - Default: falso
- Crear el método API para listar los productos activos.
- El método debe tener la opción de poder mostrar solo los productos inactivos
- El método debe tener la opción de listar todos los productos activos e inactivos
- El método nunca debe listar productos borrados
- Cada producto debe tener información de su categoría, sin importar si la categoría este inactiva

### RF17. Registro de productos

- Generar un método para insertar nuevos productos al catálogo
- El código debe ser único entre los activos. Asegurar que el borrado de los productos no influya, aunque tenga el código igual.
- La categoría asignada debe estar activa

### RF18. Modificación de Productos

- Generar un método para modificar productos activos o inactivos
- No puede modificar productos borrados
- La categoría asignada debe estar activa

### RF19. Borrado lógico de Productos

- Generar un método para borrar lógicamente un producto
- Un producto no se puede borrar si tiene existencia en algún almacén
- El código único no debe influir entre los borrados

### RF20. Obtener un registro de producto

- Generar un método para obtener la información de un producto
- Solo puede obtener información de un producto no borrado
- Se debe incluir la información de la categoría

### RF21. Proteger los métodos de producto

- Proteger todos los métodos de productos con JWT

### RF22. Crear pruebas de integración de Productos

- Crear pruebas de integración de los casos de uso de Productos

### RF23. Listado de Almacenes

- Crear el modelo para un Almacén
- Debe tenar los siguientes campos
  - Código del almacén
    - Texto
    - Único entre los activos
    - Requerido
  - Nombre del almacén
    - Texto
    - Requerido
  - Descripción del almacén
    - Texto
  - Dirección
    - Texto
  - Longitud
    - Número decimal
    - No requerido
  - Latitud
    - Número decimal
    - No requerido
  - Borrado
    - Booleano
    - Requerido
    - Default: falso
  - Debe crear un índice único entre el Código y el Borrado
- Crear un método de listado de almacenes activos

### RF24. Registro de almacenes

- Generar un método para agregar nuevos almacenes
- Se debe verificar que el código sea único entre los activos

### RF25. Modificación de almacenes

- Generar un método para modificar un almacén
- No se puede modificar un almacén borrado

### RF26. Borrado lógico de almacenes

- Generar un método para borrar lógicamente un almacén
- No se puede borrar un almacén que tenga productos asignados
- Se asegurar que se logre borrar, aunque el código ya exista entre los borrados

### RF27. Obtener un almacén

- Generar un método para obtener información de un almacén
- No puede obtener un registro borrado

### RF28. Entrada de un producto al almacén

- Generar un método para introducir productos activos a un almacén activo
- Debe tener una cantidad de entrada
  - La cantidad es importante, puesto que el costo representa a esta cantidad, y se refleja en las salidas
  - Debe ser positiva
  - Debe sumar a la existencia del producto en el almacén
- Debe tener un costo de entrada
- Debe tener una descripción de la entrada
- El día y la hora de entrada debe tener huso horario
- Debe estar firmado por un usuario activo
- Se debe llevar un kardex del movimiento

### RF29. Salida de un producto de un almacén

- Generar un método para sacar existencia de un producto activo de un almacén activo.
- Debe tener una cantidad de salida
- Debe tener un costo de salida
  - Este costo es de la entrada de la existencia más antigua. Primero en entrar, primero en salir.
- Solo pueden salir de almacenes con existencia mayor que cero
- No puede quedar una existencia negativa
- Debe tener una descripción de la salida
- El día y la hora de salida debe tener huso horario
- El movimiento debe estar firmado por un usuario activo

### RF30. Traspaso de productos entre almacenes

- Generar un método para traspasar un producto activo entre 2 almacenes activos
- El costo y la antigüedad de la entrada debe de conservarse
- No puede traspasarse una cantidad que provoque una existencia negativa
- Debe tener una descripción del movimiento
- El día y la hora de salida debe tener huso horario
- El movimiento debe estar firmado por un usuario activo

### RF31. Proteger los métodos de almacenes

- Proteger todos los métodos de almacenes con JWT

### RF32. Crear pruebas de integración de almacenes

- Generar pruebas de integración de los casos de uso de almacenes

### RF33. Costeo de inventarios PEPS

- Poder generar costeos de almacenes mediante Primero en Entrar, Primero en Salir

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
