import { LookupItem, Resource } from '../types';

export class ResourceBuilderError extends Error {}

export class ResourceBuilder {
  public contributor?: string;
  public author?: LookupItem;
  public title?: string;
  public summary?: string;
  public source?: string;
  public level?: string;
  public mediaType?: string;
  public blockchain?: LookupItem[];
  public category?: LookupItem[];
  public tags?: LookupItem[];

  public build(): Resource {
    if (this.contributor == null || this.contributor === undefined) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.author == null || this.author === undefined) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.title == null || this.title === undefined || this.title.trim().length === 0) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.summary == null || this.summary === undefined || this.summary.trim().length === 0) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.source == null || this.source === undefined || this.source.trim().length === 0) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.level == null || this.level === undefined || this.level.trim().length === 0) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.mediaType == null || this.mediaType === undefined || this.mediaType.trim().length === 0) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.category == null || this.category === undefined || this.category.length === 0) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.tags == null || this.tags === undefined || this.tags.length === 0) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    if (this.blockchain == null || this.blockchain === undefined || this.blockchain.length === 0) {
      throw new ResourceBuilderError('Unable to build incomplete Resource')
    }
    return {
      contributor: this.contributor,
      author: this.author.id,
      title: this.title.trim(),
      summary: this.summary.trim(),
      source: this.source.trim(),
      level: this.level.trim(),
      mediaType: this.mediaType.trim(),
      blockchain: this.blockchain.map(bc => bc.id),
      category: this.category.map(c => c.id),
      tags: this.tags.map(t => t.id),
    };
  }
}
