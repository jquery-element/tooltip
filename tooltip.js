/*
	tooltip - 1.0.1
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
	jqElementCurrent,

	elementX,
	elementY,
	mouseX,
	mouseY,
	tooltipX,
	tooltipY,
	tooltipW,
	tooltipH,

	mutation = new MutationObserver( update ),
	mutationConfig = { attributes: true, attributeFilter: [ "data-tooltip-content" ] },
	isHidden = true,
	arrowSize,
	margin = 15,
	currContent,
	currSide = "top",
	cssPosReset = { top: "auto", right: "auto", bottom: "auto", left: "auto" },
	hidingDuration = 0,
	timeoutIdHidding
;

function showTooltip( jqEl, e ) {
	e = e.originalEvent;
	jqElementCurrent = jqEl;
	clearTimeout( timeoutIdHidding );

	var
		isFollow = isFollowingMouse(),
		offset = jqEl.offset(),
		content = getContent()
	;

	mutation.observe( jqEl[ 0 ], mutationConfig );
	elementX = offset.left;
	elementY = offset.top;
	mouseX = isFollow ? e.pageX - elementX : jqEl.outerWidth() / 2;
	mouseY = isFollow ? e.pageY - elementY : jqEl.outerHeight() / 2;

	if ( content && content !== currContent ) {
		update();
	}
}

function hideTooltip() {
	mutation.disconnect();
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

function getContent() {
	return jqElementCurrent[ 0 ].dataset[ "tooltipContent" ] || "";
}

function isFollowingMouse() {
	var b = jqElementCurrent[ 0 ].dataset[ "tooltipFollowmouse" ];
	return b != null && b.toLowerCase() !== "false";
}

function getSide() {
	var s = jqElementCurrent[ 0 ].dataset[ "tooltipSide" ];
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

function update() {
	var
		cnt = getContent(),
		contentChanged = cnt !== currContent,
		side = getSide(),
		isFollow = isFollowingMouse(),
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
			: margin + jqElementCurrent.outerHeight()
		;
	} else {
		y = mouseY - tooltipH / 2;
		x = side === "left"
			? -margin - tooltipW
			: margin + jqElementCurrent.outerWidth()
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
			.mouseenter( showTooltip.bind( null, this.jqElement ) )
			.mouseleave( hideTooltip )
			.mousemove( function( e ) {
				if ( isFollowingMouse() ) {
					e = e.originalEvent;
					mouseX = e.pageX - elementX;
					mouseY = e.pageY - elementY;
					update();
				}
			})
		;
	}
});

})();
