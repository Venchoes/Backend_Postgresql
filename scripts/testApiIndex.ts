import handler from '../api/index';

function mockReq() {
  return {} as any;
}

function mockRes() {
  let statusCode = 200;
  return {
    status(code: number) { statusCode = code; return this; },
    json(obj: any) { console.log('STATUS', statusCode); console.log('BODY', obj); }
  } as any;
}

(async () => {
  try {
    await handler(mockReq(), mockRes());
  } catch (err) {
    console.error('handler error:', err);
  }
})();
