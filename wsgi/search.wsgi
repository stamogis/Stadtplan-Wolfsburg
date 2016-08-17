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
# sample queries
# http://localhost/wsgi/search.wsgi?searchtables=abwasser.such§tabelle&query=1100&cb=bla
# http://localhost/wsgi/search.wsgi?query=Oberlandstr&cb=bla

SEARCH_IN_ALL_TOPICS_STRING = "Alle Themen"
SEARCH_IN_ALL_AREAS = "Gesamte Stadt"

# make themes choosable in search combo
THEMES_CHOOSABLE = True
# zoom to this bbox if a layer is chosen in the search combo [minx, miny, maxx, maxy]
# set to None if extent should not be changed
MAX_BBOX = None

import re #regular expression support
import string #string manipulation support
from webob import Request
from webob import Response
import psycopg2 #PostgreSQL DB Connection
import psycopg2.extras #z.b. für named column indexes
import json
import sys #für Fehlerreporting
import os

# append the Python path with the wsgi-directory
qwcPath = os.path.dirname(__file__)
if not qwcPath in sys.path:
  sys.path.append(qwcPath)

import qwc_connect

searchTablesDict = qwc_connect.searchTablesDict

environ = ""
start_response = ""

def application(env, start_resp):
  global environ
  global start_response
  environ = env
  start_response = start_resp

  request = Request(environ)

  # Tables
  searchTablesRequest = request.params['searchTables']
  searchTablesRequest = json.loads(searchTablesRequest)

  # Filters
  searchFiltersRequest = request.params['searchFilters']
  searchFiltersRequest = json.loads(searchFiltersRequest)

  # Umkreissuche
  searchCenterRequest = request.params["searchCenter"]
  searchRadiusRequest = request.params["searchRadius"]

  # Result limit
  searchLimitRequest = request.params["resultLimit"];

  # Stadt- oder Ortsteilsuche
  searchtAreaRequest = request.params["searchArea"]
  searchAreasTable = qwc_connect.getSearchAreasTable()
  searchAreasTableHost = qwc_connect.searchTablesDict[searchAreasTable][0]
  searchAreasTableName = qwc_connect.searchTablesDict[searchAreasTable][1]

  querystring = request.params["query"]
  #strip away leading and trailing whitespaces
  querystring = querystring.strip()
  #split on whitespaces
  regex = re.compile(r'\s+')
  querystrings = regex.split(querystring)

  searchTablesAndFilters = getSearchTablesAndFilters(searchTablesRequest, searchFiltersRequest)
  searchTables = searchTablesAndFilters["searchTables"]
  searchFilters = searchTablesAndFilters["searchFilters"]

  rowData = [];
  rows = []

  for host in searchTables:
    sqlQuery = createSQLQuery(searchTables[host], querystring, querystrings, searchFilters[host], searchCenterRequest, searchRadiusRequest, searchLimitRequest, searchtAreaRequest, searchAreasTableName)

    sql = sqlQuery['sql']
    data = sqlQuery['data']

    conn = qwc_connect.getConnectionByHost(host, environ, start_response);

    if conn != None:
      rowResults = executeSQLQuery(conn, sql, data)

      for row in rowResults:
        rows.append(row)
    else:
      return ['error: database connection failed!']

  rows = sorted(rows, key=lambda row: row['search_category'])
  rows = sorted(rows, key=lambda row: row['search_order'])

  if THEMES_CHOOSABLE:
    selectable = "1"
    maxBbox = MAX_BBOX
  else:
    selectable = "0"
    maxBbox = None

  lastSearchCategory  = ''
  for row in rows:
    if lastSearchCategory != row['search_category']:
      rowData.append({"id":None,"displaytext":row['searchcat_trimmed'],"searchtable":None,"bbox":maxBbox,"showlayer":row['showlayer'],"selectable":selectable})
      lastSearchCategory = row['search_category']
    rowData.append({"id":row['id'],"displaytext":row['displaytext'],"searchtable":row['searchtable'],"bbox":row['bbox'],"showlayer":row['showlayer'],"selectable":"1"})

  resultString = '{"results": '+json.dumps(rowData)+'}'
  resultString = string.replace(resultString,'"bbox": "[','"bbox": [')
  resultString = string.replace(resultString,']",','],')

  #we need to add the name of the callback function if the parameter was specified
  if "cb" in request.params:
    resultString = request.params["cb"] + '(' + resultString + ')'

  response = Response(resultString,"200 OK",[("Content-type","application/json"),("Content-length", str(len(resultString)) )])

  return response(environ, start_response)

def getSearchTablesAndFilters(searchTablesRequest, searchFiltersRequest):
  searchTables = {}
  searchFilters = {}

  if searchTablesRequest[0] == SEARCH_IN_ALL_TOPICS_STRING:
    for table in searchTablesDict:
      filters = ""
      if searchTablesDict[table][0] in searchTables:
        searchTables[searchTablesDict[table][0]].append(searchTablesDict[table][1])
        searchFilters[searchTablesDict[table][0]].append(filters)
      else:
        searchTables[searchTablesDict[table][0]] = []
        searchFilters[searchTablesDict[table][0]] = []
        searchTables[searchTablesDict[table][0]].append(searchTablesDict[table][1])
        searchFilters[searchTablesDict[table][0]].append(filters)
  else:
    for i in range(len(searchTablesRequest)):
      table = searchTablesRequest[i]

      if(i < len(searchFiltersRequest)):
        filters = searchFiltersRequest[i]
      else:
        filters = ""

      if table in searchTablesDict:
        if searchTablesDict[table][0] in searchTables:
          searchTables[searchTablesDict[table][0]].append(searchTablesDict[table][1])
          searchFilters[searchTablesDict[table][0]].append(filters)
        else:
          searchTables[searchTablesDict[table][0]] = []
          searchFilters[searchTablesDict[table][0]] = []
          searchTables[searchTablesDict[table][0]].append(searchTablesDict[table][1])
          searchFilters[searchTablesDict[table][0]].append(filters)

  return {"searchTables": searchTables, "searchFilters": searchFilters}

def createSQLQuery(searchtables, querystring, querystrings, searchFilters, searchCenter, searchRadius, searchLimit, searchArea, searchAreasTableName):
  searchtableLength = len(searchtables)
  querystringsLength = len(querystrings)
  searchFiltersLength = len(searchFilters)

  sql = ""
  errorText = ''

  # any searchtable given?
  if searchtableLength == 0:
    errorText += 'error: no search table'
    # write the error message to the error.log
    print >> environ['wsgi.errors'], "%s" % errorText
    response_headers = [('Content-type', 'text/plain'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return [errorText]

  if searchFiltersLength != searchtableLength:
    errorText += 'error: filters length'
    # write the error message to the error.log
    print >> environ['wsgi.errors'], "%s" % errorText
    response_headers = [('Content-type', 'text/plain'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return [errorText]

  addUmkreissuche = False
  if searchCenter != "" and searchRadius != "":
    addUmkreissuche = True

  addSearchByArea = False
  if searchArea != "" and searchArea != SEARCH_IN_ALL_AREAS and searchAreasTableName != "":
    addSearchByArea = True

  addSearchLimit = False
  if searchLimit != "":
    addSearchLimit = True

  data = ()

  sql += "SELECT * FROM ("
  sql += "SELECT DISTINCT ON (id, displaytext, bbox) * FROM ("

  for i in range(searchtableLength):
    # Search 1: entire search string
    sqlQuery = createStartSQLQueryString(searchtables[i], "1")
    sql += sqlQuery['sql']
    data += sqlQuery['data']
    sqlQuery = createExtendedSearchSQLQueryString(searchtables[i], addSearchByArea, searchAreasTableName, searchArea, addUmkreissuche, searchCenter, searchRadius, searchFilters[i])
    sql += sqlQuery['sql']
    data += sqlQuery['data']

    if querystring != "":
      if sqlQuery['addWhere']:
        sql += " WHERE "
      elif sqlQuery['addAnd']:
        sql += " AND "

      sql += "searchstring ILIKE %s"
      data += ("%" + querystring + "%",)

    # Search 2: search string sections
    if querystringsLength > 1:
      sql += " UNION "
      sqlQuery = createStartSQLQueryString(searchtables[i], "2")
      sql += sqlQuery['sql']
      data += sqlQuery['data']
      sqlQuery = createExtendedSearchSQLQueryString(searchtables[i], addSearchByArea, searchAreasTableName, searchArea, addUmkreissuche, searchCenter, searchRadius, searchFilters[i])
      sql += sqlQuery['sql']
      data += sqlQuery['data']

      if sqlQuery['addWhere']:
        sql += " WHERE "
      elif sqlQuery['addAnd']:
        sql += " AND "

      #for each querystring
      for j in range(0, querystringsLength):
        sql += "searchstring ILIKE %s"
        data += ("%" + querystrings[j] + "%",)

        if j < querystringsLength - 1:
          sql += " AND "

    # Search 3: keyword search
    if querystring != "":
      sql += " UNION "
      sqlQuery = createStartSQLQueryString(searchtables[i], "3")
      sql += sqlQuery['sql']
      data += sqlQuery['data']
      sqlQuery = createExtendedSearchSQLQueryString(searchtables[i], addSearchByArea, searchAreasTableName, searchArea, addUmkreissuche, searchCenter, searchRadius, searchFilters[i])
      sql += sqlQuery['sql']
      data += sqlQuery['data']

      if sqlQuery['addWhere']:
        sql += " WHERE "
      elif sqlQuery['addAnd']:
        sql += " AND "

      sql += "t1.searchstring_keywords ILIKE %s"
      data += ("%" + querystring + "%",)

    #union for next table
    if i < searchtableLength - 1:
      sql += " UNION "

  sql += ") search_result"
  sql += ") search_filtered"
  sql += " ORDER BY search_order, search_category ASC, ordertext ASC"

  if addSearchLimit:
    sql += " LIMIT " + searchLimit + ";"
  else:
    sql += ";"

  return {"sql": sql, "data": data}

def createStartSQLQueryString(searchtable, search_order):
  sql = ""
  data = ()

  sql += "SELECT id, displaytext, '" + searchtable + r"' AS searchtable, search_category, substring(search_category from 4) AS searchcat_trimmed, showlayer, "
  sql += "'['||replace(regexp_replace(BOX2D(the_geom)::text,'BOX\(|\)','','g'),' ',',')||']'::text AS bbox, "
  sql += search_order + " AS search_order, "
  sql += "ordertext "
  sql += "FROM " + searchtable + " AS t1"

  return {"sql": sql, "data": data}

def createExtendedSearchSQLQueryString(searchtable, addSearchByArea, searchAreasTableName, searchArea, addUmkreissuche, searchCenter, searchRadius, searchFilters):
  sql = ""
  data = ()

  addWhere = True
  addAnd = False

  if addSearchByArea:
    sql += ", (SELECT the_geom AS area FROM " + searchAreasTableName + " WHERE displaytext = '" + searchArea + "' LIMIT 1) AS t2"
    sql += " WHERE ST_INTERSECTS(t2.area, t1.the_geom) = TRUE "
    if searchtable == searchAreasTableName:
      sql += "AND displaytext = '" + searchArea + "' "
    addAnd = True
    addWhere = False

  if addUmkreissuche:
    if addWhere:
      sql += " WHERE "
      addWhere = False
    if addAnd:
      sql += "AND ST_DWITHIN(the_geom, ST_SetSRID(ST_MakePoint(" + searchCenter + "), 25832), " + searchRadius + ") "
    else:
      sql += "ST_DWITHIN(the_geom, ST_SetSRID(ST_MakePoint(" + searchCenter + "), 25832), " + searchRadius + ") "
    addAnd = True

  if searchFilters != "":
    #split on comma
    filters = searchFilters.split(",")
    #strip away leading and trailing whitespaces
    filters = [s.strip() for s in filters]

    if len(filters) > 1:
      if addWhere:
        sql += " WHERE "
        addWhere = False
      for filterIndex in range(0, len(filters)):
        if(filterIndex == 0):
          if addAnd:
            sql += "AND (substring(search_category from 4) ILIKE %s "
          else:
            sql += "(substring(search_category from 4) ILIKE %s "
          data += (filters[filterIndex],)
          addAnd = True
        elif filterIndex < len(filters) - 1:
          sql += "OR substring(search_category from 4) ILIKE %s "
          data += (filters[filterIndex],)
          addAnd = True
        else:
          sql += "OR substring(search_category from 4) ILIKE %s) "
          data += (filters[filterIndex],)
          addAnd = True
    else:
      if filters[0] != "":
          if addWhere:
            sql += " WHERE "
            addWhere = False
          if addAnd:
            sql += "AND substring(search_category from 4) ILIKE %s "
          else:
            sql += "substring(search_category from 4) ILIKE %s "
          data += (filters[0],)
          addAnd = True


  return {"sql": sql, "data": data, "addWhere": addWhere, "addAnd": addAnd}

def executeSQLQuery(conn, sql, data):
  if conn == None:
    print [""]

  cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

  errorText = ''

  try:
    cur.execute(sql, data)
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

  rows = []
  rows = cur.fetchall()

  conn.close()

  return rows
