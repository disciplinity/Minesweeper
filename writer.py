#!/usr/bin/python

import cgitb; cgitb.enable()
import cgi
# sendMessage.py?name=Jacob&text=Some message
print 'Content-type: text\html\n'

form = cgi.FieldStorage()
name = form['name'].value
bombs = form['bombs'].value
result = form['result'].value
movesMade = form['movesMade'].value
boardSize = form['boardSize'].value

file = open('/tmp/jaroslavs_highscores.txt', 'a')
file.write(name + '\t' + bombs + '\t' + result + '\t' + movesMade + '\t' + boardSize + '\n')
file.close()