import { StripHtmlPipe } from './striphtml.pipe';

describe('StripHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new StripHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
