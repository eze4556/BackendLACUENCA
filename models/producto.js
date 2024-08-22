// models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: {type:String},
  imagen: { type: String },
  categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }] // Referencia a la categoría


 

});

module.exports = mongoose.model('Producto', productoSchema);


// models/Producto.js
// const mongoose = require('mongoose');

// const productoSchema = new mongoose.Schema({
//   titulo: { type: String, required: true }, // Campo para el título del producto
//   descripcion: { type: String }, // Campo para la descripción
//   fecha: { type: Date, default: Date.now }, // Campo para la fecha, por defecto la fecha actual
//   media: { type: String }, // Campo para almacenar la ruta de la imagen o el video
//   categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }] // Referencia a la categoría o categorías
// });

// module.exports = mongoose.model('Producto', productoSchema);
