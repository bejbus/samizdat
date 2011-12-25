/*
 * No license neither copyright.
 * This program is in Public Domain.
 */

var L10n = (function(){

  var l10n = {}, domains = [], lang, paths = [], default_path = '';

  var obj = {
    gettext: function(msgid) {
      return l10n[msgid] || msgid
    },
    ngettext: function(msgid, msgid_plural, n) {
      var tr = l10n[msgid];
      return kind_of(tr, String) ? tr :
        kind_of(tr, Array) ? tr[this.plural(n)] :
          n == 1 ? msgid : msgid_plural;
    },
    plural: function(n) {
      return n == 1 ? 0 : 1
    },
    add: function(msgid, msgstr) {
      if (kind_of(msgid, String)) {
        msgstr && (l10n[msgid] = msgstr);
        return true;
      }
      if (kind_of(msgid, Object)) {
        $.extend(l10n, msgid);
        return true;
      }
      throw new Error('Incorrect call to L10n.add()!');
    },
    provides_domains: function() {
      for (var d, i = 0, l = arguments.length; i < l ; i++) {
        d = arguments[i];
        if (domains.indexOf(d) == -1) {
          domains.push(d);
        }
      }
    },
    textdomain: function(domainname, callback) {
      if (domains.indexOf(domainname) == -1) {
        var idx = domains.push(domainname) - 1;
        /\.js$/.test(domainname) || (domainname += '.js' );
        var path = _script_path(domainname);
        paths[idx] = path;
        _load_from_path(domainname, path, callback)
      }
      return domainname;
    },
    bindtextdomain: function(domainname, dirname, callback) {
      if (arguments.lenth < 2 || dirname === undefined || domainname === undefined) {
        throw new Error("arguments mismatch for bindtextdomain(domainname, dirname)");
      }
      if (domains.indexOf(domainname) == -1) {
        paths[domains.push(domainname) - 1] = dirname;
      };
      /\.js$/.test(domainname) || (domainname += '.js' );
      _load_from_path(domainname, dirname, callback)
      return domainname;
    },
    set_locale: function(newlang) {
      if (newlang) {
        if (lang) {
          if (lang != newlang) {
            lang = newlang;
            _reload_all();
          }
        } else {
          lang = newlang;
        }
      }
      return lang;
    },
    default_path: function(path) {
      path !== undefined && (default_path = path);
      return default_path;
    }
  };

  function _reload_all()
  {
    // dup domains & paths
    var d = domains.slice(), p = paths.slice();
    domains = []; paths = []; l10n = {};
    for (var i = 0, l = d.length; i < l; i++) {
      var path = p[i];
      if (path !== undefined) {
        var domainname = d[i];
        /\.js$/.test(domainname) || (domainname += '.js' );
        _load_from_path(domainname, path);
      }
    }
    // restore domains & paths
    domains = d; paths = p;
  }

  function _load_from_path(name, path, callback)
  {
    path = [path, lang, name].filter(function(s){return !!s}).join('/');

    var ajaxobj = { url: path, dataType: 'script', async: false, cache : true }
    if ($.isFunction(callback)) {
      ajaxobj.complete = callback;
    }
    return $.ajax(ajaxobj);
  }

  function _script_path(name)
  {
    var re = new RegExp('(^.+/)?(' + name + ')$');
    var path;
    $('script').each(function(){
      var res = re.exec($(this).attr('src'));
      if (res) path = res[1];
    });

    return (path === undefined ? default_path : path);
  }

  function _dump()
  {
    var a = [], s;

    for (var i in l10n) {
      s = l10n[i];
      if (s && (s.constructor === String || s.constructor === Array)) {
        a.push(i + ': ' + ($.isArray(s) ? s.join() : s));
      }
    }
    return a.join("\n");
  }

  return obj;
}());

function  _(str) { return L10n.gettext(str) }
function N_(str) { return str; }

