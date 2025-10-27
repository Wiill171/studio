export interface Bird {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  size: 'small' | 'medium' | 'large';
  colors: string[];
  habitat: 'forest' | 'wetland' | 'grassland' | 'urban';
}

export const birds: Bird[] = [
  {
    id: 'pisco-de-peito-ruivo',
    name: 'Pisco-de-peito-ruivo',
    description: 'Uma ave comum com um peito avermelhado-alaranjado.',
    imageUrl: 'https://picsum.photos/seed/1/600/600',
    imageHint: 'robin bird',
    size: 'medium',
    colors: ['brown', 'red'],
    habitat: 'urban',
  },
  {
    id: 'gaio-azul',
    name: 'Gaio-azul',
    description: 'Uma ave barulhenta e inteligente com plumagem azul brilhante.',
    imageUrl: 'https://picsum.photos/seed/2/600/600',
    imageHint: 'blue jay',
    size: 'medium',
    colors: ['blue', 'white', 'black'],
    habitat: 'forest',
  },
  {
    id: 'cardeal-do-norte',
    name: 'Cardeal-do-norte',
    description: 'Uma ave vermelha vibrante, o macho é vermelho brilhante enquanto a fêmea é marrom.',
    imageUrl: 'https://picsum.photos/seed/3/600/600',
    imageHint: 'red cardinal',
    size: 'small',
    colors: ['red', 'brown'],
    habitat: 'urban',
  },
  {
    id: 'pato-real',
    name: 'Pato-real',
    description: 'Um pato comum, os machos têm a cabeça verde.',
    imageUrl: 'https://picsum.photos/seed/4/600/600',
    imageHint: 'mallard duck',
    size: 'large',
    colors: ['brown', 'green'],
    habitat: 'wetland',
  },
  {
    id: 'pintassilgo-americano',
    name: 'Pintassilgo-americano',
    description: 'Um pequeno tentilhão, o macho é amarelo brilhante no verão.',
    imageUrl: 'https://picsum.photos/seed/5/600/600',
    imageHint: 'yellow finch',
    size: 'small',
    colors: ['yellow', 'black'],
    habitat: 'grassland',
  },
  {
    id: 'pica-pau-peludo',
    name: 'Pica-pau-peludo',
    description: 'O menor pica-pau da América do Norte, com plumagem preta e branca.',
    imageUrl: 'https://picsum.photos/seed/6/600/600',
    imageHint: 'woodpecker bird',
    size: 'small',
    colors: ['black', 'white'],
    habitat: 'forest',
  },
];
