/* global require: false, exports: false */

// Module dependencies, external
var R = require('ramda'),
    cheerio = require('cheerio'),
    RQ = require('async-rq'),
    rq = require('rq-essentials'),
    then = rq.then,
    get = rq.http.get,

// Module dependencies, local application-specific
    TeamPlacement = require('./../../shared/scripts/app.models').TeamPlacement,


//////////////////////////////////
// www.altomfotball.no
//////////////////////////////////

    /**
     * Publicly available for testing purposes only
     */
    parseAltOmFotballHtmlTable = exports._parseAltOmFotballHtmlTable = function (htmlContent) {
        'use strict';
        var currentTable = [],
            $, rows;

        if (!htmlContent) {
            throw new Error('Argument is missing - cannot parse');
        }
        if (!R.is(String, htmlContent)) {
            throw new Error('Argument is not a string - cannot parse');
        }

        $ = cheerio.load(htmlContent, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false });
        rows = $('table').first().find('tbody').find('tr');

        R.forEach(function (element) {
            var $cells = $(element).find('td'),
                no = $($cells[0]).html(),
                team = $cells.find('a').first().html(),
                matches = $($cells[2]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace('&nbsp;', ' ');

            // Normalize ...
            no = parseInt(no, 10);

            // The data format
            currentTable.push(new TeamPlacement(team, no, matches));
        }, rows);

        return currentTable;
    },


    currentTippeligaTableUrl = 'http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=1&subCmd=total&live=true&useFullUrl=false',
    parseTippeligaTable = parseAltOmFotballHtmlTable,


    currentObosligaTableUrl = 'http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=2&subCmd=total&live=true&useFullUrl=false',
    parseObosligaTable = parseAltOmFotballHtmlTable,


    /**
     * Publicly available for testing purposes only
     */
    parseTippeligaTopScorerTable = exports._parseTippeligaTopScorerTable = function (htmlContent) {
        'use strict';
        var topScorers = [],
            $, rows, maxGoals;

        if (!htmlContent) {
            throw new Error('Argument is missing - cannot parse');
        }
        if (!R.is(String, htmlContent)) {
            throw new Error('Argument is not a string - cannot parse');
        }

        $ = cheerio.load(htmlContent, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false });
        rows = $('tbody').find('tr');

        R.forEach(function (element) {
            var $cells = $(element).find('td'),
                player = $cells.find('a').first().html(),
                goals = $($cells[3]).html();

            // Launder ...
            // Max three spaces in name ...
            player = player.replace('&nbsp;', ' ').replace('&nbsp;', ' ').replace('&nbsp;', ' ');

            // Normalize ...

            // Filter ...
            if (!maxGoals) {
                maxGoals = goals;
            }
            if (!maxGoals || goals === maxGoals) {
                // The data format
                topScorers.push(player);
            }
        }, rows);

        return topScorers;
    },

    currentTippeligaToppscorerTableUrl = 'http://www.altomfotball.no/elementsCommonAjax.do?cmd=statistics&subCmd=goals&tournamentId=1&seasonId=&teamId=&useFullUrl=false',


//////////////////////////////////////////////
// Public functions
//////////////////////////////////////////////

// These are 'data generator' requestors => No forwarding of existing data ...
    getCurrentTippeligaTableRequestor = exports.getCurrentTippeligaTable =
        RQ.sequence([
            get(currentTippeligaTableUrl),
            then(parseTippeligaTable)
        ]),

    getCurrentObosligaTableRequestor = exports.getCurrentObosligaTable =
        RQ.sequence([
            get(currentObosligaTableUrl),
            then(parseObosligaTable)
        ]),

    getCurrentTippeligaTopScorerRequestor = exports.getCurrentTippeligaTopScorer =
        RQ.sequence([
            get(currentTippeligaToppscorerTableUrl),
            then(parseTippeligaTopScorerTable)
        ]),

    /**
     * Solved manually: Just remove the teams one after another whenever they screw up ...
     */
    getCurrentRemainingCupContenders = exports.getCurrentRemainingCupContenders =
        rq.return([
            'Bodø/Glimt',
            'Brann',
            'Haugesund',
            'Lillestrøm',
            'Molde',
            'Odd',
            'Rosenborg',
            'Sarpsborg 08',
            'Sogndal',
            'Stabæk',
            'Start',
            'Strømsgodset',
            'Tromsø',
            'Viking',
            'Vålerenga',
            'Aalesund',

            'Bryne',
            'Fredrikstad',
            'Hødd',
            'Jerv',
            'KFUM Oslo',
            'Kongsvinger',
            'Kristiansund BK',
            'Levanger',
            'Mjøndalen',
            'Ranheim',
            'Raufoss',
            'Sandefjord',
            'Sandnes Ulf',
            'Strømmen',
            'Ullensaker/Kisa',
            'Åsane'
        ]),
// /'Data generator' requestors


// Service validation functions
// TODO: ...
    isEnabled = exports.isEnabled =
        RQ.parallel([
            getCurrentTippeligaTableRequestor,
            getCurrentObosligaTableRequestor,
            getCurrentTippeligaTopScorerRequestor
        ]),


    /**
     * Expecting argument object containing the current round as <code>currentRound</code>.
     */
    isValid = exports.isValid =
        RQ.sequence([
            rq.stack.push,
            isEnabled,
            function (callback, args) {
                'use strict';
                var current = rq.stack._getStack().pop(),
                    tippeligatable,
                    obosligatable,
                    tippeligatableTopScorer;

                if (!args || !args.length || args.length !== 3) {
                    return callback(null, { message: 'Internal error in RQ.js ("norwegian-soccer-service.js")' });
                }

                tippeligatable = args[0];
                obosligatable = args[1];
                tippeligatableTopScorer = args[2];

                if (parseInt(tippeligatable.length, 10) !== 16) {
                    return callback(null, { message: 'Retrieved tippeligatable result has not 16 teams ("norwegian-soccer-service.js")' });
                }
                if (parseInt(obosligatable.length, 10) !== 16) {
                    return callback(null, { message: 'Retrieved obosligatable result has not 16 teams ("norwegian-soccer-service.js")' });
                }

                if (parseInt(tippeligatable[0].matches, 10) < current.currentRound) {
                    return callback(null, { message: 'Retrieved tippeligatable result is not in sync with stored results - is it a new season?' });
                }
                if (parseInt(obosligatable[0].matches, 10) < current.currentRound) {
                    return callback(null, { message: 'Retrieved obosligatable result is not in sync with stored results - is it a new season?' });
                }

                // Extra check for end of season/new season results available and predictions are not
                // TODO: Revisit this logic ... during 2016
                if (/*!rqInternalStack.isDbConnected &&*/ new Date().getMonth() >= 11 && tippeligatable[0].matches && parseInt(tippeligatable[0].matches, 10) === 0) {
                    return callback(null, { message: "Retrieved tippeligatable result is not in sync with stored results - is it a new season?" });
                }

                return callback(args);
            }
        ]);
