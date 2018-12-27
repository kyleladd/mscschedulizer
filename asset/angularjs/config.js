/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({
    baseUrl: '/asset/angularjs/',
    paths: {
        // 'domReady': '../lib/requirejs-domready/domReady',
        'jquery':'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
        'angular':'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min',
        'ngRoute':'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-route.min',
        'ngSanitize':'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-sanitize.min',
        'ngAnimate':'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-animate.min',
        'ngAria':'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-aria.min',
        'ngMessages': 'https://cdnjs.cloudflare.com/ajax/libs/angular-messages/1.6.1/angular-messages.min',
        'ngMaterial':'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.10/angular-material.min',
        'underscore':'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
        'lodash':'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min',
        'ui.router':'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.20/angular-ui-router.min',
        'angular-ui-select':'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.min',
        'lscache': 'https://cdnjs.cloudflare.com/ajax/libs/lscache/1.3.0/lscache.min',
        'node_generic_functions': '/node_modules/node_generic_functions/genericfunctions',
        'moment':'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min',
        'basictable': '/bower_components/basictable/jquery.basictable.min',
        // 'bootstrap':'/asset/js/bootstrap.min',
        'ui.bootstrap':'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.min',
        'jquery.timepicker':'/js/jquery.timepicker',
        'jquery.weekLine':'/js/jquery.weekLine.min',
        'datepair':'/js/datepair.min',
        'jquery.datepair':'/js/jquery.datepair.min',
        'slicknav':'/js/jquery.slicknav',
        'theme':'/js/script',
        'infinite-scroll':'https://cdnjs.cloudflare.com/ajax/libs/ngInfiniteScroll/1.3.0/ng-infinite-scroll.min',
        'fullcalendar':'/bower_components/fullcalendar/dist/fullcalendar.min',
        'ui.calendar':'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-calendar/1.0.0/calendar.min',
        'combinatorics':'/node_modules/js-combinatorics/combinatorics',
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'lscache': {
            deps: [],
            exports: 'lscache'
        },
        'ngMessages': ['angular'],
        'ngAnimate': ['angular'],
        'ngAria': ['angular'],
        'ngMdIcons': ['angular'],
        'ngSanitize': ['angular'],
        'ngMaterial': {
            deps: ['ngAnimate', 'ngAria']
        },
        'mdDataTable':['angular','ngMaterial'],
        'ui.bootstrap': ['angular'],
        'bootstrap': ['jquery'],
        // 'node_generic_functions':{
        //    exports: 'node_generic_functions'
        // },
        // 'mdDataTable': {
        //     deps: ['angular'],
        //     exports: 'mdDataTable'

        // },
        'basictable':['jquery'],
        'ngRoute': ['angular'],
        'ui.router': ['angular'],
        'infinite-scroll': ['angular'],
        'angular-ui-select': ['angular'],
        'jquery.timepicker':['jquery'],
        'jquery.weekLine':['jquery'],
        'datepair':['jquery'],
        'jquery.datepair':['jquery'],
        'slicknav':['jquery'],
        'fullcalendar':['jquery','moment'],
        'ui.calendar': ['angular','fullcalendar'],
        'theme':['jquery','slicknav'],
    },
    // deps: [
    //     './bootstrap'
    // ]
});
