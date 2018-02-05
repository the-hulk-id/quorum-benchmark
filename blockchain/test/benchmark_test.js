/* global assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

var Benchmark = artifacts.require('Benchmark');

contract('Benchmark', function() {
  let benchmark;

  before('deploy benchmark', done => {
    Benchmark.new().then(instance => {
      benchmark = instance;
      done();
    });
  });

  it('should have all getters with correct value', async () => {
    // eslint-disable-next-line babel/new-cap
    var watcher = benchmark.FinishWrite();

    await benchmark.writeData('data', 3);
    let events = await watcher.get();
    // console.log(events);
    assert.equal(events.length, 1);
    assert.equal(events[0].args.data.valueOf(), 'data');
  });
});
