;(function ( $, window, undefined ) {
    
    var pluginName = 'lubricant',
        document = window.document,
        defaults = {
            depth: 1,
            scrollX : true,
            scrollY: true,
            tween: 'parallax',
            zOffset: 1000
        };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
 
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    Plugin.prototype.init = function () {
        var self = this;

        this.width = $(this.element).width();
        this.height = $(this.element).height();
        this.origin = $(this.element).offset();

        $(window).bind('scroll',function(e) {
            self.positionElements(e);
        });

        $(window).bind('resize',function(e) {
            self.updateViewSettings();
            self.positionElements(e);
        });

        this.updateViewSettings();

        $(this.element).css({'zIndex': Math.round(this.options.zOffset + this.options.depth*1000)})
    };

    Plugin.prototype.updateViewSettings = function() {
        this.view = {
            'width': $(window).width(),
            'height': $(window).height()
        };
        this.maxDistance = {
            'x': (this.view.width/2)+this.width*0.5,
            'y': (this.view.height/2)+this.height*0.5
        };
    };

    Plugin.prototype.getOffset = function() {
        var distanceFromCentre = {
            'x': this.origin.left - $(window).scrollLeft() - (this.view.width-this.height)/2,
            'y': this.origin.top - $(window).scrollTop() - (this.view.height-this.width)/2
        };

        var difference = {
            'x': distanceFromCentre.x/this.maxDistance.x,
            'y': distanceFromCentre.y/this.maxDistance.y
        };

        switch(this.options.tween) {
            case 'parallax':
            default:
                var offset = {
                    'top': difference.y*(this.options.depth-1)*this.maxDistance.y,
                    'left': difference.x*(this.options.depth-1)*this.maxDistance.x
                };
        }
        
        return offset;
    };

    Plugin.prototype.positionElements = function(e) {
        var offset = this.getOffset();

        $(this.element).css({
            'marginTop': offset.top,
            'marginLeft': offset.left
        });
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

}(jQuery, window));