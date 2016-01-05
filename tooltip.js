/*
	tooltip - 1.1.1
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
	jqElCurr,

	elementX,
	elementY,
	mouseElemX,
	mouseElemY,
	mousePageX,
	mousePageY,
	tooltipX,
	tooltipY,
	tooltipW,
	tooltipH,

	mutation = new MutationObserver( update ),
	mutationConfig = {
		attributes: true,
		attributeFilter: [
			"data-tooltip-content",
			"data-tooltip-followmouse",
			"data-tooltip-side"
		]
	},
	isHidden,
	arrowSize,
	margin = 15,
	currContent,
	currIsFollow,
	currSide,
	cssPosReset = { top: "auto", right: "auto", bottom: "auto", left: "auto" },
	hidingDuration = 0,
	timeoutIdHidding
;

function showTooltip() {
	if ( isHidden ) {
		isHidden = false;
		clearTimeout( timeoutIdHidding );
		jqTooltip.removeClass( "tooltip-hiding tooltip-hidden" );
	}
}

function hideTooltip() {
	if ( !isHidden ) {
		isHidden = true;
		currContent = "";
		jqTooltip.addClass( "tooltip-hiding" );
		timeoutIdHidding = setTimeout( function() {
			jqTooltip.addClass( "tooltip-hidden" );
		}, hidingDuration );
	}
}

function mouseEnter( jqEl, e ) {
	jqElCurr = jqEl;
	mutation.observe( jqEl[ 0 ], mutationConfig );
	var content = getContent();
	if ( content && content !== currContent ) {
		showTooltip();
		update( e );
	}
}

function mouseLeave() {
	mutation.disconnect();
	hideTooltip();
	currIsFollow = undefined;
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

function getContent() {
	return jqElCurr[ 0 ].dataset[ "tooltipContent" ] || "";
}

function isFollowingMouse() {
	var b = jqElCurr[ 0 ].dataset[ "tooltipFollowmouse" ];
	return b != null && b.toLowerCase() !== "false";
}

function getSide() {
	var s = jqElCurr[ 0 ].dataset[ "tooltipSide" ];
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
		scr = jqWindow.width();
		x = Math.min( Math.max( 0, x ), scr - tooltipW );
		value = Math.min(
			tooltipX + tooltipW / 2,
			scr - arrowSize
		) - x;
	} else {
		prop = "top";
		scr = jqWindow.height();
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

function update() {
	var
		cnt = getContent(),
		contentChanged = cnt !== currContent,
		side = getSide(),
		isFollow = isFollowingMouse(),
		offset,
		x,
		y
	;

	if ( !cnt ) {
		hideTooltip();
		return;
	}

	showTooltip();
	if ( isFollow !== currIsFollow ) {
		currIsFollow = isFollow;
		if ( !isFollow ) {
			mouseElemX = jqElCurr.outerWidth() / 2;
			mouseElemY = jqElCurr.outerHeight() / 2;
		}
	}

	offset = jqElCurr.offset();
	elementX = offset.left;
	elementY = offset.top;
	if ( isFollow ) {
		mouseElemX = mousePageX - elementX;
		mouseElemY = mousePageY - elementY;
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
		x = mouseElemX - tooltipW / 2;
		y = side === "top"
			? -margin - tooltipH
			: margin + jqElCurr.outerHeight()
		;
	} else {
		y = mouseElemY - tooltipH / 2;
		x = side === "left"
			? -margin - tooltipW
			: margin + jqElCurr.outerWidth()
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
		this.jqElement
			.mouseenter( mouseEnter.bind( null, this.jqElement ) )
			.mouseleave( mouseLeave )
			.mousemove( function( e ) {
				e = e.originalEvent;
				mousePageX = e.pageX;
				mousePageY = e.pageY;
				if ( isFollowingMouse() ) {
					update();
				}
			})
		;
	}
});

})();
