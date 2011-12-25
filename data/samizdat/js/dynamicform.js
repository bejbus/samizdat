/*
 * No license neither copyright.
 * This program is in Public Domain.
 */

;(function($) {

  if (typeof DEVMODE === 'undefined') {
    DEVMODE = true;
  }

  var settings = { max : 10 }, last_index = 1, addbutton, started = false;

  function toggle_button()
  {
    if (settings.max == last_index) addbutton.toggle();
  }

  function add_file_field(target)
  {
    target.unbind();
    if (settings.max != last_index) {
      target.after('<br /><input type="file" name="part_%1" id="f_part_%1" />'.format(++last_index));
      add_handler();
      toggle_button();
    }
  }

  function add_handler()
  {
    $('#f_part_' + last_index).change(function(ev){ add_file_field($(ev.target)); });
  }

  function add_button()
  {
    $('#f_part_1').after(
      '<input type="button" name="addbutton" id="f_addbutton" value="%s" title="%s" />'.sprintf(
        _('Add more...'), _('Add one more field')));

    addbutton = $('#f_addbutton');

    addbutton.click(function(){ add_file_field($('#f_part_' + last_index)); });
  }

  function add_reset_helper()
  {
    $(':reset').click(function(ev){
      ev.preventDefault();
      if (confirm(_('Reset form to initial state?'))) {
        $(this).parents('form')[0].reset();
        $('[id^="f_part_"]+br,[id^="f_part_"]:gt(0)').remove();
        toggle_button();
        last_index = 1;
        add_handler();
        $.isFunction(settings.reset_helper) && settings.reset_helper();
        $('.error').removeClass('error');
        $('.error-notice').remove();
      }
    });
  }
  function translate(x,s)
  {
    s == "success" && addbutton.val(_('Add more...')).attr('title', _('Add one more field'));
  }

  $.fn.dynamicform = function(options) {
    if (! started ) {
      started = true;
      try {
        L10n.textdomain('dynamicform', translate);
      } catch (e) {
        _ = function(s) { return s; }
        DEVMODE && ( N_ = function(s) { return s; } )
      };

      add_button();
      add_handler();
      add_reset_helper();
    }

    options && $.extend(settings, options);

    return this;
  }
})(jQuery);

