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
    id: 'american-robin',
    name: 'American Robin',
    description: 'A common bird with a reddish-orange breast.',
    imageUrl: 'https://picsum.photos/seed/1/600/600',
    imageHint: 'robin bird',
    size: 'medium',
    colors: ['brown', 'red'],
    habitat: 'urban',
  },
  {
    id: 'blue-jay',
    name: 'Blue Jay',
    description: 'A noisy and intelligent bird with bright blue plumage.',
    imageUrl: 'https://picsum.photos/seed/2/600/600',
    imageHint: 'blue jay',
    size: 'medium',
    colors: ['blue', 'white', 'black'],
    habitat: 'forest',
  },
  {
    id: 'northern-cardinal',
    name: 'Northern Cardinal',
    description: 'A vibrant red bird, the male is brilliant red while the female is brown.',
    imageUrl: 'https://picsum.photos/seed/3/600/600',
    imageHint: 'red cardinal',
    size: 'small',
    colors: ['red', 'brown'],
    habitat: 'urban',
  },
  {
    id: 'mallard',
    name: 'Mallard',
    description: 'A common duck, males have a green head.',
    imageUrl: 'https://picsum.photos/seed/4/600/600',
    imageHint: 'mallard duck',
    size: 'large',
    colors: ['brown', 'green'],
    habitat: 'wetland',
  },
  {
    id: 'american-goldfinch',
    name: 'American Goldfinch',
    description: 'A small finch, the male is bright yellow in the summer.',
    imageUrl: 'https://picsum.photos/seed/5/600/600',
    imageHint: 'yellow finch',
    size: 'small',
    colors: ['yellow', 'black'],
    habitat: 'grassland',
  },
  {
    id: 'downy-woodpecker',
    name: 'Downy Woodpecker',
    description: 'The smallest woodpecker in North America, with black and white plumage.',
    imageUrl: 'https://picsum.photos/seed/6/600/600',
    imageHint: 'woodpecker bird',
    size: 'small',
    colors: ['black', 'white'],
    habitat: 'forest',
  },
];
