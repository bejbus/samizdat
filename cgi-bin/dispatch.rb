#!/usr/bin/env ruby
#
# Samizdat CGI/FastCGI dispatch
#
#   Copyright (c) 2002-2009  Dmitry Borodaenko <angdraug@debian.org>
#
#   This program is free software.
#   You can distribute/modify this program under the terms of
#   the GNU General Public License version 3 or later.
#
# vim: et sw=2 sts=2 ts=8 tw=0

require 'samizdat'

$SAFE = 1 if $SAFE < 1

begin
  raise LoadError if defined?(MOD_RUBY)

  require 'fcgi'

  FCGI.each_cgi do |cgi|
    Dispatcher.dispatch(cgi)
  end

rescue LoadError
  Dispatcher.dispatch(CGI.new)
  exit
end
