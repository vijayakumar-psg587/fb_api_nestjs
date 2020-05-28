import { AppCommonMiddleware } from './appcommon.middleware';

describe('AppcommonMiddleware', () => {
  it('should be defined', () => {
    expect(new AppCommonMiddleware()).toBeDefined();
  });
});
