#!/usr/bin/python

import cgitb; cgitb.enable()
import json
import os

print 'Content-type: application/json\n'

filename = '/tmp/jaroslavs_highscores.txt'

# If file does not exsist, create one
if not os.path.exists(filename):
	file = open(filename, 'w').close()


file = open(filename, 'r')

messages = []
counter = 0
for line in file:
	if counter >= 100:
		break
	result = line.split('\t')
	messages.append({'name': result[0], 'bombs': result[1], 'result': result[2], 'movesMade': result[3], 'boardSize': result[4]})
	counter += 1
	
file.close()

print json.dumps(messages)