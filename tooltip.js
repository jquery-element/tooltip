/*
	tooltip - 1.0.0
	https://github.com/jquery-element/tooltip
*/

(function() {

"use strict";

var
	jqWindow = $( window ),
	jqTooltip = $( "<span class='tooltip tooltip-top'>" ),
	jqTooltipArrow = $( "<div class='tooltip-arrow'>" ).appendTo( jqTooltip ),
	jqTooltipContent = $( "<div class='tooltip-content'>" ).appendTo( jqTooltip ),
	jqTooltip00 = jqTooltip.clone(),
	jqTooltip00Content = jqTooltip00.find( ".tooltip-content" ),

	elementX,
	elementY,
	tooltipX,
	tooltipY,
	tooltipW,
	tooltipH,

	margin = 15,
	currSide = "top",
	cssPosReset = { top: "auto", right: "auto", bottom: "auto", left: "auto" },
	cssPosReset00 = { top: 0, left: 0 },
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
	var c = jqElem[ 0 ].dataset[ "tooltipContentFunction" ];
	return c
		? window[ c ].call( jqElem )
		: jqElem[ 0 ].dataset[ "tooltipContentString" ]
	;
}

function isFollowingMouse( jqEl ) {
	var b = jqEl[ 0 ].dataset[ "tooltipFollowmouse" ];
	return b != null && b.toLowerCase() !== "false";
}

function getSide( jqEl ) {
	var s = jqEl[ 0 ].dataset[ "tooltipSide" ];
	return s && s.toLowerCase() || "top";
}

function positionTooltip( x, y ) {
	var
		prop,
		value
	;

	tooltipX = x;
	tooltipY = y;

	if ( currSide === "top" || currSide === "bottom" ) {
		prop = "left";
		x = Math.min( Math.max( 0, x ), jqWindow.width() - tooltipW );
		value = ( x - tooltipX ) / tooltipW;
	} else {
		prop = "top";
		y = Math.min( Math.max( 0, y ), jqWindow.height() - tooltipH );
		value = ( y - tooltipY ) / tooltipH;
	}

	jqTooltipArrow.css(
		prop,
		( 50 - value * 100 ) + "%"
	);
	jqTooltip
		.css( {
			left : x,
			top : y
		})
	;
}

function positionByOffset( jqEl, offsetX, offsetY ) {
	var
		content = getContent( jqEl ),
		x = elementX,
		y = elementY,
		side = getSide( jqEl )
	;

	jqTooltip00Content.html( content );
	tooltipW = jqTooltip00.outerWidth();
	tooltipH = jqTooltip00.outerHeight();

	if ( currSide !== side ) {
		jqTooltip
			.removeClass( "tooltip-" + currSide )
			.addClass( "tooltip-" + side )
		;
		jqTooltipArrow.css( cssPosReset );
		currSide = side;
	}

	if ( side === "top" || side === "bottom" ) {
		x += offsetX - tooltipW / 2;
		if ( side === "top" ) {
			y -= margin + tooltipH;
		} else {
			y += margin + jqEl.outerHeight();
		}
	} else {
		y += offsetY - tooltipH / 2;
		if ( side === "left" ) {
			x -= margin + tooltipW;
		} else {
			x += margin + jqEl.outerWidth();
		}
	}

	positionTooltip( x, y );
	jqTooltipContent.html( content );
}

function showTooltip( e ) {
	if ( getContent( this ) ) {
		e = e.originalEvent;
		clearTimeout( timeoutId );
		jqTooltip.css( cssPosReset00 );
		var
			offset = this.offset(),
			isFollow = isFollowingMouse( this )
		;
		elementX = offset.left;
		elementY = offset.top;
		positionByOffset( this,
			isFollow ? e.offsetX : this.outerWidth() / 2,
			isFollow ? e.offsetY : this.outerHeight() / 2
		);
		jqTooltip.removeClass( "tooltip-hiding tooltip-hidden" );
	}
}

jQuery.element({
	name: "tooltip",
	css: "\
		.tooltip {\
			position: absolute;\
			z-index: 2147483647;\
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
			width: 8px;\
			height: 8px;\
			margin: -4px;\
			transform: rotate( 45deg );\
			background: inherit;\
		}\
		.tooltip-top    .tooltip-arrow { top    : 100% !important; }\
		.tooltip-bottom .tooltip-arrow { bottom : 100% !important; }\
		.tooltip-left   .tooltip-arrow { left   : 100% !important; }\
		.tooltip-right  .tooltip-arrow { right  : 100% !important; }\
	",
	init: function() {
		var
			jqEl = this.jqElement
		;
		jqEl
			.mouseenter( showTooltip.bind( jqEl ) )
			.mouseleave( hideTooltip )
			.mousemove( function( e ) {
				if ( isFollowingMouse( jqEl ) ) {
					e = e.originalEvent;
					return positionByOffset( jqEl,
						e.offsetX,
						e.offsetY
					);
				}
			})
		;
	}
});

})();
