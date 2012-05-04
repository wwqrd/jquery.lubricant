;(function ( $, window, undefined ) {
    
    var pluginName = 'lubricant',
        document = window.document,
        defaults = {
            'depth': 1,
            'x' : true,
            'y': true,
            'effect': 'parallax',
            'zOffset': 1000
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
        this.marginLeft = $(this.element).css('marginLeft');
        this.marginTop = $(this.element).css('marginTop');
        this.origin = $(this.element).offset();

        $(window).bind('scroll',function(e) {
            self.positionElements(e);
        });

        $(window).bind('resize',function(e) {
            self.updateViewSettings();
            self.positionElements(e);
        });

        this.updateViewSettings();

        $(this.element).css({'zIndex': Math.round(this.options['zOffset'] + this.options['depth']*1000)})
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
        var distanceFromCentre = {};
        distanceFromCentre.x = this.origin.left - $(window).scrollLeft() - (this.view.width-this.height)/2;
        distanceFromCentre.y = this.origin.top - $(window).scrollTop() - (this.view.height-this.width)/2;

        var difference = {};
        difference.x = distanceFromCentre.x/this.maxDistance.x;
        difference.y = distanceFromCentre.y/this.maxDistance.y;

        var j,
            k = (this.options['depth']-1);

        switch(this.options['effect']) {
            case 'quadratic':
                j = k * k;
                break;
            case 'inverted':
                j = -k;
                break;
            case 'parallax':
            default:
                j = k;
                
        }

        var offset = {};
        offset.top = difference.y*j*this.maxDistance.y;
        offset.left = difference.x*j*this.maxDistance.x;
        
        return offset;
    };

    Plugin.prototype.positionElements = function(e) {
        var offset = this.getOffset();

        if(!this.options['x']) { 
            offset.left = this.marginLeft;
        }
        if(!this.options['y']) {
            offset.top = this.marginTop;
        }

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