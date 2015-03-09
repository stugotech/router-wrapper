//import Q from 'q';
import {expect} from 'chai';
import supertest from 'supertest-as-promised';
import express from 'express';
import Router from '../src/router';


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
});