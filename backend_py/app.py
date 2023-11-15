from flask import Flask, jsonify, request, render_template,make_response,request,send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
import datetime
import cv2
import os
import numpy as np
import json
import urllib

# creating a Flask app
app = Flask(__name__,static_folder='stylesheets')


upload_folder = os.path.join('static', 'uploads')
app.config['UPLOAD'] = upload_folder
cors = CORS(app, resources={r'/img': {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
    
@app.route('/', methods = ['GET','POST'])
def prompt():
    if(request.method == 'GET'):
  
        data = "its up <GET>"
        #print("hxdhk")
        return render_template('/index.html')
    
    if(request.method == 'POST'):

        data_json = json.loads(request.data)
        print(data_json['title'])
        img_url = data_json['img']
        print(img_url)
        
        h_vals = []
        # Load the image
        #cropped_image = cv2.imread('/Users/harshvardhanmestha/Desktop/abc.png')
        url_response = urllib.request.urlopen(img_url)
        jpg_as_np = np.frombuffer(url_response.read(), dtype=np.uint8)
        print(len(jpg_as_np))
        cropped_image = cv2.imdecode(jpg_as_np,cv2.IMREAD_COLOR)
        print(cropped_image.shape)
        # cv2.imshow("yes",img)
        # cv2.waitKey()
        num_rows, num_cols = 4, 6

        cell_height = cropped_image.shape[0] // num_rows
        cell_width = cropped_image.shape[1] // num_cols

        circle_radius = 20

        average_colors = []

        for i in range(num_rows):
            for j in range(num_cols):
                # Calculate the center coordinates of the circular mask
                center_x = j * cell_width + cell_width // 2
                center_y = i * cell_height + cell_height // 2

                # Create a circular mask with the defined radius
                mask = np.zeros_like(cropped_image)
                cv2.circle(mask, (center_x, center_y), circle_radius, (255, 255, 255), -1)

                # Extract the region of interest (ROI) for the circular mask
                roi = cv2.bitwise_and(cropped_image, mask)
                
                ## converting bgr to rgb 
                #roi  = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB) 
                
                ## converting bgr to rgb 
                roi  = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV) 

                # Calculate the average RGB value of the circular area in the current beaker
                total_pixels = np.sum(mask[:, :, 0] > 0)
                if total_pixels > 0:
                    average_color = np.sum(roi, axis=(0, 1)) // total_pixels
                else:
                    average_color = np.array([0, 0, 0])  # Default black color if no valid pixels are found

                # Add the average RGB value to the list
                average_colors.append(average_color)
                h_vals.append(average_color[0])

                # Print the average RGB value of the liquid in the current beaker
                print(f'Beaker at row {i+1}, column {j+1} has average HSV color: {average_color}, H value: {average_color[0]}')

                # Draw circle around detected region
                cv2.circle(cropped_image, (center_x, center_y), circle_radius, (0, 255, 0), 2)

        # cv2.imshow('Detected Beakers', cropped_image)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        ret, jpeg = cv2.imencode('.png', cropped_image)
        #response = make_response(jpeg.tobytes())
        time = datetime.datetime.now()
        cv2.imwrite(os.path.join('image_debug_logs' , f'img_{time}.png'), cropped_image)

        # these 3 lines work
        # response = make_response(jpeg.tobytes())
        # response.headers['Content-Type'] = 'image/png'
        # print(response.data)
        # #return response

        #return send_file('static/Image/img.png', mimetype='image/gif')

        ## logic for counting row-wise light/dark
        control_h = h_vals[0]
        r1 = 0
        r2 = 0
        r3 = 0

        for i in range(0,len(h_vals)):
            if(i>=6 and i<=10):
                if(control_h-h_vals[i]>0):
                    r1 = r1 + 1
            if(i>=12 and i<=16):
                if(control_h-h_vals[i]>0):
                    r2 = r2 + 1
            if(i>=18 and i<=22):
                if(control_h-h_vals[i]>0):
                    r3 = r3 + 1
        
        ##mpn logic 

        mpn = 0

        if(r1==0 and r2==0 and r3==0):mpn = "less than " + str(2) ##less than 2
        elif(r1==0 and r2==0 and r3==1):mpn = 2
        elif(r1==0 and r2==1 and r3==0):mpn = 2
        elif(r1==0 and r2==2 and r3==0):mpn = 4
        ###
        elif(r1==1 and r2==0 and r3==0):mpn = 2
        elif(r1==1 and r2==0 and r3==1):mpn = 4
        elif(r1==1 and r2==1 and r3==0):mpn = 4
        elif(r1==1 and r2==1 and r3==1):mpn = 6
        elif(r1==1 and r2==2 and r3==0):mpn = 6
        ###
        elif(r1==2 and r2==0 and r3==0):mpn = 4
        elif(r1==2 and r2==0 and r3==1):mpn = 7
        elif(r1==2 and r2==1 and r3==0):mpn = 7
        elif(r1==2 and r2==1 and r3==1):mpn = 9
        elif(r1==2 and r2==2 and r3==0):mpn = 9
        elif(r1==2 and r2==3 and r3==0):mpn = 12
        ###
        elif(r1==3 and r2==0 and r3==0):mpn = 8
        elif(r1==3 and r2==0 and r3==1):mpn = 11
        elif(r1==3 and r2==1 and r3==0):mpn = 11
        elif(r1==3 and r2==1 and r3==1):mpn = 14
        elif(r1==3 and r2==2 and r3==0):mpn = 14
        elif(r1==3 and r2==2 and r3==1):mpn = 17
        ###
        elif(r1==4 and r2==0 and r3==0):mpn = 13
        elif(r1==4 and r2==0 and r3==1):mpn = 17
        elif(r1==4 and r2==1 and r3==0):mpn = 17
        elif(r1==4 and r2==1 and r3==1):mpn = 21 ## or 26 ??
        elif(r1==4 and r2==2 and r3==0):mpn = 22
        elif(r1==4 and r2==2 and r3==1):mpn = 26
        elif(r1==4 and r2==3 and r3==0):mpn = 27
        elif(r1==4 and r2==3 and r3==1):mpn = 33
        elif(r1==4 and r2==4 and r3==0):mpn = 34
        ###
        elif(r1==5 and r2==0 and r3==0):mpn = 23
        elif(r1==5 and r2==0 and r3==1):mpn = 30
        elif(r1==5 and r2==0 and r3==2):mpn = 40
        elif(r1==5 and r2==1 and r3==0):mpn = 30
        elif(r1==5 and r2==1 and r3==1):mpn = 50
        elif(r1==5 and r2==1 and r3==2):mpn = 60
        elif(r1==5 and r2==2 and r3==0):mpn = 50
        elif(r1==5 and r2==2 and r3==1):mpn = 70
        elif(r1==5 and r2==2 and r3==2):mpn = 90
        elif(r1==5 and r2==3 and r3==0):mpn = 80
        elif(r1==5 and r2==3 and r3==1):mpn = 110
        elif(r1==5 and r2==3 and r3==2):mpn = 140
        elif(r1==5 and r2==3 and r3==3):mpn = 170
        elif(r1==5 and r2==4 and r3==0):mpn = 130
        elif(r1==5 and r2==4 and r3==1):mpn = 170
        elif(r1==5 and r2==4 and r3==2):mpn = 220
        elif(r1==5 and r2==4 and r3==3):mpn = 280
        elif(r1==5 and r2==4 and r3==4):mpn = 350
        elif(r1==5 and r2==5 and r3==0):mpn = 240
        elif(r1==5 and r2==5 and r3==1):mpn = 300
        elif(r1==5 and r2==5 and r3==2):mpn = 500
        elif(r1==5 and r2==5 and r3==3):mpn = 900
        elif(r1==5 and r2==5 and r3==4):mpn = 1600
        elif(r1==5 and r2==5 and r3==5):mpn = "greater than or equal to " + str(1600)


        return str(mpn)

    

if __name__ == '__main__':
    app.run(debug = False)