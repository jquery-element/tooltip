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

	tooltipX,
	tooltipY,
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

function getFollowDir( jqEl ) {
	var d = jqEl.data( "tooltipFollowMouse" );
	return d && d.toLowerCase();
}

function updateDimensions( jqEl ) {
	var
		content = getContent( jqEl )
	;
	jqTooltip00Content.html( content );
	tooltipW = jqTooltip00.outerWidth();
	tooltipH = jqTooltip00.outerHeight();
}

function positionTooltip( x, y ) {
	var
		scrW = jqWindow.width(),
		x2 = Math.min( Math.max( 0, x ), scrW - tooltipW )
	;
	tooltipX = x;
	tooltipY = y;
	jqTooltipArrow
		.css( "left", ( 50 - ( x2 - x ) / tooltipW * 100 ) + "%" )
	;
	jqTooltip
		.css( {
			left : x2,
			top : y
		})
	;
}

function positionTooltipCenter( jqEl ) {

}

function moveTooltip( e ) {
	e = e.originalEvent;
	switch ( getFollowDir( this ) ) {
		case "x": return positionTooltip( tooltipX + e.movementX, tooltipY );
		case "y": return positionTooltip( tooltipX, tooltipY + e.movementY );
	}
}

function showTooltip( e ) {
	e = e.originalEvent;
	var content = getContent( this );
	if ( content ) {
		clearTimeout( timeoutId );
		jqTooltip.css( cssPosReset );
		updateDimensions( this );

		var
			elPos = this.offset(),
			x = elPos.left - tooltipW / 2,
			y = elPos.top - tooltipH - 15
		;
		switch ( getFollowDir( this ) ) {
			case "x":
				x += e.offsetX;
				break;
			case "y":
				y += e.offsetY;
				break;
			default:
				x += this.outerWidth() / 2;
		}
		positionTooltip( x, y );

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
		var
			jqEl = this.jqElement
		;
		jqEl
			.mouseenter( showTooltip.bind( jqEl ) )
			.mouseleave( hideTooltip )
			.mousemove( moveTooltip.bind( jqEl ) )
		;
	}
});

})();
