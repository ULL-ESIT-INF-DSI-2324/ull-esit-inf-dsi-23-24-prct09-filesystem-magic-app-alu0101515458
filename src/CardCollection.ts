import * as fs from 'fs';
import chalk from 'chalk';
import { Card } from './ICard.js';

/**
 * @class CardCollection
 * 
 * La colección se almacena en ficheros JSON en un directorio específico para cada usuario.
 * Cada carta se almacena en un fichero con el ID de la carta como nombre.
 * 
 * La colección se carga al instanciar la clase.
 * 
 * @property {Card[]} collection - Array de cartas.
 * @property {string} user - Nombre del usuario.
 * @method {getUserDirPath} - Obtener la ruta del directorio del usuario.
 * @method {getCardFilePath} - Obtener la ruta del archivo para una carta específica.
 * @method {loadCollection} - Cargar la colección desde ficheros.
 * @method {addCard} - Añadir una nueva carta.
 * @method {updateCard} - Actualizar una carta existente.
 * @method {removeCard} - Eliminar una carta.
 * @method {listCards} - Listar todas las cartas.
 */
export class CardCollection {
  private collection: Card[] = [];
  private user: string;

  constructor(user: string) {
    this.user = user;
    this.loadCollection(); // Cargar la colección al instanciar
  }

  private getColorCode(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      blanco: '#FFFFFF',
      azul: '#0000FF',
      negro: '#000000',
      rojo: '#FF0000',
      verde: '#00FF00',
      incoloro: '#CCCCCC', // Suponiendo un gris para incoloro
      multicolor: '#FF00FF' // Ejemplo para multicolor
    };
    return colorMap[colorName.toLowerCase()] || '#000000'; // Negro por defecto si no se encuentra
  }


  // Obtener la ruta del directorio del usuario
  private getUserDirPath(): string {
    return `./data/${this.user}`;
  }

  // Obtener la ruta del archivo para una carta específica
  private getCardFilePath(id: number): string {
    return `${this.getUserDirPath()}/${id}.json`;
  }

  // Cargar la colección desde ficheros
  private loadCollection(): void {
    const userDirPath = this.getUserDirPath();
    if (!fs.existsSync(userDirPath)) {
      fs.mkdirSync(userDirPath, { recursive: true });
    } else {
      const fileNames = fs.readdirSync(userDirPath);
      this.collection = fileNames.map(fileName => {
        const filePath = `${userDirPath}/${fileName}`;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent) as Card;
      });
    }
  }

  // Añadir una nueva carta
  public addCard(card: Card): void {
    if (this.collection.some(c => c.id === card.id)) {
      console.log(chalk.red(`La carta con ID ${card.id} ya existe en la colección de ${this.user}.`));
    } else {
      this.collection.push(card);
      fs.writeFileSync(this.getCardFilePath(card.id), JSON.stringify(card, null, 2));
      console.log(chalk.green(`Nueva carta añadida a la colección de ${this.user}.`));
    }
  }

  // Actualizar una carta existente
  public updateCard(updatedCard: Card): void {
    const cardIndex = this.collection.findIndex(c => c.id === updatedCard.id);
    if (cardIndex === -1) {
      console.log(chalk.red(`La carta con ID ${updatedCard.id} no existe en la colección de ${this.user}.`));
    } else {
      this.collection[cardIndex] = updatedCard;
      fs.writeFileSync(this.getCardFilePath(updatedCard.id), JSON.stringify(updatedCard, null, 2));
      console.log(chalk.green(`Carta actualizada en la colección de ${this.user}.`));
    }
  }

  // Eliminar una carta
  public removeCard(id: number): void {
    const cardIndex = this.collection.findIndex(c => c.id === id);
    if (cardIndex === -1) {
      console.log(chalk.red(`La carta con ID ${id} no existe en la colección de ${this.user}.`));
    } else {
      this.collection.splice(cardIndex, 1);
      fs.unlinkSync(this.getCardFilePath(id));
      console.log(chalk.green(`Carta eliminada de la colección de ${this.user}.`));
    }
  }

  // Listar todas las cartas
  // Listar todas las cartas
public listCards(): void {
  console.log(chalk.bold(`\nColección de cartas de ${this.user}\n`));
  this.collection.forEach(card => {
    const colorCode = this.getColorCode(card.color);
    console.log(chalk.bold(chalk.white(`ID: ${card.id}`)));
    console.log(chalk.white(`Nombre: ${card.nombre}`));
    console.log(`Coste de Mana: ${card.costeMana}`);
    console.log(`Color: ${chalk.hex(colorCode)(card.color)}`);
    console.log(`Tipo de Línea: ${card.líneaTipo}`);
    console.log(`Rareza: ${card.rareza}`);
    console.log(`Texto de Reglas: ${card.textoReglas}`);
    if (card.líneaTipo === 'Criatura' && card.fuerzaResistencia) {
      console.log(`Fuerza/Resistencia: ${card.fuerzaResistencia[0]}/${card.fuerzaResistencia[1]}`);
    }
    if (card.marcasLealtad && card.líneaTipo === 'Planeswalker') {
      console.log(`Marcas de Lealtad: ${card.marcasLealtad}`);
    }
    console.log(`Valor de Mercado: ${card.valorMercado}`);
    console.log(""); // Salto de línea para separar las cartas
  });
}

// Mostrar la información de una carta concreta
public readCard(id: number): void {
  const card = this.collection.find(c => c.id === id);
  if (!card) {
    console.log(chalk.red(`La carta con ID ${id} no existe en la colección de ${this.user}.`));
  } else {
    const colorCode = this.getColorCode(card.color);
    console.log(chalk.bold(`\nInformación de la carta con ID ${id}\n`));
    console.log(chalk.white(`Nombre: ${card.nombre}`));
    console.log(`Coste de Mana: ${card.costeMana}`);
    console.log(`Color: ${chalk.hex(colorCode)(card.color)}`);
    console.log(`Tipo de Línea: ${card.líneaTipo}`);
    console.log(`Rareza: ${card.rareza}`);
    console.log(`Texto de Reglas: ${card.textoReglas}`);
    if (card.líneaTipo === 'Criatura' && card.fuerzaResistencia) {
      console.log(`Fuerza/Resistencia: ${card.fuerzaResistencia[0]}/${card.fuerzaResistencia[1]}`);
    }
    if (card.marcasLealtad && card.líneaTipo === 'Planeswalker') {
      console.log(`Marcas de Lealtad: ${card.marcasLealtad}`);
    }
    console.log(`Valor de Mercado: ${card.valorMercado}`);
  }
}

}
