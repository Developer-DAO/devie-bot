import { Resource } from '../types';

export class ResourceBuilderError extends Error {}

export class ResourceBuilder {
  public contributor?: string;
  public author?: string;
  public title?: string;
  public summary?: string;
  public source?: string;
  public level?: string;
  public mediaType?: string;
  public blockchain: string[];
  public category?: string[];
  public tags?: string[];

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
    return new Resource(
      this.contributor,
      this.author,
      this.title.trim(),
      this.summary.trim(),
      this.source.trim(),
      this.level.trim(),
      this.mediaType.trim(),
      this.blockchain,
      this.category,
      this.tags,
    );
  }
}
