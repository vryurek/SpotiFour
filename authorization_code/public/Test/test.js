/**
 * Unit Tests
 */
var assert = require('assert');
var appCode = require('./../../app.js');

/**
 * tests to see if generateRandomString in app.js returns two
 * different random strings
 */
describe('App_Test', function() {
    describe('#generateRandom()', function() {
        it('should return two different random strings', function() {
            assert.notEqual(appCode.generateRandomString(5), appCode.generateRandomString(5));
        })
    })
});

/**
 * tests to see if getDuration in trackMethods.js returns the correct
 * time in minutes:seconds format
 */
describe('Time_Test', function() {
    describe('#getDuration()', function() {
        it('should return the time in minutes:seconds', function() {
            assert.equal('4:20', appCode.getDuration(260000));
        })
    })
});

/**
 * tests to see if newURL in trackMethods.js returns the correct URL
 * that is used to request lyrics for a track
 */
describe('Lyric_URL_Test', function() {
    describe('#newURL()', function() {
        it('should return the url to request lyrics from', function() {
            assert.equal('https://www.azlyrics.com/lyrics/queen/bohemianrhapsody.html',
                appCode.newURL('Bohemian Rhapsody', 'Queen'));
        })
    })
});


