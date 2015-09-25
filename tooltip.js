/*
	tooltip - 1.0.0
	https://github.com/jquery-element/tooltip
*/

(function() {

"use strict";

var
	jqWindow = $( window ),
	jqTooltip = $( "<span class='tooltip'>" ),
	jqTooltipArrow = $( "<div class='tooltip-arrow'>" ).appendTo( jqTooltip ),
	jqTooltipContent = $( "<div class='tooltip-content'>" ).appendTo( jqTooltip ),
	jqTooltip00 = jqTooltip.clone(),
	jqTooltip00Content = jqTooltip00.find( ".tooltip-content" ),

	tooltipLeft,
	tooltipTop,
	tooltipW,
	tooltipH,

	cssPosReset = { left: 0, top: 0 },
	hidingDuration = 0,
	timeoutId
;

function hideTooltip() {
	jqTooltip.addClass( "tooltip-hiding" );
	timeoutId = setTimeout( function() {
		jqTooltip.addClass( "tooltip-hidden" );
	}, hidingDuration );
}

hideTooltip();
$( function() {
	jqTooltip.appendTo( "body" );
	jqTooltip00
		.css( {
			display: "none",
			left: 0,
			top: 0
		})
		.appendTo( "body" )
	;
	hidingDuration = 1000 * parseFloat( jqTooltip.css( "transition-duration" ) );
});

function getContent( jqElem ) {
	var c = jqElem.data( "tooltipContentFunction" );
	return c
		? window[ c ].call( jqElem )
		: jqElem.data( "tooltipContentString" )
	;
}

function updateDimensions( jqEl ) {
	var
		content = getContent( jqEl )
	;
	jqTooltip00Content.html( content );
	tooltipW = jqTooltip00.outerWidth();
	tooltipH = jqTooltip00.outerHeight();
}

function positionToolTip( x, y ) {
	var
		scrW = jqWindow.width(),
		x2 = Math.min( Math.max( 0, x ), scrW - tooltipW )
	;
	jqTooltipArrow
		.css( "left", ( 50 - ( x2 - x ) / tooltipW * 100 ) + "%" )
	;
	jqTooltip
		.css( {
			left : tooltipLeft = x2,
			top  : tooltipTop  = y
		})
	;
}

function positionToolTipCenter( jqEl ) {
	var
		elW = jqEl.outerWidth(),
		elPos = jqEl.offset()
	;
	positionToolTip(
		elPos.left - tooltipW / 2 + elW / 2,
		elPos.top  - tooltipH - 15
	);
}

function showTooltip() {
	var content = getContent( this );
	if ( content ) {
		clearTimeout( timeoutId );
		jqTooltip.css( cssPosReset );
		updateDimensions( this );
		positionToolTipCenter( this );
		jqTooltipContent.html( content );
		jqTooltip.removeClass( "tooltip-hiding tooltip-hidden" );
	}
}

jQuery.element({
	name: "tooltip",
	css: "\
		.tooltip {\
			position: absolute;\
			display: inline-block;\
			padding: 7px 10px;\
			border-radius: 3px;\
			color: #fff;\
			text-align: left;\
			background: rgba( 0, 0, 0, .9 );\
			transition-property: visibility, opacity;\
			transition-duration: .2s;\
		}\
		.tooltip-hiding {\
			opacity: 0;\
		}\
		.tooltip-hidden {\
			display: none;\
		}\
		.tooltip-content {\
			position: relative;\
			cursor: default;\
		}\
		.tooltip-arrow {\
			position: absolute;\
			top: 100%;\
			width: 8px;\
			height: 8px;\
			margin: -4px;\
			transform: rotate( 45deg );\
			background: inherit;\
		}\
	",
	init: function() {
		this.jqElement
			.mouseenter( showTooltip.bind( this.jqElement ) )
			.mouseleave( hideTooltip )
		;
	}
});

})();
