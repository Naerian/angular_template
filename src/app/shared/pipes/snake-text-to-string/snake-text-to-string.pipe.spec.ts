import { SnakeTextToStringPipe } from './snake-text-to-string.pipe';

describe('SnakeTextToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new SnakeTextToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
