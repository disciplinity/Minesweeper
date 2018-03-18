#!/usr/bin/python

import sys
import json
import cgi

# sendMessage.py?name=Jacob&text=Some message
print 'Content-type: application/json\n'

form = cgi.FieldStorage()
filename = '../prax3/savedGames.txt'
file = open(filename, 'a+')

action = form['action'].value
name = form['name'].value

if action == "save":
	field = form['field'].value
	plantedBombs = form['plantedBombs'].value
	movesMade = form['movesMade'].value
	mTiles = form['mTiles'].value
	minesAmount = form['minesAmount'].value
	file.write("{}\t{}\t{}\t{}\t{}\t{}\n".format(name, field, plantedBombs, movesMade, mTiles, minesAmount))
else:	 
	for line in reversed(file.readlines()):
		messages = []

		line = line.strip()
		result = line.split("\t")

		if name == result[0]:
			messages.append({"name": result[0], "field": result[1], "plantedBombs": result[2], "movesMade": result[3], "manuallyClickedTiles": result[4], "minesAmount": result[5]})
			break
	print json.dumps(messages)

	
file.close()
	
	
