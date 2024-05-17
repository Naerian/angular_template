import { AsyncLoadingPipe } from './async-loading.pipe';

describe('AsyncLoadingPipe', () => {
  it('create an instance', () => {
    const pipe = new AsyncLoadingPipe();
    expect(pipe).toBeTruthy();
  });
});
