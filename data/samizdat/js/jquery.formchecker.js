/*
 * Yet another jQuery plugin for form validation.
 *
 * It was developed because other validators don't support mutually
 * exclusive fields, at least as I know.
 *
 * Requires:
 *   jquery.js, oddly to say,
 *   utils.js for sprintf().
 * Recommends:
 *   l10n.js, gettext-like js library to translate messages.
 *
 * No license neither copyright.
 * This program is in Public Domain.
 *
 */

;(function($) {

  if (typeof DEVMODE === 'undefined') {
    DEVMODE = true;
    try { L10n; } catch (e) { N_ = function(s) { return s; } }
  }

// private variables and methods

  var settings = { },
    rules = {
    'email': {
      'validate': function() {
        var re = /^[a-z0-9_\.\-]+(\+[a-z0-9_\.\-]+)?@(([a-z0-9]+\-)*[a-z0-9]+\.)+[a-z]+$/i;
        return re.test(this.value);
      },
      'errmsg'  : DEVMODE ? N_('Not a valid email is entered') : 'Not a valid email is entered'
    },
    'integer': {
      'validate': function() {
        return /^\d+$/.test(this.value);
      },
      'errmsg'  : DEVMODE ? N_('You sh\'ld enter valid integer number') : 'You sh\'ld enter valid integer number'
    },
    'number': {
      'validate': function() {
        return !isNaN(parseFloat(this.value));
      },
      'errmsg'  : DEVMODE ? N_('You sh\'ld enter valid number') : 'You sh\'ld enter valid number'
    }
  };

  var chk_pwd = function(pwd) {
    if ($.isFunction(settings.check_password)) {
      return settings.check_password(pwd);
    }
    var minlen = 8;
    return pwd !== undefined ? pwd.length >= minlen :
      _('Bad password - shorter than %i chars').sprintf(minlen);
  }

  var default_validate = function() {
    return ! /^\s*$/.test(this.value);
  }

  var validate_required = function(e) {
    return $.isFunction(e.validate) ? e.validate() : default_validate.call(e)
  }

  var validate_optional = function(e) {
    return (default_validate.call(e) && $.isFunction(e.validate)) ? e.validate() : true;
  }

  var find_label = function(e, id) {
    var label;
    if ( id || (id = e.attr('id'))) {
      label = $('label[for="' + id + '"]');
      if (label.length) {
        return label;
      }
    }
    label = e.parents('label');
    if (label.length) {
      return label;
    }
  }

  var error_notice_class = 'error-notice', error_class = 'error';

  var error_notice = function (m) {
    return '<span class="' + error_notice_class + '">' + m + '</span>';
  }

  var remove_error_message = function(target) {
    var label, t = $(target);
    if (t.hasClass(error_class)) {
      label = find_label(t, target.id);
      if (label) {
        label = label.children('.' + error_notice_class);
        if (label.length) {
          return label.remove();
        }
      }
      t.next('.' + error_notice_class).remove();
    }
  }

  var append_error_message = function(target, default_msg) {
    var label, notice, t = $(target);
    notice = error_notice(target.title || _(target.errmsg || default_msg));
    label = find_label(t, target.id);
    label ? label.append(notice) : t.after(notice);
  }

  // initialize form(s)
  var init_form = function(options) {
    if (options) {
      $.extend(settings, options);
    };

    return this
    .delegate('.' + error_notice_class, 'click', function(){ $(this).remove(); })
    .each(function(){
      var form = $(this), r;
      form.submit( check_form );
      for (var rule in rules) {
        form.find('.required.' + rule + ',.optional.' + rule).each(function(){
          if (!this.validate) {
            r = rules[rule];
            this.validate = r.validate;
            this.errmsg   = r.errmsg;
          };
        });
      };
      form.find('.required,.optional,.mutualexclusive,:password').each(function(){
        $(this).focus(function(ev){ remove_error_message(this) });
      });
    });
  }; // init_form()

  // check form
  var check_form = function(ev) {

    var errors = 0, m = 0, form = $(this), notice, label;
    var set_or_unset_error = function(e, o) { (e ? set_error : unset_error)(o); return e; }
    var set_error = function(o) {
      o.each(function(i,e){
        $.isFunction(e.set_error) && e.set_error()
      });
      o.addClass(error_class);
      errors++;
    }
    var unset_error = function(o) {
      o.each(function(i,e){
        $.isFunction(e.unset_error) && e.unset_error()
      });
      o.removeClass(error_class);
    }

    form.find('.' + error_notice_class).remove();

    // check ``required'' fields
    form.find('.required').each(function(){
      if (set_or_unset_error(!validate_required(this), $(this))) {
        append_error_message(this, DEVMODE ? N_('Required field is empty') : 'Required field is empty')
      }
    });

    form.find('.optional').each(function(){
      if (set_or_unset_error(!validate_optional(this), $(this))) {
        append_error_message(this, DEVMODE ? N_('Optional field is empty') : 'Optional field is empty')
      }
    });

    // check ``mutually exclusive'' fields
    var groups = [], re = /group(\d+)/, ex = form.find('.mutualexclusive');
    ex.each(function(){
      var t = this, res = re.exec(t.className),
        i = res ? res[1] : 0,
        m = (groups[i] || 0);
        !i && $(t).addClass('group0');
      groups[i] = validate_required(t) ? 1+m : m;
    });

    for (var i = 0, l = groups.length; i<l; i++) {
      var g = ex.filter('.group'+i);
      if (groups[i] == 0) {
        set_error(g);
        g.last().after(error_notice(_('None of mutually exclusive fields are defined')));
      } else if (groups[i] > 1) {
        set_error(g);
        g.last().after(error_notice(_('Exacly one field from mutually exclusive fields must be defined')));
      } else {
        unset_error(g);
      }
    };

    // check password fields
    var p;
    form.find(':password:not(.nocheck)').each(function(){
      var t = this, e = $(t), fn = unset_error;

      if (e.hasClass('.simplecheck')) {
        if (set_or_unset_error(!validate_required(t), e)) {
          append_error_message(t, 'Empty password')
        }
        return;
      }

      if (p) {
        if (p != e.val()) {
          fn = set_error;
          e.after(error_notice(_('Passwords are not matching')));
        }
      } else {
        p = e.val();
        if (p == '') {
          fn = set_error;
          e.after(error_notice(_('Empty password')));
        } else if (!chk_pwd(p)) {
          fn = set_error;
          e.after(error_notice(chk_pwd() || _('Bad password')));
        }
      }
      fn(e);
    });

    // If have errors then preven submit
    errors && ev.preventDefault();
  }; // check_form()

  var get_or_set_rule = function(rule, _validate, _errmsg) {
    if (_validate) {
      rules[rule] = {
        validate : _validate,
        errmsg   : _errmsg
      };
      return this;
    };

    return new Object(rules[rule]);
  }

  var methods = {
    init  : init_form,
    rule  : get_or_set_rule,
    rules : function() {  return new Object(rules) }
  };

// public interface

  $.fn.formchecker = function(method) {

    try {
      L10n.textdomain('jquery.formchecker');
    } catch(e) {
      _ = function(s) { return s; }
    };

    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist in jQuery.formchecker' );
    }
  };
})(jQuery);
