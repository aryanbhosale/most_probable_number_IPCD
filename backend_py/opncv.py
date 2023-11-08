import cv2
import numpy as np

# Load the image
cropped_image = cv2.imread('/Users/harshvardhanmestha/Desktop/abc.png')

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

        # Calculate the average RGB value of the circular area in the current beaker
        total_pixels = np.sum(mask[:, :, 0] > 0)
        if total_pixels > 0:
            average_color = np.sum(roi, axis=(0, 1)) // total_pixels
        else:
            average_color = np.array([0, 0, 0])  # Default black color if no valid pixels are found

        # Add the average RGB value to the list
        average_colors.append(average_color)

        # Print the average RGB value of the liquid in the current beaker
        print(f'Beaker at row {i+1}, column {j+1} has average RGB color: {average_color}')

        # Draw circle around detected region
        cv2.circle(cropped_image, (center_x, center_y), circle_radius, (0, 255, 0), 2)

#cv2.imshow('Detected Beakers', cropped_image)
#cv2.waitKey(0)
#cv2.destroyAllWindows()