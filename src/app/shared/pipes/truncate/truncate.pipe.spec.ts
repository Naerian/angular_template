import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  it('create an instance', () => {
    const pipe = new TruncatePipe();
    expect(pipe).toBeTruthy();
  });

  
  it('transform completeWords', () => {
    const pipe = new TruncatePipe();
    pipe.transform('test',25,true);
  });

  it('transform', () => {
    const pipe = new TruncatePipe();
    pipe.transform('test');
  });

});
