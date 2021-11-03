import { Resource, Glossary, Author, Blockchain, Category, Tag } from './index';
export class Contributor {
    DiscordId: string;
    devDaoId?: string[];
    ethAddress?: string;
    solAddress?: string;
    resources?: Resource[];
    glossaries?: Glossary[];
    author?: Author;
    blockchains?: Blockchain[];
    categories?: Category[];
    tags?: Tag[];

    constructor({
     DiscordId, devDaoId, ethAddress, solAddress, resources, glossaries, author, blockchains, categories, tags,
        }:
        { DiscordId: string; devDaoId?: string[]; ethAddress?: string; solAddress?: string; resources?: Resource[];
          glossaries?: Glossary[]; author?: Author; blockchains?: Blockchain[]; categories?: Category[]; tags?: Tag[];
        }) {
      this.DiscordId = DiscordId;
      this.ethAddress = ethAddress
      this.solAddress = solAddress;
      this.glossaries = glossaries;
      this.devDaoId = devDaoId;
      this.resources = resources;
      this.author = author;
      this.blockchains = blockchains;
      this.categories = categories;
      this.tags = tags;
    }
  }