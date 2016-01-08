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
        if (!__.isString(htmlContent)) {
            throw new Error('Argument is not a string - cannot parse');
        }

        $ = cheerio.load(htmlContent, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false });
        rows = $('table').first().find('tbody').find('tr');

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


    currentTippeligaTableUrl = 'http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=1&subCmd=total&live=true&useFullUrl=false',
    parseTippeligaTable = parseAltOmFotballHtmlTable,


    currentObosligaTableUrl = 'http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=2&subCmd=total&live=true&useFullUrl=false',
    parseObosligaTable = parseAltOmFotballHtmlTable,


    currentTippeligaToppscorerTableUrl = 'http://www.altomfotball.no/elementsCommonAjax.do?cmd=statistics&subCmd=goals&tournamentId=1&seasonId=&teamId=&useFullUrl=false',

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
        if (!__.isString(htmlContent)) {
            throw new Error('Argument is not a string - cannot parse');
        }

        $ = cheerio.load(htmlContent, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false });
        rows = $('tbody').find('tr');

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
                topScorers.push(player);

            } else if (goals === maxGoals) {
                // The data format
                topScorers.push(player);
            }
        });
        return topScorers;
    },


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
            rq.push,
            isEnabled,
            function (callback, args) {
                'use strict';
                var current = rq._getStack().pop(),
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
