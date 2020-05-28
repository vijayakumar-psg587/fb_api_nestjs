import { FastifyServerOptions } from './fastify-server-options';

describe('FastifyServerOptions', () => {
  it('should be defined', () => {
    expect(new FastifyServerOptions()).toBeDefined();
  });
});
