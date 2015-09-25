/*
	tooltip - 1.0.0
	https://github.com/jquery-element/tooltip
*/

function lg(s) {console.log(s)}

(function() {

var
	jqWindow = $( window ),
	jqTooltip = $( "<span class='tooltip'>" ),
	jqTooltipArrow = $( "<div class='tooltip-arrow'>" ).appendTo( jqTooltip ),
	jqTooltipContent = $( "<div class='tooltip-content'>" ).appendTo( jqTooltip ),

	cssPosReset = { left: 0, top: 0 },
	hidingDuration = 200,
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
});

function showTooltip() {
	content = this.data( "tooltipContentFunction" );
	content = content
		? window[ content ]()
		: this.data( "tooltipContentString" )
	;

	if ( content ) {
		clearTimeout( timeoutId );
		jqTooltip.css( cssPosReset );
		jqTooltipContent.html( content );

		var
			content,
			scrW = jqWindow.width(),
			elW = this.outerWidth(),
			elPos = this.offset(),
			oW = jqTooltip.outerWidth(),
			oH = jqTooltip.outerHeight(),
			x, x2,
			y
		;

		x = elPos.left - oW / 2 + elW / 2;
		y = elPos.top  - oH - 15;
		x2 = Math.min( Math.max( 0, x ), scrW - oW );

		jqTooltipArrow
			.css( "left", ( 50 - ( x2 - x ) / oW * 100 ) + "%" )
		;
		jqTooltip
			.css( {
				left : x2,
				top : y
			})
			.removeClass( "tooltip-hiding tooltip-hidden" )
		;
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
