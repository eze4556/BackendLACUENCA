// models/Evento.js

const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  imagen: { type: String},
  // nombre: { type: String},
  titulo: { type: String},
  fecha: { type: Date},
  descripcion: { type: String },
  categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }] // Referencia a la categoría

});

module.exports = mongoose.model('Evento', eventoSchema);

