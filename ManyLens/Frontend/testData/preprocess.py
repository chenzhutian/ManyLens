import csv
import json
alpha3Toalpha2 = {}
exit = []
with open('country-code.csv') as f:
    reader = csv.reader(f)
    for row in reader:
        alpha3Toalpha2[unicode(row[2])] = row[1]
f.close()

topoJson = {}
with open('countries.topo.json') as f:
    source = f.read()
    topoJson = json.loads(source)

for country in topoJson['objects']['countries']['geometries']:
    if(country['id'] in alpha3Toalpha2.keys()):
        country['id'] = alpha3Toalpha2[country['id']]
    else:
        exit.append(country['id'])
f = open("countriesAlpha2.topo.json", 'w')
f.writelines(json.dumps(topoJson))
f.close()
print exit
