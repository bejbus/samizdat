/*
 * No license neither copyright.
 * This program is in Public Domain.
 */

var TinymceEditor = function(/*dynform, */tinymce_enable) {
  var tinymce_visible = false, saved_border, err_border = '1px solid red',
    textarea = $('#f_body:visible'), format, /*initialized = false,*/
    default_format, adv_format = 'text/html';

  if (typeof DEVMODE === 'undefined') {
    DEVMODE = true;
  }

  try {
    L10n.textdomain('tinymce_support', translate);
  } catch (e) {
    _ = function(s) { return s; }
    DEVMODE && ( N_ = function(s) { return s; } )
  }

  return textarea.length ? initialize() : false;

  // private functions
  function translate(x,s)
  {
    s == "success" && $('[for="tinymce_trigger"],#tinymce_trigger').attr('title', _('Enable or disable tinymce'))
  }
/*  function toggle_tinymce()
  {
    tinymce_visible ? hide_tinymce() : show_tinymce();
  }

  function hide_tinymce()
  {
    if (initialized) {
      textarea[0].set_error =
      textarea[0].unset_error =
      textarea[0].validate = undefined;
*/
//      tinyMCE.execCommand(/*'mceToggleEditor'*/'mceRemoveControl', true, 'f_body');
/*
      format.val() == adv_format && format.val(default_format);
    }
    tinymce_visible = false;
  }
*/
  function show_tinymce()
  {
//    if (! initialized ) {
      tinyMCE.init({mode:"textareas", theme: 'advanced'});
      // TODO: check whether it's really shown
//      initialized = true;
//    } else {
//      tinyMCE.execCommand(/*'mceToggleEditor'*/'mceAddControl', true, 'f_body');
//    }
//    if (initialized) {
//      tinymce_visible = true;
      textarea[0].validate = tmce_validate;
      textarea[0].unset_error = tmce_unset_error;
      textarea[0].set_error = tmce_set_error;
      format.val(adv_format);
//    }
  }

  function tmce_set_error()
  {
    $('#f_body_tbl').addClass('error');
  }

  function tmce_unset_error()
  {
    $('#f_body_tbl').removeClass('error');
  }

  function tmce_validate()
  {
    tinyMCE.triggerSave();
    return !!tinyMCE.get('f_body').getContent();
  }

  function tmce_reset_helper()
  {
/*    if (!tinymce_visible && tinymce_enable) {
      show_tinymce();
    } else if (tinymce_visible && !tinymce_enable) {
      hide_tinymce();
    }

    tinymce_visible && */format.val(adv_format);

    tmce_unset_error();
  }

  function initialize()
  {
    format = $('#f_format');

    default_format = format.val();
/*
    textarea.before(
      '<div class="label"><label for="tinymce_trigger" title="%1">tinyMCE: </label><input type="checkbox" id="tinymce_trigger" %2 title="%1" /></div>'.format(
    _('Enable or disable tinymce'), tinymce_enable ? 'checked="checked"' : ''));

    $('#tinymce_trigger').change(toggle_tinymce);
*/

    tinymce_enable && show_tinymce();

    return { reset_helper : tmce_reset_helper };
  };
}
