/*
 * utils.js
 *
 * Implements some useful functions from other languages.
 *
 * No license neither copyright.
 * This program is in Public Domain.
 */

//
// Array.compact()
// Like Array.compact from Ruby, but may accept function to check items
//
Array.prototype.compact = function(check) {
  return this.filter(kind_of(check, Function) ? check :
    function(v) { return v!==null && v!==undefined; });
}

//
// Array in JavaScript >= 1.6 supports methods forEach, filter, indexOf
// Why not to add them for elder versions?
//
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn) {
    for (var i = 0, l = this.length; i<l; i++) {
      fn(this[i]);
    }
  }
}
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fn) {
    var o = [];
    this.forEach(function(v){ fn(v) && o.push(v); });
    return o;
  }
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(e) {
    for (var i = 0, l = this.length; i<l; i++) {
      if (this[i] == e) return i;
    }
    return -1;
  }
}

//
// String.sprintf(args)
// Simplified version of sprintf from C made in OO-style.
//
String.prototype.sprintf = function()
{
  var begin, end, out ='', i, j, n, c, m, no, $$,
    arg = Array.prototype.slice.call(arguments), t = this;

  function mkstr(fn)
  {
    out += !$$ ? fn(arg[i]) : n ? fn(arg[n-1]) : t.substring(end, j+1);
    i++;
  }

  for (begin=i=n=$$=0; (end = this.indexOf('%', begin)) != -1; begin=j+1,n=$$=0) {
    out += this.substring(begin, end);
    j = end + 1;
    c = this.charAt(j);

    do {
      no = 0;

      switch (c) {
      case '%':
        out += '%';
        break;
      case 's':
        mkstr(function(x){ return x })
        break;
      case 'n':
        i++;
        break;
      case 'i': case 'd': case 'u':
        mkstr(parseInt);
        break;
      case 'f':
        mkstr(parseFloat);
        break;
      case 'x':
        mkstr(function(x){ return (x > 0 ? '0x' : '-0x') + Math.abs(x).toString(16).toLowerCase() })
        break;
      case 'X':
        mkstr(function(x){ return (x > 0 ? '0x' : '-0x') + Math.abs(x).toString(16).toUpperCase() })
        break;
      case 'o':
        mkstr(function(x){ return (x > 0 ? '0' : '-0') + Math.abs(x).toString(8) })
        break;
      case 'b':
        mkstr(function(x){ return x.toString(2) + 'b' })
        break;
      case '$':
        while(!isNaN(m = parseInt(c = this.charAt(++j)))) {
          n = n*10 + m;
        }
        no = $$ = 1;
        break;
      default:
        if (!isNaN(parseInt(c))) { // just skip it
          do {
            c = this.charAt(++j);
          } while(!isNaN(parseInt(c)));
          no = 1;
        } else {
          out += this.substring(end, j+1);
        }
      } //switch
    } while(no);
  } // for
  return out + this.substring(begin);
}

//
// sprintf(format, args)
// Simplified version of sprintf from C.
//
/*
function sprintf(s)
{
  return is_value(s) ?
    String.prototype.sprintf.apply(
      s.kind_of(String) ? s : s.toString(),
      Array.prototype.slice.call(arguments, 1))
    : null;
}
*/

//
// String.format(args)
// Like String.format() from C++ Qt library.
//
String.prototype.format = function()
{
  var begin, end, out='', j, c, n, m;

  for (begin=n=0; (end = this.indexOf('%', begin)) != -1; begin=j+1,n=0) {
    out += this.substring(begin, end);

    j = end + 1;
    c = this.charAt(j);
    if (c == '%') {
      out += c;
    } else {
      while((m = parseInt(c)) || m==0) {
        n = n*10 + m;
        c = this.charAt(++j);
      }
      out += n ? arguments[n-1] + c : this.substring(end, j+1);
    }
  }
  return out + this.substring(begin);
}

//
// formatString(format, args)
// Like String.format(), but accepts format string as first value.
//
/*
function formatString(s)
{
  return is_value(s) ?
    String.prototype.format.apply(
      s.kind_of(String) ? s : s.toString(),
      Array.prototype.slice.call(arguments, 1))
    : null;
}
*/

//
// Object.kind_of(Type)
// Like Object.kinf_of?(Type) form Ruby
// Disablead because of stupid IE
/*
Object.prototype.kind_of = function(t)
{
  return this.constructor === t
}
*/

//
// kind_of(obj, Type)
// Fixes JS's stupidness
//
function kind_of(obj, Type)
{
  return is_value(obj) && obj.constructor === Type
}

//
// is_value(v)
// returns true if value is not null neither undefined
//
function is_value(v)
{
  return v !== null && v !== undefined
}
