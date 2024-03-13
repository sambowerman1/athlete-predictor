import csv
import requests
from bs4 import BeautifulSoup
import time

# Replace these with your own login credentials
username = 'your_username'
password = 'your_password'

# Start a session
session = requests.Session()

# Replace with the URL of the login page
login_url = 'https://www.athletic.net/account/login'

# Your form data here
payload = {
    'username': username,
    'password': password
}

# Perform login
response = session.post(login_url, data=payload)
response.raise_for_status()  # Check if the login was successful

# Base URL for scraping
# base_url = 'https://www.athletic.net/TrackAndField/Division/Event.aspx?DivID=116302&Event=4&type=1' dont delete
base_url = 'https://www.athletic.net/TrackAndField/Division/Event.aspx?DivID=116302&Event=22&type=1&filter=11'

# Open a file to write
with open('/Users/sam/Desktop/track csvs/athletes.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # Write the header
    writer.writerow(['Athlete', 'Mark'])

    page_number = 0  # Start from the first page
    while True:
        # Modify the URL to access the current page, exclude page parameter for the first page
        page_url = base_url if page_number == 0 else f"{base_url}&page={page_number}"
        page = session.get(page_url)
        if page.status_code != 200:
            break  # If the page isn't found, exit the loop

        soup = BeautifulSoup(page.content, 'html.parser')

        # Find all table rows
        rows = soup.find_all('tr')

        # Check if there are rows to process, if not break the loop
        if not rows:
            break

        # Loop through each row
        for row in rows:
            # Find all cells in the row
            cells = row.find_all('td')
            if len(cells) > 5:  # Ensure there are enough cells
                # Extract the athlete's name and mark
                name = cells[4].get_text().strip()
                mark = cells[5].get_text().strip()
                # Write to CSV
                writer.writerow([name, mark])
                # Print the athlete's name and mark
                print(f"Athlete: {name}, Mark: {mark}")

        # Increment the page number to move to the next page
        page_number += 1

        # Pause between requests to not overload the server
        time.sleep(0.01)  # Sleep for 1 second





