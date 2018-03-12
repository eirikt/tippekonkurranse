/* global require:false, describe:false, beforeEach:false, it:false, fail:false, root:false */
/* jshint -W030 */

var expect = require('chai').expect,
    R = require('ramda'),
    rq = require('rq-essentials'),

    TeamPlacement = require('../../../shared/scripts/app.models').TeamPlacement,
    norwegianSoccerService = require('../../../server/scripts/norwegian-soccer-service');


describe('Norwegian Soccer Service', function () {
    'use strict';

    describe('parseEliteserieTable', function () {
        it('should exist as a function', function () {
            expect(norwegianSoccerService._parseAltOmFotballHtmlTable).to.exist;
            expect(R.is(Function, norwegianSoccerService._parseAltOmFotballHtmlTable)).to.be.true;
        });


        it('should throw error if invoked with no argument', function () {
            expect(norwegianSoccerService._parseAltOmFotballHtmlTable).to.throw(Error, 'Argument is missing - cannot parse');

            var noArg = norwegianSoccerService._parseAltOmFotballHtmlTable.bind(undefined, undefined);
            expect(noArg).to.throw(Error, 'Argument is missing - cannot parse');

            var emptyArg = norwegianSoccerService._parseAltOmFotballHtmlTable.bind(undefined, '');
            expect(emptyArg).to.throw(Error, 'Argument is missing - cannot parse');
        });


        it('should throw error if not invoked with a string argument', function () {
            var noArg = norwegianSoccerService._parseAltOmFotballHtmlTable.bind(undefined, {});
            expect(noArg).to.throw(Error, 'Argument is not a string - cannot parse');
        });


        it('should return empty array if invoked with an no-content argument', function () {
            var eliteserieTable = norwegianSoccerService._parseAltOmFotballHtmlTable('  ');
            expect(eliteserieTable).to.be.an.array;
            expect(eliteserieTable).to.be.empty;

            eliteserieTable = norwegianSoccerService._parseAltOmFotballHtmlTable('Yo Man!');
            expect(eliteserieTable).to.be.an.array;
            expect(eliteserieTable).to.be.empty;
        });


        it('should parse www.altomfotball.no HTML table', function () {
            var altOmFotballHtmlTable = '' +
                    '<table class="sd_table sd_sortable sd_sortabletable" id="sd_table_1" cellpadding="0" cellspacing="0" border="0" summary="Tabell">' +
                    '  <thead>' +
                    '    <tr>' +
                    '      <th class="sd_table_rank"><span>&nbsp;</span></th>' +
                    '      <th class="sd_table_team"><span>Lag</span></th>' +
                    '      <th title="Kamper"><span>K</span></th>' +
                    '      <th title="Vunnet"><span>V</span></th>' +
                    '      <th title="Uavgjorte"><span>U</span></th>' +
                    '      <th title="Tapte"><span>T</span></th>' +
                    '      <th title="Mål for"><span>+</span></th>' +
                    '      <th title="Mål mot"><span>-</span></th>' +
                    '      <th title="Målforskjell"><span>+/-</span></th>' +
                    '      <th class="sd_table_points" title="Poeng"><span>P</span></th>' +
                    '      <th class="sd_left">Siste Kamper</th>' +
                    '    </tr>' +
                    '  </thead>' +
                    '  <tbody>' +
                    '    <tr class="sd_table_up sd_odd">' +
                    '      <td class="sd_table_new">1.</td>' +
                    '      <td class="sd_table_team"><a href="element.do?cmd=team&amp;teamId=307&amp;tournamentId=1&amp;useFullUrl=false">Bodø/Glimt</a></td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td class="sd_table_points">0</td>' +
                    '      <td class="sd_left" style="padding-right: 0;"></td>' +
                    '    </tr>' +
                    '    <tr class="sd_table_none sd_even">' +
                    '      <td class="sd_table_new">2.</td>' +
                    '      <td class="sd_table_team"><a href="element.do?cmd=team&amp;teamId=302&amp;tournamentId=1&amp;useFullUrl=false">Brann</a></td>' +
                    '      <td>2</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td class="sd_table_points">0</td>' +
                    '      <td class="sd_left" style="padding-right: 0;"></td>' +
                    '    </tr>' +
                    '    <tr class="sd_table_none sd_odd">' +
                    '      <td class="sd_table_new">3.</td>' +
                    '      <td class="sd_table_team"><a href="element.do?cmd=team&amp;teamId=306&amp;tournamentId=1&amp;useFullUrl=false">Haugesund</a></td>' +
                    '      <td>1</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td>0</td>' +
                    '      <td class="sd_table_points">0</td>' +
                    '      <td class="sd_left" style="padding-right: 0;"></td>' +
                    '    </tr>' +
                    '  </tbody>' +
                    '</table>',

                eliteserieTable = norwegianSoccerService._parseAltOmFotballHtmlTable(altOmFotballHtmlTable);

            expect(eliteserieTable).to.be.an.array;
            expect(eliteserieTable.length).to.equal(3);

            expect(eliteserieTable[0]).to.be.an.instanceOf(TeamPlacement);
            expect(eliteserieTable[1]).to.be.an.instanceOf(TeamPlacement);
            expect(eliteserieTable[2]).to.be.an.instanceOf(TeamPlacement);

            expect(eliteserieTable[0].no).to.equal(1);
            expect(eliteserieTable[1].no).to.equal(2);
            expect(eliteserieTable[2].no).to.equal(3);

            expect(eliteserieTable[0].name).to.equal('Bodø/Glimt');
            expect(eliteserieTable[1].name).to.equal('Brann');
            expect(eliteserieTable[2].name).to.equal('Haugesund');

            expect(eliteserieTable[0].matches).to.equal('0');
            expect(eliteserieTable[1].matches).to.equal('2');
            expect(eliteserieTable[2].matches).to.equal('1');
        });
    });


    describe('parseEliteserieTopScorerTable', function () {
        it('should exist as a function', function () {
            expect(norwegianSoccerService._parseEliteserieTopScorerTable).to.exist;
            expect(R.is(Function, norwegianSoccerService._parseEliteserieTopScorerTable)).to.be.true;
        });


        it('should throw error if invoked with no argument', function () {
            expect(norwegianSoccerService._parseEliteserieTopScorerTable).to.throw(Error, 'Argument is missing - cannot parse');

            var noArg = norwegianSoccerService._parseEliteserieTopScorerTable.bind(undefined, undefined);
            expect(noArg).to.throw(Error, 'Argument is missing - cannot parse');

            var emptyArg = norwegianSoccerService._parseEliteserieTopScorerTable.bind(undefined, '');
            expect(emptyArg).to.throw(Error, 'Argument is missing - cannot parse');
        });


        it('should throw error if not invoked with a string argument', function () {
            var noArg = norwegianSoccerService._parseEliteserieTopScorerTable.bind(undefined, {});
            expect(noArg).to.throw(Error, 'Argument is not a string - cannot parse');
        });


        it('should return empty array if invoked with an no-content argument', function () {
            var eliteserieTable = norwegianSoccerService._parseEliteserieTopScorerTable('  ');
            expect(eliteserieTable).to.be.an.array;
            expect(eliteserieTable).to.be.empty;

            eliteserieTable = norwegianSoccerService._parseEliteserieTopScorerTable('Yo Man!');
            expect(eliteserieTable).to.be.an.array;
            expect(eliteserieTable).to.be.empty;
        });


        it('should parse www.altomfotball.no top-scorer HTML table, empty version', function () {
            var altOmFotballHtmlTopScorerTableByAjax = '' +
                    '<table class="sd_table sd_sortable" border="0" cellpadding="0" cellspacing="0" summary="Statistikk">' +
                    '  <thead>' +
                    '    <tr>' +
                    '      <th width="5%"><span>Nr.</span></th>' +
                    '      <th class="sd_table_player"><span>Spiller</span></th>' +
                    '      <th class="sd_left"><span>Lag</span></th>' +
                    '      <th width="10%"><span>Mål</span></th>' +
                    '    </tr>' +
                    '  </thead>' +
                    '  <tbody></tbody>' +
                    '</table>',

                eliteserieTopScorers = norwegianSoccerService._parseEliteserieTopScorerTable(altOmFotballHtmlTopScorerTableByAjax);

            expect(eliteserieTopScorers).to.be.an.array;
            expect(eliteserieTopScorers.length).is.empty;
        });


        it('should parse www.altomfotball.no top-scorer HTML table', function () {
            var altOmFotballHtmlTopScorerTableByAjax = '' +
                    '<table class="sd_table sd_sortable" border="0" cellpadding="0" cellspacing="0" summary="Statistikk">' +
                    '  <thead>' +
                    '    <tr>' +
                    '      <th width="5%"><span>Nr.</span></th>' +
                    '      <th class="sd_table_player"><span>Spiller</span></th>' +
                    '      <th class="sd_left"><span>Lag</span></th>' +
                    '      <th width="10%"><span>Mål</span></th>' +
                        //'      <th width="10%"><span>Kamper</span></th>' +
                        //'      <th width="10%"><span>Snitt</span></th>' +
                    '    </tr>' +
                    '  </thead>' +
                    '  <tbody>' +
                    '    <tr class="sd_odd">' +
                    '      <td>1.</td>' +
                    '      <td class="sd_table_player"><a href="element.do?cmd=player&amp;personId=193071&amp;tournamentId=1&amp;seasonId=337&amp;teamId=313&amp;seasonId=337&amp;useFullUrl=false" class="link">Alexander&nbsp;Søderlund</a></td>' +
                    '      <td class="sd_left"><a href="element.do?cmd=tournamentStatistics&amp;teamId=313&amp;tournamentId=1&amp;seasonId=337&amp;useFullUrl=false">Rosenborg</a></td>' +
                    '      <td>22</td>' +
                        //'      <td>27</td>' +
                        //'      <td>0,81</td>' +
                    '    </tr>' +
                    '    <tr class="sd_even">' +
                    '      <td>2.</td>' +
                    '      <td class="sd_table_player"><a href="element.do?cmd=player&amp;personId=206162&amp;tournamentId=1&amp;seasonId=337&amp;teamId=312&amp;seasonId=337&amp;useFullUrl=false" class="link">Adama&nbsp;Diomande</a></td>' +
                    '      <td class="sd_left"><a href="element.do?cmd=tournamentStatistics&amp;teamId=312&amp;tournamentId=1&amp;seasonId=337&amp;useFullUrl=false">Stabæk</a></td>' +
                    '      <td>17</td>' +
                        //'      <td>21</td>' +
                        //'      <td>0,81</td>' +
                    '    </tr>' +
                    '  </tbody>' +
                    '</table>',

                eliteserieTopScorers = norwegianSoccerService._parseEliteserieTopScorerTable(altOmFotballHtmlTopScorerTableByAjax);

            expect(eliteserieTopScorers).to.be.an.array;
            expect(eliteserieTopScorers.length).to.equal(1);
            expect(eliteserieTopScorers[0]).to.equal('Alexander Søderlund');
        });
    });


    describe('isEnabled', function () {
        it('should exist as a function', function () {
            expect(norwegianSoccerService.isEnabled).to.exist;
            expect(R.is(Function, norwegianSoccerService.isEnabled)).to.be.true;
        });
    });


    describe('isValid', function () {
        it('should exist as a function', function () {
            expect(norwegianSoccerService.isValid).to.exist;
            expect(R.is(Function, norwegianSoccerService.isValid)).to.be.true;
        });
    });
});
