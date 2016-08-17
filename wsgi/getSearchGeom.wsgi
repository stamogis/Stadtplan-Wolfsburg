#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# Copyright (2010-2012), The QGIS Project All rights reserved.
#
# Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
#  - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
#  - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
# http://localhost/wsgi/getSearchGeom.wsgi?searchtable=av_user.suchtabelle&displaytext=Oberlandautobahn (Strasse, Uster)

import re #regular expression support
import string #string manipulation support
from webob import Request
from webob import Response
import psycopg2 #PostgreSQL DB Connection
import psycopg2.extras #z.b. für named column indexes
import sys #für Fehlerreporting
import os

# append the Python path with the wsgi-directory
qwcPath = os.path.dirname(__file__)
if not qwcPath in sys.path:
  sys.path.append(qwcPath)

import qwc_connect

def application(environ, start_response):
  request = Request(environ)
  searchtable = request.params["searchtable"]
  objectid = request.params["id"]

  #sanitize
  if re.search(r"[^A-Za-z,._]", searchtable):
    print >> environ['wsgi.errors'], "offending input: %s" % searchtable
    sql = ""
  else:
    sql = "SELECT COALESCE(ST_AsText(the_geom), \'nogeom\') AS geom FROM "+searchtable+" WHERE id = %(objectid)s;"

  result = "nogeom"

  if searchtable != "" and searchtable != "null":
    errorText = ''
    host = qwc_connect.getHost(searchtable, environ, start_response)
    conn = qwc_connect.getConnectionByHost(host, environ, start_response)

    if conn == None:
      return [""]

    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
      cur.execute(sql,{'objectid':objectid})
    except:
      exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
      conn.close()
      errorText += 'error: could not execute query'
      # write the error message to the error.log
      print >> environ['wsgi.errors'], "%s" % errorText+": "+str(exceptionValue)
      response_headers = [('Content-type', 'text/plain'),
                          ('Content-Length', str(len(errorText)))]
      start_response('500 INTERNAL SERVER ERROR', response_headers)

      return [errorText]

    #result = sql;
    #result += ";" + errorText;
    row = cur.fetchone()
    result = row['geom']
    conn.close()

  response = Response(result,"200 OK",[("Content-type","text/plain"),("Content-length", str(len(result)) )])

  return response(environ, start_response)
