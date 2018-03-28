var Stuff = require('./models/stuff');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/csgostuff');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    Stuff.remove({}, function(err) { 
        if(err) return console.error(err);
        console.log('Stuff collection removed');
        
        // data creation

        // MIRAGE
        var stuff1 = new Stuff({
            name: 'mirage boost 1',
            map: 'MIRAGE',
            stuffType: 'BOOST',
            author: 'Baptiste',
            upvotes: 187,
            downvotes: 12,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff2 = new Stuff({
            name: 'mirage boost 2',
            map: 'MIRAGE',
            stuffType: 'BOOST',
            author: 'Arnaud',
            upvotes: 132,
            downvotes: 90,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff3 = new Stuff({
            name: 'mirage incendiary 1',
            map: 'MIRAGE',
            stuffType: 'INCENDIARY',
            author: 'Jean-Jacques',
            upvotes: 112,
            downvotes: 9,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff10 = new Stuff({
            name: 'mirage incendiary 2',
            map: 'MIRAGE',
            stuffType: 'INCENDIARY',
            author: 'Jean-Jacques',
            upvotes: 112,
            downvotes: 9,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff11 = new Stuff({
            name: 'mirage flash 1',
            map: 'MIRAGE',
            stuffType: 'FLASH',
            author: 'Jean-Jacques',
            upvotes: 112,
            downvotes: 9,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff12 = new Stuff({
            name: 'mirage flash 2',
            map: 'MIRAGE',
            stuffType: 'FLASH',
            author: 'Jean-Jacques',
            upvotes: 112,
            downvotes: 9,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });

        // OVERPASS
        var stuff4 = new Stuff({
            name: 'overpass boost 1',
            map: 'OVERPASS',
            stuffType: 'BOOST',
            author: 'Georges',
            upvotes: 2,
            downvotes: 0,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff5 = new Stuff({
            name: 'overpass boost 2',
            map: 'OVERPASS',
            stuffType: 'BOOST',
            author: 'Georges',
            upvotes: 2,
            downvotes: 0,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff6 = new Stuff({
            name: 'overpass flash 1',
            map: 'OVERPASS',
            stuffType: 'FLASH',
            author: 'Georges',
            upvotes: 2,
            downvotes: 0,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff7 = new Stuff({
            name: 'overpass flash 2',
            map: 'OVERPASS',
            stuffType: 'FLASH',
            author: 'Georges',
            upvotes: 2,
            downvotes: 0,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff8 = new Stuff({
            name: 'overpass smoke 1',
            map: 'OVERPASS',
            stuffType: 'SMOKE',
            author: 'Georges',
            upvotes: 2,
            downvotes: 0,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        var stuff9 = new Stuff({
            name: 'overpass smoke 2',
            map: 'OVERPASS',
            stuffType: 'SMOKE',
            author: 'Georges',
            upvotes: 2,
            downvotes: 0,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        });
        
        

        // data injection
        stuff1.save(function(err){
            if (err) return console.error(err);
        });
        stuff2.save(function(err){
            if (err) return console.error(err);
        });
        stuff3.save(function(err){
            if (err) return console.error(err);
        });
        stuff4.save(function(err){
            if (err) return console.error(err);
        });
        stuff5.save(function(err){
            if (err) return console.error(err);
        });
        stuff6.save(function(err){
            if (err) return console.error(err);
        });
        stuff7.save(function(err){
            if (err) return console.error(err);
        });
        stuff8.save(function(err){
            if (err) return console.error(err);
        });
        stuff9.save(function(err){
            if (err) return console.error(err);
        });
        stuff10.save(function(err){
            if (err) return console.error(err);
        });
        stuff11.save(function(err){
            if (err) return console.error(err);
        });
        stuff12.save(function(err){
            if (err) return console.error(err);
        });
    
        console.log('Stuff collection recreated');
    });
});
