import { uuid4 } from './uuid4';

describe('uuid4', () => {
  it('should be 32 characters long', () => {
    expect(uuid4().length).toBe(32);
  });

  it('should be lowercase', () => {
    const result = uuid4();
    expect(result).toEqual(result.toLowerCase());
  });

  it('should not contain dashes', () => {
    expect(uuid4()).not.toContain('-');
  });
});
