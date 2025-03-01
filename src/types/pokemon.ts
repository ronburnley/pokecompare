// Create a base interface for shared properties
interface PokemonBase {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    }
  }[];
  types: {
    type: {
      name: string;
    }
  }[];
  abilities: {
    ability: {
      name: string;
    }
  }[];
}

export interface Pokemon extends PokemonBase {
  mega_evolutions?: MegaEvolution[];
}

export interface MegaEvolution extends PokemonBase {}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}