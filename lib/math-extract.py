import json
from cnstd import LayoutAnalyzer

# sample_ids = ['1', '2', '3', '4', '5', '6', '7']
num = 10
sample_ids = list(range(1, num+1))
path = '../public/sample'

for sample_id in sample_ids:
  img = path + '/sample-' + str(sample_id) + '.jpg'
  out = path + '/math-' + str(sample_id) + '.json'
  analyzer = LayoutAnalyzer('mfd')
  equations = analyzer.analyze(img)

  items = []
  for equation in equations:
    item = {
      'type': equation['type'],
      'bbox': equation['box'].tolist(),
      'score': equation['score'],
    }
    items.append(item)

  with open(out, 'w') as file:
    json.dump(items, file, indent=2)