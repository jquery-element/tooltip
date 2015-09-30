/*
	tooltip - 1.0.0
	https://github.com/jquery-element/tooltip
*/

(function() {

"use strict";

var
	jqDocument = $( document ),
	jqTooltip = $( "<span class='tooltip tooltip-top'>" ),
	jqTooltipArrow = $( "<div class='tooltip-arrow'>" ).appendTo( jqTooltip ),
	jqTooltipContent = $( "<div class='tooltip-content'>" ).appendTo( jqTooltip ),
	jqTooltip00 = jqTooltip.clone(),
	jqTooltip00Content = jqTooltip00.find( ".tooltip-content" ),

	elementX,
	elementY,
	mouseX,
	mouseY,
	tooltipX,
	tooltipY,
	tooltipW,
	tooltipH,

	isHidden = true,
	arrowSize,
	margin = 15,
	currContent,
	currSide = "top",
	cssPosReset = { top: "auto", right: "auto", bottom: "auto", left: "auto" },
	hidingDuration = 0,
	timeoutIdHidding,
	intervalIdWatchContent
;

function showTooltip( jqEl, e ) {
	e = e.originalEvent;
	clearTimeout( timeoutIdHidding );

	var
		isFollow = isFollowingMouse( jqEl ),
		offset = jqEl.offset()
	;

	elementX = offset.left;
	elementY = offset.top;
	mouseX = isFollow ? e.pageX - elementX : jqEl.outerWidth() / 2;
	mouseY = isFollow ? e.pageY - elementY : jqEl.outerHeight() / 2;

	function up() {
		var content = getContent( jqEl );
		if ( content && content !== currContent ) {
			update( jqEl );
		}
	}

	up();
	intervalIdWatchContent = setInterval( up, 100 );
}

function hideTooltip() {
	clearTimeout( intervalIdWatchContent );
	jqTooltip.addClass( "tooltip-hiding" );
	isHidden = true;
	currContent = "";
	timeoutIdHidding = setTimeout( function() {
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
	arrowSize = jqTooltipArrow.outerWidth() / 2 + 1;
	hidingDuration = 1000 * parseFloat( jqTooltip.css( "transition-duration" ) );
});

function getContent( jqElem ) {
	return jqElem[ 0 ].dataset[ "tooltipContent" ] || "";
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
		value,
		scr
	;

	tooltipX = x += elementX;
	tooltipY = y += elementY;

	if ( currSide === "top" || currSide === "bottom" ) {
		prop = "left";
		scr = jqDocument.width();
		x = Math.min( Math.max( 0, x ), scr - tooltipW );
		value = Math.min(
			tooltipX + tooltipW / 2,
			scr - arrowSize
		) - x;
	} else {
		prop = "top";
		scr = jqDocument.height();
		y = Math.min( Math.max( 0, y ), scr - tooltipH );
		value = Math.min(
			tooltipY + tooltipH / 2,
			scr - arrowSize
		) - y;
	}

	jqTooltipArrow.css( prop, value );
	jqTooltip
		.css( {
			left : x,
			top : y
		})
	;
}

function update( jqEl ) {
	var
		cnt = getContent( jqEl ),
		contentChanged = cnt !== currContent,
		side = getSide( jqEl ),
		isFollow = isFollowingMouse( jqEl ),
		x,
		y
	;

	if ( isHidden ) {
		isHidden = false;
		jqTooltip.removeClass( "tooltip-hiding tooltip-hidden" );
	}

	if ( contentChanged ) {
		jqTooltip00Content.html( currContent = cnt );
		tooltipW = jqTooltip00.outerWidth();
		tooltipH = jqTooltip00.outerHeight();
	}

	if ( side !== currSide ) {
		jqTooltip
			.removeClass( "tooltip-" + currSide )
			.addClass( "tooltip-" + side )
		;
		jqTooltipArrow.css( cssPosReset );
		currSide = side;
	}

	if ( side === "top" || side === "bottom" ) {
		x = mouseX - tooltipW / 2;
		y = side === "top"
			? -margin - tooltipH
			: margin + jqEl.outerHeight()
		;
	} else {
		y = mouseY - tooltipH / 2;
		x = side === "left"
			? -margin - tooltipW
			: margin + jqEl.outerWidth()
		;
	}

	positionTooltip( x, y );

	if ( contentChanged ) {
		jqTooltipContent.html( currContent );
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
			.mouseenter( showTooltip.bind( null, jqEl ) )
			.mouseleave( hideTooltip )
			.mousemove( function( e ) {
				if ( isFollowingMouse( jqEl ) ) {
					e = e.originalEvent;
					mouseX = e.pageX - elementX;
					mouseY = e.pageY - elementY;
					update( jqEl, e )
				}
			})
		;
	}
});

})();
