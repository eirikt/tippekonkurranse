/* global require: false, exports: false */

// Module dependencies, external
var __ = require('underscore'),
    cheerio = require('cheerio'),
    RQ = require('async-rq'),
    rq = require('RQ-essentials'),
    then = rq.then,
    get = rq.get,

// Module dependencies, local application-specific
    TeamPlacement = require('./../../shared/scripts/app.models').TeamPlacement,


//////////////////////////////////
// www.altomfotball.no
//////////////////////////////////

    currentTippeligaTableUrl =
        'http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=1&subCmd=total&live=true&useFullUrl=false', // Original
        //'http://www.altomfotball.no/element.do?cmd=tournament&tournamentId=1&seasonId=337&useFullUrl=false', // Works
        //'http://nonexisting.nu',

    parseTippeligaTable = function (body) {
        'use strict';
        var currentTable = [],
            $ = cheerio.load(body, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false }),
            rows = $('tbody').find('tr');
        //    rows = $('#sd_table_1').find('tbody').find('tr');

        __.each(rows, function (element) {
            var $cells = $(element).find('td'),
                no = $($cells[0]).html(),
                team = $cells.find('a').first().html(),
                matches = $($cells[2]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace('&nbsp;', ' ');

            // Normalize ...

            // The data format
            currentTable.push(new TeamPlacement(team, parseInt(no, 10), matches));
        });
        return currentTable;
    },

    currentObosligaTableUrl =
        'http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=2&subCmd=total&live=true&useFullUrl=false',
        //'http://www.altomfotball.no/element.do?cmd=tournament&tournamentId=2&seasonId=337&useFullUrl=false',

    parseObosligaTable = function (body) {
        'use strict';
        var currentTable = [],
            $ = cheerio.load(body, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false }),
            rows = $('tbody').find('tr');
        //    rows = $('#sd_table_2').find('tbody').find('tr');

        __.each(rows, function (element) {
            var $cells = $(element).find('td'),
                no = $($cells[0]).html(),
                team = $cells.find('a').first().html(),
                matches = $($cells[2]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace('&nbsp;', ' ');

            // Normalize ...

            // The data format
            currentTable.push(new TeamPlacement(team, parseInt(no, 10), matches));
        });
        return currentTable;
    },

    currentTippeligaToppscorerTableUrl =
        'http://www.altomfotball.no/elementsCommonAjax.do?cmd=statistics&subCmd=goals&tournamentId=1&seasonId=&teamId=&useFullUrl=false',
        //'http://www.altomfotball.no/element.do?cmd=tournamentStatistics&tournamentId=1&seasonId=337&useFullUrl=false',

    parseTippeligaTopScorerTable = function (body) {
        'use strict';
        var toppscorers = [],
            $ = cheerio.load(body, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false }),
            rows = $('tbody').find('tr'),
            maxGoals = 0;

        __.each(rows, function (element, index) {
            var $cells = $(element).find('td'),
                player = $cells.find('a').first().html(),
                goals = $($cells[3]).html();

            // Launder ...
            // => max three spaces in name ...
            player = player.replace('&nbsp;', ' ').replace('&nbsp;', ' ').replace('&nbsp;', ' ');

            // Normalize ...

            // Filter ...
            if (index === 0) {
                maxGoals = goals;
                // The data format
                toppscorers.push(player);

            } else if (goals === maxGoals) {
                // The data format
                toppscorers.push(player);
            }
        });
        return toppscorers;
    },


//////////////////////////////////////////////
// Public functions
//////////////////////////////////////////////

// These are 'data generator' requestors => No forwarding of existing data ...
    _getCurrentTippeligaTableRequestory = exports.getCurrentTippeligaTable =
        RQ.sequence([
            get(currentTippeligaTableUrl),
            then(parseTippeligaTable)
        ]),

    _getCurrentObosligaTableRequestory = exports.getCurrentObosligaTable =
        RQ.sequence([
            get(currentObosligaTableUrl),
            then(parseObosligaTable)
        ]),

    _getCurrentTippeligaTopScorerRequestory = exports.getCurrentTippeligaTopScorer =
        RQ.sequence([
            get(currentTippeligaToppscorerTableUrl),
            then(parseTippeligaTopScorerTable)
        ]),

    /**
     * Solved manually: Just remove the teams one after another whenever they screw up ...
     */
    _getCurrentRemainingCupContenders = exports.getCurrentRemainingCupContenders =
        rq.return(['Rosenborg']),
// /'Data generator' requestors


// Service validation functions
// TODO: ...
    _isEnabled = exports.isEnabled = function () {
        'use strict';
        return false;
        //return true;

        // TODO: Is 'RQ.sequence([get(currentTippeligaTableUrl)])' returning anything (online/parseable)
    },

// TODO: ...
    _isValid = exports.isValid = function () {
        'use strict';
        return _isEnabled();

        // TODO: Is 'RQ.sequence([get(currentTippeligaTableUrl), then(parseTippeligaTable)])' returning anything useful/valid data
    };
