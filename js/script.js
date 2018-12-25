$(document).ready(function ($) {
	console.log("script domready");
	"use strict";	
	////	Hidder Header	
	var headerEle = function () {
		var $headerHeight = $('header').height();
		$('.hidden-header').css({ 'height' : $headerHeight  + "px" });
	};
	
	$(window).load(function () {
	    headerEle();
	});
	
	$(window).resize(function () {
	    headerEle();
	});

	
    var offset = 200;
    var duration = 500;
    $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
            $('.back-to-top').fadeIn(400);
        } else {
            $('.back-to-top').fadeOut(400);
        }
    });
    $('.back-to-top').click(function(event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 600);
        return false;
    });

	
	
	/*----------------------------------------------------*/
	/*	Sticky Header
	/*----------------------------------------------------*/
	
	(function() {
		
		var docElem = document.documentElement,
			didScroll = false,
			changeHeaderOn = 100;
			document.querySelector( 'header' );
			
		function init() {
			window.addEventListener( 'scroll', function() {
				if( !didScroll ) {
					didScroll = true;
					setTimeout( scrollPage, 250 );
				}
			}, false );
		}
		
		function scrollPage() {
			var sy = scrollY();
			if ( sy >= changeHeaderOn ) {
				$('.top-bar').slideUp(300);
				$("header").addClass("fixed-header");
				$('.navbar-brand').css({ 'padding-top' : 19 + "px", 'padding-bottom' : 19 + "px" });
				
				if (/iPhone|iPod|BlackBerry/i.test(navigator.userAgent) || $(window).width() < 479 ){
					$('.navbar-default .navbar-nav > li > a').css({ 'padding-top' : 0 + "px", 'padding-bottom' : 0 + "px" })
				}else{
					$('.navbar-default .navbar-nav > li > a').css({ 'padding-top' : 20 + "px", 'padding-bottom' : 20 + "px" })
					$('.search-side').css({ 'margin-top' : -7 + "px" });
				};
				
			}
			else {
				$('.top-bar').slideDown(300);
				$("header").removeClass("fixed-header");
				$('.navbar-brand').css({ 'padding-top' : 27 + "px", 'padding-bottom' : 27 + "px" });
				
				if (/iPhone|iPod|BlackBerry/i.test(navigator.userAgent) || $(window).width() < 479 ){
					$('.navbar-default .navbar-nav > li > a').css({ 'padding-top' : 0 + "px", 'padding-bottom' : 0 + "px" })
				}else{
					$('.navbar-default .navbar-nav > li > a').css({ 'padding-top' : 28 + "px", 'padding-bottom' : 28 + "px" })
					$('.search-side').css({ 'margin-top' : 0  + "px" });
				};
				
			}
			didScroll = false;
		}
		
		function scrollY() {
			return window.pageYOffset || docElem.scrollTop;
		}
		
		init();
		var initNav = function(){
			/**
			 * Navigation Menu
			 */
			document.getElementById("main-nav-mobile").innerHTML = document.getElementById("main-nav").innerHTML;
			/*----------------------------------------------------*/
			/*	Nav Menu & Search
			/*----------------------------------------------------*/
			
			// $(".nav > li:has(ul)").addClass("drop");
			// $(".nav > li.drop > ul").addClass("dropdown");
			// $(".nav > li.drop > ul.dropdown ul").addClass("sup-dropdown");
			
			// $('.show-search').click(function() {
			// 	$('.search-form').fadeIn(300);
			// 	$('.search-form input').focus();
			// });
			// $('.search-form input').blur(function() {
			// 	$('.search-form').fadeOut(300);
			// });
			/**
			 * Slick Nav 
			 */
			 // debugger;
			 console.log("init slicknav");
			// $('.wpb-mobile-menu').slicknav({
			//   prependTo: '.navbar-header',
			//   parentTag: 'margo',
			//   allowParentLinks: true,
			//   duplicate: true,
			//   label: '',
			//   closedSymbol: '<i class="fa fa-angle-right"></i>',
			//   openedSymbol: '<i class="fa fa-angle-down"></i>',
			// });
			$('.wpb-mobile-menu').slicknav({
			  prependTo: '.navbar-header',
			  parentTag: 'margo',
			  allowParentLinks: true,
			  duplicate: false,
			  label: '',
			  closedSymbol: '<i class="fa fa-angle-right"></i>',
			  openedSymbol: '<i class="fa fa-angle-down"></i>',
			});
			// $('#main-nav').slicknav({
			//   prependTo: '.navbar-header',
			//   // parentTag: 'margo',
			//   allowParentLinks: true,
			//   duplicate: true,
			//   label: '',
			//   closedSymbol: '<i class="fa fa-angle-right"></i>',
			//   openedSymbol: '<i class="fa fa-angle-down"></i>',
			// });
			// debugger;
			// $('.wpb-mobile-menu').slicknav();
			headerEle();
		};
		initNav();
		$(".copy-year").text(new Date().getFullYear());
	})();
		/* ----------------- End JS Document ----------------- */
});