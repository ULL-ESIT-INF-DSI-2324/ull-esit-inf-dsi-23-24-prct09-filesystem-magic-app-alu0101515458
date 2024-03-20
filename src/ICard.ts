import { Color } from "./EColor.js"
import { TipoLinea } from "./ETipoLinea.js";
import { Rareza } from "./ERareza.js";

/**
 * Interfaz que representa una carta.
 */
export interface Card {
  id: number;
  nombre: string;
  costeMana: number;
  color: Color;
  líneaTipo: TipoLinea;
  rareza: Rareza;
  textoReglas: string;
  fuerzaResistencia?: [number, number]; // Opcional
  marcasLealtad?: number; // Opcional
  valorMercado: number;
}