#!/usr/bin/env ruby
#
# Samizdat message helper tests
#
#   Copyright (c) 2002-2009  Dmitry Borodaenko <angdraug@debian.org>
#
#   This program is free software.
#   You can distribute/modify this program under the terms of
#   the GNU General Public License version 3 or later.
#
# vim: et sw=2 sts=2 ts=8 tw=0

require 'test/unit'
require 'rexml/document'
require 'samizdat'
# let mocks overwrite originals
require 'test/mock'
require 'test/util'

require 'samizdat/helpers/message_helper'

class TC_MessageHelper < Test::Unit::TestCase
  include MessageHelper

  def setup
    # create a dummy session
    @site = MockSite.instance
    @request = MockRequest.new
    @session = @request.session
    @member = Member.new(site, nil)
  end

  def teardown
    @request = nil
    @session = nil
  end

  def test_message_buttons
    m = MockMessage.new(:id => 'upload')
    @member = MockMember.new('post' => true)
    root = parse(message_buttons(m))
    assert_equal ['message/upload/reply', 'message/upload/translate', 'message/upload/request_moderation'],
      elements(root, '/div[@class="foot"]/a[@class="action"]', 'href')
  end

  def test_message_info_date
    m = MockMessage.new(:id => 'upload')
    message_info(m, :full)
    m = MockMessage.new(:id => 'upload', :date => '2004-03-11')
    message_info(m, :full)
    m = MockMessage.new(:id => 'upload', :date => nil)
    message_info(m, :full)
    date = 'current time'
    class << date   # check duck typing
      def to_time
        Time.now
      end
    end
    m = MockMessage.new(:id => 'upload', :date => date)
    message_info(m, :full) =~ /<\/a> on (.*)$/
    assert_not_equal date, $1
  end

  def test_message_info_parent
    m = MockMessage.new(:id => 'upload', :part_of => 2)
    assert_equal true,
      message_info(m, :full).split(",\n ")[1].include?('href="2"')
  end

  def test_message_content_no_content
    m = MockMessage.new
    assert_equal '', message_content(m, :list)
  end

  def test_message_content_nil
    m = MockMessage.new
    m.content = Content.new(site, nil, nil, nil)
    m.content.body = "line 1\n\nline 2"
    root = parse(box(nil, message_content(m, :full)))
    assert_equal ['line 1', 'line 2'], elements(root, 'div/p', nil)
  end

  def test_message_content_plain_text
    m = MockMessage.new
    m.content = Content.new(site, nil, nil, nil)
    m.content.format = 'text/plain'
    m.content.body = 'test'
    assert_equal 'pre', parse(message_content(m, :full)).name
  end

  def test_message_content_squish
    m = MockMessage.new
    m.content = Content.new(site, nil, nil, nil)
    m.content.format = 'application/x-squish'
    m.content.body = 'SELECT'
    root = parse(message_content(m, :full))
    assert_equal ['q', nil, 'run'], elements(root, 'div/*', 'name')
  end

  def test_message_content_image
    m = MockMessage.new
    m.content = Content.new(site, nil, 'guest', 'A')
    m.content.file = ContentFilePendingUpload.new(site, m.content, MockUpload.new, nil, 'image/jpeg', nil)
    root = parse(message_content(m, :full))
    assert_equal 'A', root.attributes['alt']
    assert_equal 'content/mock_upload/upload.jpg', root.attributes['src']
  end

  def test_message_content_file
    m = MockMessage.new
    m.content = Content.new(site, nil, 'guest', nil)
    m.content.file = ContentFilePendingUpload.new(site, m.content, MockUpload.new, nil, 'application/pdf', nil)
    root = parse(message_content(m, :full))
    assert_equal ['Download pdf file'], elements(root, 'a')
  end
end
