import cv2
import numpy as np
import trace_skeleton
import random
import svgwrite

sample_ids = ['1', '2', '3', '4', '5', '6', '7']
path = 'public/sample'

for sample_id in sample_ids:
  image = cv2.imread(path + '/sample-' + sample_id + '.jpg', 0)
  image = cv2.GaussianBlur(image, (5, 5), 0)
  image = cv2.Canny(image, 100, 200)

  # Extract only figures based on contours
  contours, hierarchy = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
  filtered_contours = []
  for contour in contours:
    length = cv2.arcLength(contour, True)
    if length >= 600:
      filtered_contours.append(contour)
  image2 = np.zeros_like(image)
  thickness = 3
  cv2.drawContours(image2, filtered_contours, -1, (255, 255, 255), thickness)
  cv2.imwrite(path + '/figure-' + sample_id + '.jpg', cv2.bitwise_not(image2))

  # Create SVG based on lines
  _, image2 = cv2.threshold(image2, 128, 255, cv2.THRESH_BINARY)
  polys = trace_skeleton.from_numpy(image2)
  dwg = svgwrite.Drawing(path + '/figure-line-' + sample_id + '.svg', size=(str(image2.shape[1])+'px', str(image2.shape[0])+'px'))
  for poly in polys:
    c = (200*random.random(), 200*random.random(), 200*random.random())
    path_data = 'M'
    for i in range(len(poly)-1):
      if i == 0:
        path_data += str(poly[i][0]) + ',' + str(poly[i][1])
      else:
        path_data += ' L' + str(poly[i][0]) + ',' + str(poly[i][1])
    dwg.add(dwg.path(d=path_data, stroke='black', fill='none'))
  dwg.save()
