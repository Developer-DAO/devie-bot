export type LookupItem = {
  id: string;
  name: string;
}

export type Resource = {
  contributor: string;
  author: string;
  title: string;
  summary: string;
  source: string;
  level: string;
  mediaType: string;
  blockchain?: string[];
  category: string[];
  tags: string[];
}

export type Author = {
  name: string;
  isDaoMember: boolean;
  twitterUrl: string;
  youtubeUrl: string;
}

export type Glossary = {
  id: string;
  term: string;
  definition: string;
}

export type Contributor = {
  discordId: string;
  devDaoId?: string[];
  ethAddress?: string;
  solAddress?: string;
  resources?: Resource[];
  glossaries?: Glossary[];
  author?: Author;
  blockchains?: LookupItem[];
  categories?: LookupItem[];
  tags?: LookupItem[];
}
