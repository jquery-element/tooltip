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
	cssReset = { display: "inline-block", width: "auto", left: 0, top: 0 }
;

function hideTooltip() {
	jqTooltip.addClass( "hidden" );
}

hideTooltip();

$( function() {
	jqTooltip.appendTo( "body" );
});

function showTooltip() {
	var
		scrW = jqWindow.width(),
		elW = this.outerWidth(),
		elH = this.outerHeight(),
		elPos = this.offset(),
		x, x2,
		y
	;

	jqTooltip.css( cssReset );
	jqTooltipContent.html( this.data( "tooltipContent" ) );

	var
		w = jqTooltip.width(),
		oW = jqTooltip.outerWidth(),
		oH = jqTooltip.outerHeight()
	;

	x = elPos.left - oW / 2 + elW / 2;
	y = elPos.top  - oH - 15;
	x2 = Math.min( Math.max( 0, x ), scrW - oW );

	jqTooltipArrow
		.css( "left", ( 50 - ( x2 - x ) / oW * 100 ) + "%" )
	;

	jqTooltip
		.css( {
			display : "block",
			width : w,
			left : x2,
			top : y
		})
		.removeClass( "hidden" )
	;
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
		.tooltip.hidden {\
			visibility: hidden;\
			opacity: 0;\
		}\
		.tooltip-content {\
			position: relative;\
			cursor: default;\
		}\
		.tooltip-arrow {\
			position: absolute;\
			top: 100%;\
			left: 50%;\
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
