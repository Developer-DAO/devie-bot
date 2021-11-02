export class Resource {
  contributor: string;
  author: string;
  title: string;
  summary: string;
  source: string;
  level: string;
  mediaType: string;
  blockchain: string[];
  category: string[];
  tags: string[];

  constructor(
    contributor: string,
    author: string,
    title: string,
    summary: string,
    source: string,
    level: string,
    mediaType: string,
    blockchain: string[],
    category: string[],
    tags: string[],
  ) {
    this.contributor = contributor;
    this.author = author;
    this.title = title;
    this.summary = summary;
    this.source = source;
    this.level = level;
    this.mediaType = mediaType;
    this.blockchain = blockchain;
    this.category = category;
    this.tags = tags;
  }
}
