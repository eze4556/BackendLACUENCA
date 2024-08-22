// controllers/productoController.js
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const fs = require('fs');
const path = require('path'); 



// Controlador para obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Controlador para crear un nuevo producto
exports.createProducto = async (req, res) => {
  try {
    // Obtiene las categorías seleccionadas del cuerpo de la solicitud
    const categoriasSeleccionadas = req.body.categorias;

   // Agrega el console.log para imprimir req.body
    console.log('Datos del cuerpo de la solicitud:', req.body);

    // Crea un nuevo producto con los datos proporcionados
    const producto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      

      imagen: req.file.path,
      
      precio: req.body.precio,
      descuento: req.body.descuento || 0,
      precioFinal: req.body.precio - (req.body.descuento || 0),
      categorias: categoriasSeleccionadas 
    });

    // Guarda el producto en la base de datos
    const nuevoProducto = await producto.save();

    // Asocia el producto con las categorías seleccionadas
    if (categoriasSeleccionadas && categoriasSeleccionadas.length > 0) {
      await Categoria.updateMany({ _id: { $in: categoriasSeleccionadas } }, { $push: { productos: nuevoProducto._id } });
    }

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




// Controlador para obtener un producto por su ID
exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto == null) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener un producto por su ID
exports.getProductoByCategoriaId = async (req, res) => {
  try {
    const categoriaId = req.params.id; // Obtenemos el ID de la categoría de la solicitud
    const productos = await Producto.find({ categorias: categoriaId }); // Buscamos productos que tengan la categoría con el ID proporcionado
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controlador para actualizar un producto
exports.updateProducto = async (req, res) => {
  try {

     console.log('Datos recibidos del frontend:', req.body);
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

  // Actualizar los campos proporcionados en la solicitud
    if (req.body.nombre !== undefined) {
      producto.nombre = req.body.nombre;
    }
    if (req.body.precio !== undefined) {
      producto.precio = req.body.precio;
    }
    if (req.body.descuento !== undefined) {
      producto.descuento = req.body.descuento;
      producto.precioFinal = req.body.precio - req.body.descuento;
    }
    
    // Actualizar la imagen solo si se proporciona una nueva imagen en la solicitud
    if (req.file) {
      // Eliminar la imagen anterior del servidor
      const imagenPath = path.join(__dirname, '../uploads', producto.imagen);
      if (fs.existsSync(imagenPath)) {
        fs.unlinkSync(imagenPath);
      }
      // Actualizar la imagen del producto con el nombre de la nueva imagen
      producto.imagen = req.file.filename;
    }

    const productoActualizado = await producto.save();
    console.log('Producto actualizado en la base de datos:', productoActualizado);
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Controlador para eliminar un producto
// exports.deleteProducto = async (req, res) => {
//   try {
//     const producto = await Producto.findById(req.params.id);
//     if (producto == null) {
//       return res.status(404).json({ message: 'Producto no encontrado' });
//     }
//     await Producto.deleteOne({ _id: req.params.id });
//     res.json({ message: 'Producto eliminado correctamente' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Controlador para eliminar un producto
exports.deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto == null) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Eliminar la imagen asociada al producto del servidor
    const imagenPath = path.join(__dirname, '../uploads', producto.imagen);
    if (fs.existsSync(imagenPath)) {
      fs.unlinkSync(imagenPath);
    }
    
    // Eliminar el producto de la base de datos
    await Producto.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// // controllers/productoController.js
// const Producto = require('../models/producto');
// const Categoria = require('../models/categoria');

// const fs = require('fs');
// const path = require('path');

// // Controlador para obtener todos los productos
// exports.getAllProductos = async (req, res) => {
//   try {
//     const productos = await Producto.find();
//     res.json(productos);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Controlador para crear un nuevo producto
// exports.createProducto = async (req, res) => {
//   try {
//     // Obtiene las categorías seleccionadas del cuerpo de la solicitud
//     const categoriasSeleccionadas = req.body.categorias;

//     // Verifica si se subió una imagen o un video
//     let mediaPath;
//     if (req.file) {
//       mediaPath = req.file.path;
//     }

//     // Crea un nuevo producto con los datos proporcionados
//     const producto = new Producto({
//       titulo: req.body.titulo,
//       fecha: req.body.fecha,
//       descripcion: req.body.descripcion,
//       media: mediaPath, // Guarda la ruta del archivo, ya sea imagen o video
//       categorias: categoriasSeleccionadas 
//     });

//     // Guarda el producto en la base de datos
//     const nuevoProducto = await producto.save();

//     // Asocia el producto con las categorías seleccionadas
//     if (categoriasSeleccionadas && categoriasSeleccionadas.length > 0) {
//       await Categoria.updateMany(
//         { _id: { $in: categoriasSeleccionadas } },
//         { $push: { productos: nuevoProducto._id } }
//       );
//     }

//     res.status(201).json(nuevoProducto);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Controlador para obtener un producto por su ID
// exports.getProductoById = async (req, res) => {
//   try {
//     const producto = await Producto.findById(req.params.id);
//     if (producto == null) {
//       return res.status(404).json({ message: 'Producto no encontrado' });
//     }
//     res.json(producto);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Controlador para obtener productos por categoría
// exports.getProductoByCategoriaId = async (req, res) => {
//   try {
//     const categoriaId = req.params.id;
//     const productos = await Producto.find({ categorias: categoriaId });
//     res.json(productos);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Controlador para actualizar un producto
// exports.updateProducto = async (req, res) => {
//   try {
//     console.log('Datos recibidos del frontend:', req.body);
//     const producto = await Producto.findById(req.params.id);
//     if (!producto) {
//       return res.status(404).json({ message: 'Producto no encontrado' });
//     }

//     // Actualizar los campos proporcionados en la solicitud
//     if (req.body.titulo !== undefined) {
//       producto.titulo = req.body.titulo;
//     }
//     if (req.body.fecha !== undefined) {
//       producto.fecha = req.body.fecha;
//     }
//     if (req.body.descripcion !== undefined) {
//       producto.descripcion = req.body.descripcion;
//     }
//     if (req.body.categorias !== undefined) {
//       producto.categorias = req.body.categorias;
//     }

//     // Actualizar la imagen o video solo si se proporciona uno nuevo
//     if (req.file) {
//       // Eliminar el archivo anterior del servidor
//       const mediaPath = path.join(__dirname, '../uploads', producto.media);
//       if (fs.existsSync(mediaPath)) {
//         fs.unlinkSync(mediaPath);
//       }
//       // Actualizar con el nuevo archivo
//       producto.media = req.file.path;
//     }

//     const productoActualizado = await producto.save();
//     console.log('Producto actualizado en la base de datos:', productoActualizado);
//     res.json(productoActualizado);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Controlador para eliminar un producto
// exports.deleteProducto = async (req, res) => {
//   try {
//     const producto = await Producto.findById(req.params.id);
//     if (producto == null) {
//       return res.status(404).json({ message: 'Producto no encontrado' });
//     }

//     // Eliminar la imagen o video asociado al producto del servidor
//     const mediaPath = path.join(__dirname, '../uploads', producto.media);
//     if (fs.existsSync(mediaPath)) {
//       fs.unlinkSync(mediaPath);
//     }

//     // Eliminar el producto de la base de datos
//     await Producto.deleteOne({ _id: req.params.id });

//     res.json({ message: 'Producto eliminado correctamente' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

