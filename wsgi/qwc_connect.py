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
# Script to connect to a PostgreSQL database. Connection object to be used in all wasgi scripts

import psycopg2 #PostgreSQL DB Connection

# configure your DB connection here
DB_CONN_STRING = "host='myhost1' dbname='mydb' port='5432' user='myuser' password='secret'"
DB_CONN_STRING_2 = "host='myhost2' dbname='mydb' port='5432' user='myuser' password='secret'"

searchTablesDict = {
  "searchTableKeyword1" : ['myhost1', 'tablename'],
  "searchTableKeyword2" : ['myhost1', 'tablename'],
  "searchTableKeyword3" : ['myhost2', 'tablename']
}

def getConnection(environ, start_response, dbConnString=None):

  if dbConnString:
    db_conn_string = dbConnString
  else:
    db_conn_string = DB_CONN_STRING

  #SQL database connection
  try:
    conn = psycopg2.connect(db_conn_string)
    return conn
  except:
    errorText = 'error: database connection failed!'
    # write the error message to the error.log
    print >> environ['wsgi.errors'], "%s" % errorText
    response_headers = [('Content-type', 'text/plain'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return None

def getConnectionByHost(host, environ, start_response):
  if(host == "myhost2"):
    return getConnection(environ, start_response, DB_CONN_STRING_2)
  else:
    return getConnection(environ, start_response, DB_CONN_STRING)

def getHost(searchTable, environ, start_response):
  host = ""
  for values in searchTablesDict.values():
    if searchTable in values:
      host = values[0]
  return host

def getSearchAreasTable():
  return "searchTableKeyword3"
