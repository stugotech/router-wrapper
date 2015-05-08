//import Q from 'q';
import {expect} from 'chai';
import supertest from 'supertest-as-promised';
import express from 'express';
import Router, {Context} from '../src/Router';


describe('Router', function () {
  var wrappedRouter;
  var app;

  beforeEach(function () {
    let router = express.Router();
    wrappedRouter = new Router(router);
    app = express();
    app.use(router);
  });

  it('should call with correct context', async function () {
    wrappedRouter
      .context({name: 'context'})
      .get('/test', async function (request, response) {
        var value = await Promise.resolve(5);
        expect(this.name).to.equal('context');
        response.send(value.toString());
      });

    let response = await supertest(app)
      .get('/test')
      .expect(200);

    expect(response.text).to.equal('5');
  });

  it('should have a working param method', async function () {
    wrappedRouter
      .param('test', async function (request, response, next, test) {
        var value = await Promise.resolve(5);
        request.test = parseInt(test);
        next()
      })
      .get('/:test', function (request, response) {
        response.send(request.test.toString());
      });

    let response = await supertest(app)
      .get('/5')
      .expect(200);

    expect(response.text).to.equal('5');
  });

  it('should have a working all method', async function () {
    wrappedRouter
      .all('*', async function (request, response, next) {
        request.test = await Promise.resolve(5);
        next();
      })
      .get('/test', function (request, response) {
        response.send(request.test.toString());
      });

    let response = await supertest(app)
      .get('/test')
      .expect(200);

    expect(response.text).to.equal('5');
  });

  it('should throw errors', async function () {
    wrappedRouter
      .get('/test', async function (request, response) {
        var value = await Promise.resolve(5);
        throw new Error();
        response.send();
      });

    await supertest(app)
      .get('/test')
      .expect(500);
  });

  it('should export context', function () {
    expect(Context).to.exist;
  });

  it('should allow chaining', function () {
    expect((new Router(express.Router())).context({}).get('',function () {}).get).to.exist;
  });
});
